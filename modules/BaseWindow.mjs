
import Vec2 from "./Vec2.mjs";



class ResizeFlags
{
    // Flags for each side of the window
    left;
    right;
    top;
    bottom;

    constructor()
    {
        this.setFalse();
    }


    // Accessors
    setFalse()
    {
        this.left = false;
        this.right = false;
        this.top = false;
        this.bottom = false;
    }

    x() { return this.left || this.right; }
    y() { return this.top || this.bottom; }
    any() { return this.x() || this.y(); }
}



/*
* TERMINAL WINDOW:
* Encapsulates game user input window
* A container for the HTML elements that comprise a window
* Provides interfaces for user interaction via event listeners
*/
class BaseWindow
{
    ////////////////////////////////////////////////////////////////
    //  MEMBER ATTRIBUTES
    ////////////////////////////////////////////////////////////////
    // Properties
    #ID;
    #title;
    #style;

    // Size and position
    #size;
    #sizeRatio;
    #position;
    #zIndex;
    
    // Window interaction state flags
    #resizeFlags;
    #draggable;
    #fullscreen;
    #minimized;
    #hidden;

    // HTML Elements
    #eParent;
    #eWindow;
    #eTitleBar;
    #eTitle;
    #eMinimize;
    #eMaximize;
    #eClose;
    #eContent;
    #eTaskbar;


    
    constructor(parent, id, title = "Default Window", style = "default", position = new Vec2(1560, 320), size = new Vec2(384, 256))
    {
        this.#eParent = parent;
        this.#ID = id;
        this.#title = title;
        this.#style = style;
        this.#position = position;
        this.#zIndex = id;
        this.#size = size;
        this.#sizeRatio = 1.0;
        this.#resizeFlags = new ResizeFlags();
        
        this.#draggable = false;
        this.#fullscreen = false;
        this.#minimized = false;
        this.#hidden = false;

        this.#initialize();
    }



    ////////////////////////////////////////////////////////////////
    //  HELPER FUNCTIONS
    ////////////////////////////////////////////////////////////////
    // Sets up terminal context and variables
    #initialize()
    {
        this.#setupHTML();
        this.#setupEventListeners();
    }

    // Generates the HTML elements for a window
    #setupHTML()
    {
        // WINDOW BAR ELEMENTS
        // Title text
        this.#eTitle = document.createElement("div");
        this.#eTitle.setAttribute("class", "window-title");
        this.#eTitle.innerHTML = `<img src="images/icons/titlebar/${this.#style}-icon.png" alt="icon">\n<p>${this.#title}</p>`;
        // Minimize button
        this.#eMinimize = document.createElement("div");
        this.#eMinimize.setAttribute("class", "window-button gray");
        this.#eMinimize.innerHTML = `<img src="images/icons/titlebar/minimize.png" alt="min">`;
        // Maximize button
        this.#eMaximize = document.createElement("div");
        this.#eMaximize.setAttribute("class", "window-button gray");
        this.#eMaximize.innerHTML = `<img src="images/icons/titlebar/maximize.png" alt="max">`;
        // Close button
        this.#eClose = document.createElement("div");
        this.#eClose.setAttribute("class", "window-button red");
        this.#eClose.innerHTML = `<img src="images/icons/titlebar/close.png" alt="close">`;
        // The whole bar
        this.#eTitleBar = document.createElement("section");
        this.#eTitleBar.setAttribute("class", "bar");
        this.#eTitleBar.appendChild(this.#eTitle);
        this.#eTitleBar.appendChild(this.#eMinimize);
        this.#eTitleBar.appendChild(this.#eMaximize);
        this.#eTitleBar.appendChild(this.#eClose);
        // Main window area
        this.#eContent = document.createElement("section");
        this.#eContent.setAttribute("class", `${this.#style}-content`);
        //taskbar
        this.#eTaskbar = document.createElement("div");
    
        
        // Assemble the whole window
        this.#eWindow = document.createElement("article");
        this.#eWindow.setAttribute("class", "window");
        this.#eWindow.appendChild(this.#eTitleBar);
        this.#eWindow.appendChild(this.#eContent);
        this.setPos(this.#position);
        this.setSize(this.#size);

        this.#eParent.appendChild(this.#eWindow);
    }

    // Initializes base window event listeners for click interactions
    #setupEventListeners()
    {
        this.#eTitleBar.addEventListener("mousedown", () => {
            
            this.#draggable = !this.#fullscreen;
        });

        this.#eTitleBar.addEventListener("dblclick", () => {
            this.toggleFullScreen();
        });

        this.#eMinimize.addEventListener("click", () => {
            this.toggleMinimize();
        });

        this.#eMaximize.addEventListener("click", () => {
            this.toggleFullScreen();
        });

        this.#eClose.addEventListener("click", () => {
            this.toggleMinimize();
            this.setHidden(true);
        });

        document.addEventListener("mouseup", () => {
            this.#draggable = false;
            this.#resizeFlags.setFalse();
        });
    }



    ////////////////////////////////////////////////////////////////
    //  ACCESSORS
    ////////////////////////////////////////////////////////////////
    getID() { return this.#ID; }

    getPos() { return new Vec2(this.getBoundingRect().x, this.getBoundingRect().y); }
    getZIndex() { return this.#zIndex; }

    getBoundingRect() { return this.#eWindow.getBoundingClientRect(); }
    getSize() { return new Vec2(this.getBoundingRect().width, this.getBoundingRect().height); }

    getWindowElements()
    {
        return {
            eWindow: this.#eWindow,
            eTitleBar: this.#eTitleBar,
            eTitle: this.#eTitle,
            eMinimizeBtn: this.#eMinimize,
            eMaximizeBtn: this.#eMaximize,
            eCloseBtn: this.#eClose,
            eContent: this.#eContent
        };
    }

    isFullScreen() { return this.#fullscreen; }
    isMinimized() { return this.#minimized; }
    isHidden() { return this.#hidden; }

    isDraggable() { return this.#draggable; }
    isResizable(side = "any")
    {
        if(side === "any")
            return this.#resizeFlags.any();
        if(side === "x")
            return this.#resizeFlags.x();
        if(side === "y")
            return this.#resizeFlags.y();
        return this.#resizeFlags[side];
    }
    


    ////////////////////////////////////////////////////////////////
    //  MUTATORS
    ////////////////////////////////////////////////////////////////
    // Sets the "stable" position
    setPos(position)
    {
        this.#position = position;
        this.#eWindow.style.left = `${this.#position.x}px`;
        this.#eWindow.style.top = `${this.#position.y}px`;
    }

    addPos(position)
    {
        console.log("add");
        this.#position.add(position);
        this.#eWindow.style.left = `${this.#position.x}px`;
        this.#eWindow.style.top = `${this.#position.y}px`;
    }


    // Changes the z-index (depth) of the window
    setZIndex(z)
    {
        this.#zIndex = z;
        this.#eWindow.style.zIndex = this.#zIndex;
    }

    addZIndex(z)
    {
        this.#zIndex += z;
        this.#eWindow.style.zIndex = this.#zIndex;
    }


    // Sets the "stable" size
    setSize(size)
    {
        this.#size = size;
        const scaledSize = this.#size.mulR(this.#sizeRatio);
        this.#eWindow.style.width = `${scaledSize.x}px`;
        this.#eWindow.style.height = `${scaledSize.y}px`;
    }

    addSize(size)
    {
        this.#size.add(size.divR(this.#sizeRatio));
        const scaledSize = this.#size.mulR(this.#sizeRatio);
        this.#eWindow.style.width = `${scaledSize.x}px`;
        this.#eWindow.style.height = `${scaledSize.y}px`;
    }

    // Sets size ratio (for viewport changes)
    setSizeRatio(ratio)
    {
        this.#sizeRatio = ratio;
        this.setSize(this.#size);
        console.log(this.#sizeRatio);
    }


    // Sets resizability flags (cannot be resized while fullscreen)
    setResizable(side, val)
    {
        if(side === "reset")
            this.#resizeFlags.setFalse();
        else
            this.#resizeFlags[side] = val && !this.#fullscreen;
        
        //if(val) console.log(side);
    }


    // Hides window
    setHidden(hide)
    {
        this.#hidden = hide;
        this.#eWindow.style.display = this.#hidden ? "none" : "block";
    }

    
    ////////////////////////////////////////////////////////////////
    //  BEHAVIORS
    ////////////////////////////////////////////////////////////////
    // Sets window to viewport dimensions
    toggleFullScreen()
    {
        this.#fullscreen = !this.#fullscreen;
        if(this.#fullscreen)
        {
            this.#eMaximize.innerHTML = `<img src="images/icons/titlebar/unmaximize.png" alt="unmax">`;
            const rect = this.#eParent.getBoundingClientRect();
            this.#eWindow.style.left = `${rect.x}px`;
            this.#eWindow.style.top = `${rect.y}px`;
            this.#eWindow.style.width = `${rect.width}px`;
            this.#eWindow.style.height = `${rect.height}px`;
            console.log(this.#eWindow.style.width, this.#eWindow.style.height);
            console.log(rect.width, rect.height);
            console.log(rect);
        }
        else
        {
            this.#eMaximize.innerHTML = `<img src="images/icons/titlebar/maximize.png" alt="max">`;
            this.setPos(this.#position);
            this.setSize(this.#size);
        }
    }

    // Hides/shows window
    toggleMinimize()
    {
        this.#minimized = !this.#minimized;
        if(this.#minimized)
        {
            this.setHidden(true);
        }
        else
        {
            this.setHidden(false);
        }
    }

    // Returns true if the windows is protruding outide an arbitrary outer box
    containWithin(outer)
    {
        const rect = this.getBoundingRect();
        let flag = true;
        if(outer.left > rect.left)
        {
            this.setPos(new Vec2(outer.left, this.#position.y));
            flag = false;
        }
        if(outer.right < rect.right)
        {
            this.setPos(new Vec2(outer.right - this.getSize().x, this.#position.y));
            flag = false;
        }
        if(outer.top > rect.top)
        {
            this.setPos(new Vec2(this.#position.x, outer.top));
            flag = false;
        }
        if(outer.bottom < rect.bottom)
        {
            this.setPos(new Vec2(this.#position.x, outer.bottom - this.getSize().y));
            flag = false;
        }
        
        return flag;
    }
}



export default BaseWindow;
