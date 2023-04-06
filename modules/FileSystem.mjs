import NameTree from "./NameTree.mjs";

/*
* FILEDATA:
* Stores data held universally across filesystem nodes (drives, folders, files)
* Extended by the below types of filesystem nodes
*/
export class FileData
{
    #name;
    #size;
    #deletable;

    #created;
    #modified;
    #accessed;

    constructor(name, date = Date.now(), deletable = true)
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
    setName(name) { this.#name = name; }
    setSize(size) { this.#size = size; }
    setDeletable(val) { this.#deletable = val; }
    setDateModified(date) { this.#modified = date; }
    setDateAccessed(date) { this.#accessed = date; }

    // ================ BEHAVIORS ================ //
    toString() { return `${this.#name}, modified ${this.#modified}`; }
}



/*
* TEXTFILE:
* Stores basic file data
* Type is the file extension, content is contained text
*/
class TextFile extends FileData
{
    #type;
    #content;

    constructor(name, content, deletable = true, date = Date.now())
    {
        super(name, date, deletable);
        this.#content = content;
    }


}



/*
* DIRECTORY:
* Can be a drive or a normal directory
* Holds a map (#files) of names to TextFile objects
*/
class Directory extends FileData
{
    static driveRegex = /[A-Z]\:/;

    #isDrive;
    files;

    constructor(name)
    {
        super(name, Date.now());
        this.#isDrive = Directory.driveRegex.test(this.getName());
        this.files = new Map();
    }

    isDrive() { return this.#isDrive; }

}



/*
* FILESYSTEM: Manages file creation, deletion, and organization via directory tree
* 
* 
*/
export class FileSystem
{
    #fileTree;

    constructor(tree = null)
    {
        if (tree === null) 
        {
            let root = new Directory("C:")
            this.#fileTree = new NameTree(root, "C:");
        }
        else
        {
            this.#fileTree = tree;
        }
    }

    // ACCESSORS
    getFileTree()
    {
        return this.#fileTree;
    }
}



// export default FileSystem;
