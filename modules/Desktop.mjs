
import Vec2 from "./Vec2.mjs";
import BaseWindow from "./BaseWindow.mjs";



/*
* DESKTOP: Stores the entire game state
* 
* 
*/
class Desktop
{
    #eWindow;
    #windowRect;
    #sizeRatio;
    #resizeRadius;

    #childWindows;
    #activeChildID;

    #mouseDown = false;
    #mousePosLast = new Vec2();
    #mousePosCurrent = new Vec2();
    #mouseDiff = new Vec2();


    constructor(windowElement)
    {
        this.#eWindow = windowElement;
        this.#windowRect = this.#eWindow.getBoundingClientRect();
        this.#childWindows = new Map();
        this.#activeChildID = 0;
        this.#sizeRatio = 1.0;
        this.#resizeRadius = 15.0;

        this.#initialize();
    }



    #initialize()
    {
        this.#setupHTML();
        this.#setupEventListeners();

        
    }

    #setupHTML()
    {
        
    }

    #setupEventListeners()
    {
        // Refreshes child windows when resized
        new ResizeObserver(() => {
            this.#windowRect = this.#eWindow.getBoundingClientRect();
            this.#sizeRatio = this.#eWindow.clientWidth / 1920;
            for(const win of this.#childWindows.values())
            {
                win.setSizeRatio(this.#sizeRatio);
                win.containWithin(this.#windowRect);
            }
        }).observe(this.#eWindow);


        // Initial mouse click
        this.#eWindow.addEventListener("mousedown", event => {
            // Record mouse position
            this.#mousePosLast = new Vec2(event.clientX, event.clientY);
            this.#mouseDown = true;

            for(const win of this.#childWindows.values())
            {
                // Move window to front if clicked
                if(win.isDraggable())
                {
                    this.activateWindow(win);
                    event.stopPropagation();
                }
            }

            // Set resize flags if cursor is in the right area
            this.setWindowResizeFlags(this.getActiveWindow(), event.clientX, event.clientY);
        });


        // Single mouse release
        this.#eWindow.addEventListener("mouseup", event => {
            for(const win of this.#childWindows.values())
            {
                if(win.isDraggable())
                {
                    win.addPos(this.#mouseDiff);
                }
            }
            this.#mousePosLast = new Vec2();
            this.#mouseDiff = new Vec2();
            this.#mouseDown = false;

            // Reset window size flags
            this.setWindowResizeFlags(this.getActiveWindow(), event.clientX, event.clientY);
            
        });


        // Called every frame of movement
        this.#eWindow.addEventListener("mousemove", event => {

            this.updateCursorStyle(this.getActiveWindow());

            if(this.#mouseDown)
            {
                // Record mouse position and calculate cursor displacement
                this.#mousePosCurrent = new Vec2(event.clientX, event.clientY);
                this.#mouseDiff = this.#mousePosCurrent.subR(this.#mousePosLast);

                const win = this.getActiveWindow();
                if(win.isDraggable())
                {
                    win.addPos(this.#mouseDiff);
                    win.containWithin(this.#windowRect);
                }


                const addedSize = new Vec2();
                let yFactor = 1;
                let xFactor = 1;

                if(win.isResizable("left"))
                {
                    win.addPos(new Vec2(this.#mouseDiff.x, 0));
                    xFactor = -1;
                }
                if(win.isResizable("x"))
                {
                    addedSize.x += this.#mouseDiff.x * xFactor;
                }

                if(win.isResizable("top"))
                {
                    win.addPos(new Vec2(0, this.#mouseDiff.y));
                    yFactor = -1;
                }
                if(win.isResizable("y"))
                {
                    addedSize.y += this.#mouseDiff.y * yFactor;
                }

                win.addSize(addedSize);
                
                // Record current mouse position for next iteration
                this.#mousePosLast = this.#mousePosCurrent;
            }

        });


        this.#eWindow.addEventListener("keydown", event => {
            switch(event.keyCode)
            {
                default:
                    break;
            }
        });
    }

    getActiveWindow()
    {
        return this.#childWindows.get(this.#activeChildID);
    }

    // Adds a window to child windows
    registerWindow(window)
    {
        if(this.#childWindows.has(window.getID()))
            return false;

        this.#childWindows.set(window.getID(), window);
        return true;
    }

    // Moves a selected window to the front on the z axis
    activateWindow(window)
    {
        // Set active ID
        this.#activeChildID = window.getID();

        // Reorder windows on z axis
        for(const win of this.#childWindows.values())
        {
            if(win.getZIndex() > window.getZIndex())
            {
                win.addZIndex(-1);
            }
        }
        window.setZIndex(this.#childWindows.length - 1);
    }

    setWindowResizeFlags(window, mouseX, mouseY)
    {
        // Store pixel gaps between mouse cursor and window borders
        const rect = window.getBoundingRect();
        const leftGap = mouseX - rect.x;
        const rightGap = mouseX - (rect.x + rect.width);
        const topGap = mouseY - rect.y;
        const bottomGap = mouseY - (rect.y + rect.height);

        const yHeightValid = mouseY > rect.y - this.#resizeRadius && mouseY < rect.y + rect.height + this.#resizeRadius;
        const xWidthValid = mouseX > rect.x - this.#resizeRadius && mouseX < rect.x + rect.width + this.#resizeRadius;
        //console.log(leftGap, rightGap, topGap, bottomGap);

        // Check side borders if mouse is in the correct y range 
        if(yHeightValid)
        {
            // Flag left or right if the mouse is close enough to the border
            window.setResizable("left", leftGap < 0 && leftGap > -this.#resizeRadius);
            window.setResizable("right", rightGap > 0 && rightGap < this.#resizeRadius);
        }
        
        // Check top/bottom borders if mouse is in the correct x range 
        if(xWidthValid)
        {
            // Flag top or bottom if the mouse is close enough to the border
            window.setResizable("top", topGap < 0 && topGap > -this.#resizeRadius);
            window.setResizable("bottom", bottomGap > 0 && bottomGap < this.#resizeRadius);
        }
    }

    updateCursorStyle(window)
    {
        const resizeX = window.isResizable("x");
        const resizeY = window.isResizable("y");

        if(resizeX && resizeY)
        {
            document.body.style.cursor = "move";
        }
        else if(resizeX)
        {
            document.body.style.cursor = "ew-resize";
        }
        else if(resizeY)
        {
            document.body.style.cursor = "ns-resize";
        }
        else
        {
            document.body.style.cursor = "default";
        }
    }

    
}



export default Desktop;
