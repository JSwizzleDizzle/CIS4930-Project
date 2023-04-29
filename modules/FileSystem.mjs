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
export class TextFile extends FileData
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
export class Directory extends FileData
{
    static driveRegex = /[A-Z]\:/;

    #isDrive;
    files;

    constructor(name)
    {
        super(name, Date.now());
        this.setDeletable(false);
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

    // MUTATORS
    loadFromFile(s)
    {
        var file = s.split(/\r?\n/);
        var line = file[0].split(',');
        var tree = new NameTree(new Directory(line[1]), line[1]);
        for (let i = 1; i < file.length; i++)
        {
            var line = file[i].split(',');
                if (line[0] === 'd')
                {   
                    tree.addChildAbsolute(line[1], new Directory(line[1]), line.slice(2));
                }
                else if (line[0] === 'f')
                {
                    tree.addChildAbsolute(line[1], new TextFile(line[1], line[2]), line.slice(3));
                }
        }
        this.#fileTree = tree;
    }
}



// export default FileSystem;
