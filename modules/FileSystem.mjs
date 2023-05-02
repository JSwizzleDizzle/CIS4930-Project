import NameTree from "./NameTree.mjs";

/*
* FILEMETADATA:
* Stores data held universally across filesystem nodes (drives, folders, files)
* Extended by the below types of filesystem nodes
*/
class FileMetadata
{
    #name;
    #size;
    #deletable;

    #created;
    #modified;
    #accessed;

    constructor(name, deletable = true, date = Date.now())
    {
        this.#name = name;
        this.#size = 0;
        this.#deletable = deletable;

        this.#created = date;
        this.#modified = date;
        this.#accessed = date;
    }



    // ================ ACCESSORS ================ //
    getName() { return this.#name; }
    getSize() { return this.#size; }
    isDeletable() { return this.#deletable; }
    getDateCreated() { return this.#created.toString(); }
    getDateModified() { return this.#modified.toString(); }
    getDateAccessed() { return this.#accessed.toString(); }

    // ================ MUTATORS ================ //
    setDateModified(date = Date.now()) { this.#modified = date; }
    setDateAccessed(date = Date.now()) { this.#accessed = date; }
    setDeletable(val)
    {
        this.setDateModified();
        this.#deletable = val;
    }
    setSize(size)
    {
        this.setDateModified();
        this.#size = size;
    }
    incrementSize(addedSize)
    {
        this.setDateModified();
        this.#size += addedSize;
    }
    setName(name)
    {
        this.setDateModified();
        this.#name = name;
    }
    


    // ================ BEHAVIORS ================ //
    toString() { return `${this.#name}, modified ${this.#modified}`; }
}



/*
* TEXTFILE:
* Stores basic file data
* Type is the file extension, content is contained text
*/
class TextFile
{
    #metadata;
    #content;
    #type;

    constructor(name, content, deletable = true, date = Date.now())
    {
        this.#content = content;
        this.#metadata = new FileMetadata(name, deletable, date);
        this.#metadata.setSize(content.length);
        this.#type = name.slice(name.lastIndexOf('.')).toLowerCase();
    }



    // ================ ACCESSORS ================ //
    getName() { return this.#metadata.getName(); }
    getSize() { return this.#metadata.getSize(); }
    isDeletable() { return this.#metadata.isDeletable(); }
    getType() { return this.#type; }
    getMetadata() { return this.#metadata; }
    getContent()
    {
        this.#metadata.setDateAccessed();
        return this.#content;
    }

    // ================ MUTATORS ================ //
    setContent(content)
    {
        this.#content = content;
        this.#metadata.setSize(this.#content.length);
    }
    setName(name)
    {
        this.#type = name.slice(name.lastIndexOf('.')).toLowerCase();
        this.#metadata.setName(name);
    }
    appendContent(content)
    {
        this.#content.concat(content);
        this.#metadata.setSize(this.#content.length);
    }

}



/*
* FILEFOLDER:
* Can be a drive or a normal directory
* Holds a map (#files) of names to TextFile objects
*/
class FileFolder
{
    static driveRegex = /[A-Z]\:/;

    #metadata;
    #isDrive;
    #files;

    constructor(name, files = [], deletable = true)
    {
        this.#isDrive = Directory.driveRegex.test(this.getName());
        this.#metadata = new FileMetadata(name, !this.#isDrive && deletable, Date.now());
        this.#files = new Map();
        this.addFiles(files);
    }



    // ================ ACCESSORS ================ //
    getName() { return this.#metadata.getName(); }
    getSize() { return this.#metadata.getSize(); }
    getMetadata() { return this.#metadata; }
    isDrive() { return this.#isDrive; }
    isEmpty() { return this.#files.size === 0; }
    
    getFile(fileName)
    {
        if(this.#files.has(fileName))
        {
            this.#metadata.setDateAccessed();
            return this.#files.get(fileName);
        }
        return null;
    }



    // ================ MUTATORS ================ //
    addFile(file, overwrite = false)
    {
        if(this.#files.has(file.getName()) && !overwrite)
            return false;

        this.#metadata.incrementSize(file.getSize());
        this.#files.set(file.getName(), file);
        return true;
    }

    addFiles(files, overwrite = false)
    {
        success = true;
        for(const file of files)
        {
            success = success && this.addFile(file, overwrite);
        }
        return success;
    }

    removeFile(fileName)
    {
        if(!this.#files.has(fileName))
            return false;

        this.#metadata.incrementSize(-file.getSize());
        this.#files.delete(file.getName());
        return true;
    }

    removeFiles(fileNames)
    {
        success = true;
        for(const fileName of fileNames)
        {
            success = success && this.removeFile(fileName);
        }
        return success;
    }
}



/*
* FILESYSTEM: Manages file creation, deletion, and organization via directory NameTree
* Directory NameTree nodes are directories which hold FileFolders as data and other directories as children
* The top directory is called "ROOT", which houses entire drives as its direct children
*/
class FileSystem
{
    // Regex for separating directory names
    static slashes = /\\|\//;
    // Regex for invalid name characters
    static invalidChars = /[<>:"/\\|?*]/;
    

    #fileTree;

    constructor()
    {
        this.#fileTree = new NameTree(new FileFolder("ROOT"));
    }



    // ================ HELPER FUNCTIONS ================ //



    // ================ ACCESSORS ================ //
    getDirectory(pathString)
    {
        // Split by '/' or by '\'
        const pathList = pathString.split(FileSystem.slashes);
        return this.#fileTree.getData(pathList);
    }

    getFile(pathString)
    {
        // Split by '/' or by '\'
        const pathList = pathString.split(FileSystem.slashes);
        const dir = this.#fileTree.getData(pathList.slice(0, -1));
        return dir ? dir.getFile(pathList.at(-1)) : null;
    }

    getDirectoryNames()
    {
        return this.#fileTree.getChildrenNames();
    }

    

    getPathString()
    {
        // Remove "ROOT" and join with '\'
        return this.#fileTree.getCurrentPath().slice(1, -1).join('\\') + '>';
    }



    // ================ MUTATORS ================ //
    setLocation(pathString)
    {
        return this.#fileTree.moveTo(pathString.split(FileSystem.slashes));
    }

    setLocationAbsolute(pathString)
    {
        return this.#fileTree.moveToAbsolute(pathString.split(FileSystem.slashes));
    }


    addDirectory(dirName, deletable)
    {
        const nameList = dirName.split(FileSystem.slashes);

        // Check for invalid chars
        for(const name of nameList)
        {
            if(name.match(FileSystem.invalidChars))
            {
                return false;
            }
        }

        // Add files along the directory list
        for(const name of nameList)
        {
            // Check if file exists, create it if it doesn't
            if(this.#fileTree.moveTo([name]))
            {
                continue;
            }
            else
            {
                this.#fileTree.addChild(name, new FileFolder(name, [], deletable));
                this.#fileTree.moveTo([name]);
            }
        }
        
        // Move pointer to start
        const backtrack = new Array(nameList.length);
        backtrack.fill("..");
        this.#fileTree.moveTo(backtrack);

        return true;
    }

    addDirectories(dirNames, deletable)
    {
        let success = true;
        for(const name of dirNames)
        {
            success = success && this.addDirectory(name, deletable);
        }
        return success;
    }

    addFile(name, deletable = true, content = "", overwrite = false)
    {
        return this.#fileTree.getData().addFile(new TextFile(name, content, deletable), overwrite);
    }

    addFiles(files)
    {

    }


    deleteDirectory(dirName)
    {
        const nameList = dirName.split(FileSystem.slashes);
        const path = nameList.slice(0, -1);
        return this.#fileTree.hasChild(path) && this.#fileTree.removeChild(nameList.at(-1), path);
    }

    deleteDirectories(dirNames)
    {
        let success = true;
        for(const name of dirNames)
        {
            success = success && this.deleteDirectory(name);
        }
        return success;
    }

    deleteFile(filePath)
    {
        const nameList = filePath.split(FileSystem.slashes);
        return removeChild(nameList.at(-1), nameList.split(0, -1));
    }

    deleteFiles(filePaths)
    {
        let success = true;
        for(const path of filePaths)
        {
            success = success && this.deleteFile(path);
        }
        return success;
    }

    // Probably won't need this
    /*
    moveDirectory(path)
    {

    }

    moveDirectories(path)
    {

    }

    moveFile(path)
    {

    }

    moveFiles(path)
    {

    }
    
    moveDirectoryAbsolute(path)
    {

    }

    moveDirectoriesAbsolute(path)
    {

    }

    moveFileAbsolute(path)
    {

    }

    moveFilesAbsolute(path)
    {

    }
    */

    buildFromFile(file)
    {

    }
    
}



export default FileSystem;
