import NameTree from "./NameTree.mjs";

/*
* FILEDATA:
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
        this.#metadata.setSize(content.length);
    }
    setName(name)
    {
        this.#type = name.slice(name.lastIndexOf('.')).toLowerCase();
        this.#metadata.setName(name);
    }

}



/*
* DIRECTORY:
* Can be a drive or a normal directory
* Holds a map (#files) of names to TextFile objects
*/
class Directory
{
    static driveRegex = /[A-Z]\:/;

    #metadata;
    #isDrive;
    #files;

    constructor(name)
    {
        this.#isDrive = Directory.driveRegex.test(this.getName());
        this.#metadata = new FileMetadata(name, !this.#isDrive, Date.now());
        this.#files = new Map();
    }

    isDrive() { return this.#isDrive; }
    getMetadata() { return this.#metadata; }

}



/*
* FILESYSTEM: Manages file creation, deletion, and organization via directory tree
* 
* 
*/
class FileSystem
{
    #fileTree;

    constructor()
    {
        this.#fileTree = new NameTree();
    }


    
}



export default FileSystem; 
