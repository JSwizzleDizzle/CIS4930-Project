
import Vec2 from "./Vec2.mjs";



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
    #size;
    #sizeNormalized;
    #sizeRatio;
    #position;
    #parent;
    #title;
    #style;

    #draggable;
    #fullscreen;
    #minimized;
    #hidden;

    // HTML Elements
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
        this.#parent = parent;
        this.#ID = id;
        this.#title = title;
        this.#style = style;
        this.#position = position;
        this.#size = size;
        this.#sizeNormalized = size;
        this.#sizeRatio = 1.0;
        
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

        this.#parent.appendChild(this.#eWindow);
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
        });
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
            this.#eWindow.style.left = "0px";
            this.#eWindow.style.top = "0px";
            this.#eWindow.style.width = "calc(100% - 2px)";
            this.#eWindow.style.height = "calc(100% - 2px)";
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
            this.#position.x = outer.left;
            flag = false;
        }
        if(outer.right < rect.right)
        {
            this.#position.x = outer.right - this.#size.x;
            flag = false;
        }
        if(outer.top > rect.top)
        {
            this.#position.y = outer.top;
            flag = false;
        }
        if(outer.bottom < rect.bottom)
        {
            this.#position.y = outer.bottom - this.#size.y;
            flag = false;
        }
        this.setPos(this.#position);
        return flag;
    }



    ////////////////////////////////////////////////////////////////
    //  ACCESSORS
    ////////////////////////////////////////////////////////////////
    getID() { return this.#ID; }
    getPos() { return this.#position; }
    getBoundingRect() { return this.#eWindow.getBoundingClientRect(); }
    getSize() { return this.#size; }
    getSizeNormalized() { return this.#sizeNormalized; }
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

    isFullScreen() { return this.#fullscreen; };
    isMinimized() { return this.#minimized; }
    isDraggable() { return this.#draggable; }
    isHidden() { return this.#hidden; }



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

    // Sets the position during dragging
    setPosBuffer(position)
    {
        const currentPos = this.#position.addR(position);
        this.#eWindow.style.left = `${currentPos.x}px`;
        this.#eWindow.style.top = `${currentPos.y}px`;
    }

    // Sets the "stable" size
    setSize(size)
    {
        this.#sizeNormalized = size;
        this.#size = this.#sizeNormalized.mulR(this.#sizeRatio);
        this.#eWindow.style.width = `${this.#size.x}px`;
        this.#eWindow.style.height = `${this.#size.y}px`;
    }

    setBoundingBoxSize(size)
    {
        this.#sizeNormalized = size;
        this.#size = this.#sizeNormalized.mulR(this.#sizeRatio);
    }

    // Sets size while resizing
    setSizeBuffer(size)
    {
        const currentSize = this.#size.addR(size);
        this.#eWindow.style.width = `${currentSize.x}px`;
        this.#eWindow.style.height = `${currentSize.y}px`;
    }

    // Sets size ratio (for viewport changes)
    setSizeRatio(ratio)
    {
        this.#sizeRatio = ratio;
        this.setSize(this.getSizeNormalized());
        //this.#eWindow.style.transform = `scale(${ratio})`;
    }

    // Hides window
    setHidden(hide)
    {
        this.#hidden = hide;
        this.#eWindow.style.display = this.#hidden ? "none" : "block";
    }

    
    
}



export default BaseWindow;
