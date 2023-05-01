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

    constructor(name, files = [])
    {
        this.#isDrive = Directory.driveRegex.test(this.getName());
        this.#metadata = new FileMetadata(name, !this.#isDrive, Date.now());
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
    #fileTree;

    constructor()
    {
        this.#fileTree = new NameTree(new FileFolder("ROOT"));
    }



    // ================ ACCESSORS ================ //
    getFile()
    {

    }

    getDirectory()
    {

    }

    getPath()
    {
        
    }



    // ================ MUTATORS ================ //
    setLocation(path)
    {

    }

    setLocationAbsolute(path)
    {

    }


    addDirectory()
    {

    }

    addDirectories()
    {

    }

    addFile()
    {

    }

    addFiles()
    {

    }


    deleteDirectory(dirName)
    {

    }

    deleteDirectories(dirNames)
    {

    }

    deleteFile(fileName)
    {

    }

    deleteFiles(fileNames)
    {

    }


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


    buildFromFile(file)
    {

    }
    
}



export default FileSystem; 
