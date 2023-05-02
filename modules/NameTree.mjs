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

    // Moves from one tree location to another via a name path, returns null if the path is not found
    #navigateFrom(currentNode, path)
    {
        let travelNode = currentNode;
        for(const name of path)
        {
            travelNode = name === ".." ? travelNode.parent : travelNode.children.get(name);
        }
        return travelNode === undefined ? null : travelNode;
    }

    // Specific case of navigate: from nodePtr
    #getNode(path = [])
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

    // DATA: Retrieves node data
    getData(path = [])
    {
        const node = this.#getNode(path);
        return node ? node.data : null;
    }

    getDataAbsolute(path = [])
    {
        const node = this.#getNodeAbsolute(path);
        return node ? node.data : null;
    }

    hasChild(path = [])
    {
        return this.#navigateFrom(path) !== null;
    }


    // TRAVERSAL: Returns path to nodePtr as an array of name strings
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


    // CREATION: Adds child nodes
    addChild(name, data, path = [])
    {
        const parentNode = this.#getNode(path);
        if(parentNode === null)
        {
            return false;
        }

        parentNode.children.set(name, new Node(name, data, parentNode));
        return true;
    }

    addChildAbsolute(name, data, path = [])
    {
        const parentNode = this.#getNodeAbsolute(path);
        if(parentNode === null)
        {
            return false;
        }

        parentNode.children.set(name, new Node(name, data, parentNode));
        return true;
    }


    // REMOVAL: deletes child nodes
    removeChild(name, path = [])
    {
        const parentNode = this.#getNode(path);
        return parentNode !== null && parentNode.children.delete(name);
    }

    removeChildAbsolute(name, path)
    {
        const parentNode = this.#getNodeAbsolute(path);
        return parentNode !== null && parentNode.children.delete(name);
    }


    // DATA: sets node data
    setData(data, path = [])
    {
        if(this.#getNode(path) === null)
        {
            return false;
        }

        this.#getNode(path).data = data;
        return true;
    }

    setDataAbsolute(data, path = [])
    {
        if(this.#getNodeAbsolute(path) === null)
        {
            return false;
        }

        this.#getNodeAbsolute(path).data = data;
        return true;
    }


    // TRAVERSAL: Navigation of the NameTree by changing the nodePtr
    moveTo(path)
    {
        const destination = this.#getNode(path);
        if (destination === null || destination === undefined)
        {
            return false;
        }
        this.#nodePtr = destination;
        return true;
    }

    moveToAbsolute(path = [])
    {
        const save = this.#nodePtr;
        this.#nodePtr = this.#root;
        const success = this.moveTo(path);
        if(!success)
        {
            this.#nodePtr = save;
        }
        return success;
    }


    // STRUCTURE: Takes a node and reattach it somewhere else in the tree
    // SUS ALERT: Not yet tested, may just delete the node altogether
    transferNode(path, newPath)   
    {
        const currentNode = this.#getNode(path);
        const newParent = this.#getNode(newPath);

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


    // KEY NODES: Creation, retrieval, and deletion of saved node points
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

