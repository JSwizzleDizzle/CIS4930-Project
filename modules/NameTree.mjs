/*
* NODE: A single node or cell of a tree
* Stores its own name and a value
* Contains references to one parent and numerous children for tree navigation
*/
class Node
{
    name;
    data;
    parent;
    children;

    constructor(name, data, parent = null, children = new Map())
    {
        this.name = name;
        this.data = data;
        this.parent = parent;
        this.children = children;
    }


    empty() { return this.children.size === 0; }
    toString() { return `${this.name} in ${this.parent ? this.parent.name : "NameTree"}`; }
}



/*
* NAMETREE:
* A tree which supports an arbitrary number of children per node
* Nodes store maps of names to children rather than a plain array, hence "NameTree"
* The current location is stored in nodePtr, which is the starting point of relative navigation
*/
class NameTree
{
    #root;
    #nodePtr;
    #keyNodes;

    constructor(rootData, rootName = "root")
    {
        this.#root = new Node(rootName, rootData);
        this.#nodePtr = this.#root;
        this.#keyNodes = new Map();
    }



    ////////////////////////////////////////////////////////////////
    //  HELPER METHODS
    ////////////////////////////////////////////////////////////////

    // Moves from one tree location to another via a name path, returns false if the path is not found
    #navigateFrom(currentNode, path)
    {
        let travelNode = currentNode;
        for(const name of path)
        {
            travelNode = name === ".." ? travelNode.parent : travelNode.children.get(name);
        }
        return travelNode === undefined ? false : travelNode;
    }

    // Specific case of navigate: from nodePtr
    getNode(path = [])
    {
        return this.#navigateFrom(this.#nodePtr, path);
    }

    // Specific case of navigate: from root
    #getNodeAbsolute(path)
    {
        return this.#navigateFrom(this.#root, path);
    }



    ////////////////////////////////////////////////////////////////
    //  ACCESSORS
    ////////////////////////////////////////////////////////////////

    // Retrieve node data
    getData(path = [])
    {
        return this.getNode(path).data;
    }

    getDataAbsolute(path = [])
    {
        return this.#getNodeAbsolute(path).data;
    }

    // Returns path to nodePtr as an array of name strings
    getCurrentPath()
    {
        let currentNode = this.#nodePtr;
        const path = [];
        while(currentNode.parent)
        {
            path.push(currentNode.name);
            currentNode = currentNode.parent;
        }
        path.push(this.#root.name);
        return path.reverse();
    }

    getParent()
    {
        this.#nodePtr = this.#nodePtr.parent;
        return this.#nodePtr.parent;
    }

    ////////////////////////////////////////////////////////////////
    //  MUTATORS:
    //  Each method has a relative and absolute version
    //  Relative works from nodePtr, absolute works from root
    ////////////////////////////////////////////////////////////////

    // Adding children
    addChild(name, data, path = [])
    {
        const parentNode = this.getNode(path);
        parentNode.children.set(name, new Node(name, data, parentNode));
    }

    addChildAbsolute(name, data, path = [])
    {
        const parentNode = this.#getNodeAbsolute(path);
        parentNode.children.set(name, new Node(name, data, parentNode));
    }

    // Creation, retrieval, and deletion of saved node points
    saveKeyNode(name)
    {
        const keyPtr = this.#nodePtr;
        this.#keyNodes.set(name, keyPtr);
    }

    loadKeyNode(name)
    {
        this.#nodePtr = this.#keyNodes.get(name);
    }

    deleteKeyNode(name)
    {
        this.#keyNodes.delete(name);
    }

    // Removing children
    removeChild(name)
    {
        const parentNode = this.#nodePtr;
        return parentNode.children.delete(name);
    }
    removeChild(name, path = [])
    {
        const parentNode = this.getNode(path);
        return parentNode.children.delete(name);
    }

    removeChildAbsolute(name, path)
    {
        const parentNode = this.#getNodeAbsolute(path);
        return parentNode.children.delete(name);
    }

    // Editing child data
    setData(data, path = [])
    {
        this.getNode(path).data = data;
    }

    setDataAbsolute(data, path = [])
    {
        this.#getNodeAbsolute(path).data = data;
    }

    // Navigate by changing the nodePtr
    moveTo(path)
    {
        var isValidNode = this.#nodePtr;
        for(const name of path)
        {
            isValidNode = name === ".." ? this.#nodePtr.parent : this.#nodePtr.children.get(name);
        }
        //invalid nodes are null/undefined or files that can be deleted (e.g. Text files)
        if (isValidNode === null || isValidNode === undefined || isValidNode.data.isDeletable()) return false;
        this.#nodePtr = isValidNode;
        return true;
    }

    moveToAbsolute(path = [])
    {
        this.#nodePtr = this.#root;
        this.moveTo(path);
    }

    // Take a node and reattach it somewhere else in the tree
    // SUS ALERT: Not yet tested, may just delete the node altogether
    transferNode(path, newPath)   
    {
        const currentNode = this.getNode(path);
        const newParent = this.getNode(newPath);

        newParent.children.set(currentNode.name, currentNode);
        currentNode.parent.children.delete(currentNode.name);
    }

    transferNodeAbsolute(path, newPath)
    {
        const currentNode = this.#getNodeAbsolute(path);
        const newParent = this.#getNodeAbsolute(newPath);

        newParent.children.set(currentNode.name, currentNode);
        currentNode.parent.children.delete(currentNode.name);
    }



    ////////////////////////////////////////////////////////////////
    //  BEHAVIORS
    ////////////////////////////////////////////////////////////////

    // Prints the tree in breadth-first fashion
    printLevels()
    {
        let currentNodes = [];
        let nodeBuffer = [];
        this.#root.children.forEach((val) => {
            currentNodes.push(val);
        });

        console.log(this.#root.toString());
        while(currentNodes.length > 0)
        {
            console.log(currentNodes.toString() + ", ");
            for(const node of currentNodes)
            {
                node.children.forEach((val) => {
                    nodeBuffer.push(val);
                });
            }
            currentNodes = nodeBuffer;
            nodeBuffer = [];
        }

        
    }

}



export default NameTree;

