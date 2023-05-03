
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

    #eChildWindows;
    #activeChildID;

    #mouseDown = false;
    #mousePosLast = new Vec2();
    #mousePosCurrent = new Vec2();
    #mouseDiff = new Vec2();


    constructor(windowElement)
    {
        this.#eWindow = windowElement;
        this.#windowRect = this.#eWindow.getBoundingClientRect();
        this.#eChildWindows = [];
        this.#sizeRatio = 1.0;
        this.#resizeRadius = 15.0;

        this.#initialize();
    }



    #initialize()
    {
        this.#setupHTML();
        this.#setupEventListeners();

        // Refreshes child windows when resized
        new ResizeObserver(() => {
            this.#windowRect = this.#eWindow.getBoundingClientRect();
            this.#sizeRatio = this.#eWindow.clientWidth / 1920;
            for(const win of this.#eChildWindows)
            {
                win.setSizeRatio(this.#sizeRatio);
                win.containWithin(this.#windowRect);
            }
        }).observe(this.#eWindow);
    }

    #setupHTML()
    {
        
    }

    #setupEventListeners()
    {
        this.#eWindow.addEventListener("mousedown", event => {
            // Record mouse position
            this.#mousePosLast = new Vec2(event.clientX, event.clientY);
            this.#mouseDown = true;

            for(const win of this.#eChildWindows)
            {
                // Move window to front if clicked
                if(win.isDraggable())
                {
                    this.activateWindow(win);
                    event.stopPropagation();
                }

                // Resize window if necessary
                this.setWindowResizeFlags(win, event.clientX, event.clientY);
            }
        });

        this.#eWindow.addEventListener("mouseup", event => {
            for(const win of this.#eChildWindows)
            {
                if(win.isDraggable())
                {
                    win.getPos().add(this.#mouseDiff);
                    win.containWithin(this.#windowRect);
                }
                if(win.isResizable())
                {
                    win.getSizeNormalized().add(this.#mouseDiff);
                    win.getSize().add(this.#mouseDiff);
                    win.containWithin(this.#windowRect);
                }
                win.setResizable("reset", false);
            }
            this.#mousePosLast = new Vec2();
            this.#mouseDiff = new Vec2();
            this.#mouseDown = false;
            
        });

        this.#eWindow.addEventListener("mousemove", event => {
            if(this.#mouseDown)
            {
                // Record mouse position and calculate cursor displacement
                this.#mousePosCurrent = new Vec2(event.clientX, event.clientY);
                this.#mouseDiff = this.#mousePosCurrent.subR(this.#mousePosLast);

                for(const win of this.#eChildWindows)
                {
                    const sizeBuffer = new Vec2(
                        win.isResizable("x") ? this.#mouseDiff.x  : 0,
                        win.isResizable("y") ? this.#mouseDiff.y : 0
                    );
                    win.setSizeBuffer(sizeBuffer);

                    if(win.isDraggable())
                    {
                        win.setPosBuffer(this.#mouseDiff);
                    }
                }
            }

            this.updateCursorStyle()
        });


        this.#eWindow.addEventListener("keydown", event => {
            switch(event.keyCode)
            {
                default:
                    break;
            }
        });
    }

    registerWindow(window)
    {
        this.#eChildWindows.push(window);
    }

    setWindowResizeFlags(window, mouseX, mouseY)
    {
        const rect = window.getBoundingRect();
        const leftGap = mouseX - rect.x;
        const rightGap = mouseX - (rect.x + rect.width);
        const topGap = mouseY - rect.y;
        const bottomGap = mouseY - (rect.y + rect.height);
        //console.log(leftGap, rightGap, topGap, bottomGap);

        if(leftGap < 0 && leftGap > -this.#resizeRadius)
        {
            // Resize on left
            window.setResizable("left", true);
            window.setDraggable(true);
            console.log("left");
        }
        else if(rightGap > 0 && rightGap < this.#resizeRadius)
        {
            // Resize on right
            window.setResizable("right", true);
            console.log("right");
        }
        
        if(topGap < 0 && topGap > -this.#resizeRadius)
        {
            // Resize on top
            window.setResizable("top", true);
            window.setDraggable(true);
            console.log("top");
        }
        else if(bottomGap > 0 && bottomGap < this.#resizeRadius)
        {
            // Resize on bottom
            window.setResizable("bottom", true);
            console.log("bottom");
        }
    }

    // Moves a selected window to the front on the z axis
    activateWindow(window)
    {
        //
        this.#activeChildID = window.getID();

        // Reorder windows on z axis
        for(const win of this.#eChildWindows)
        {
            if(win.getZIndex() > window.getZIndex())
            {
                win.addZIndex(-1);
            }
        }
        window.setZIndex(this.#eChildWindows.length - 1);
    }

    refreshSize()
    {
        this.#windowRect = this.#eWindow.getBoundingClientRect();
        for(const win of this.#eChildWindows)
        {
            win.containWithin(this.#windowRect);
        }
    }

    updateCursorStyle()
    {
        let resizeX = false;
        let resizeY = false;
        for(const win of this.#eChildWindows)
        {
            resizeX = resizeX || win.isResizable("x");
            resizeY = resizeY || win.isResizable("y");
            console.log(resizeX, resizeY);
        }

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
