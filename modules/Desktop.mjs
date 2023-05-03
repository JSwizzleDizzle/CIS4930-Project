
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

    #eChildWindows;

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
                //win.setSize(win.getSizeNormalized())
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
            this.#mousePosLast = new Vec2(event.clientX, event.clientY);
            this.#mouseDown = true;
        });

        this.#eWindow.addEventListener("mouseup", event => {
            for(const win of this.#eChildWindows)
            {
                if(win.isDraggable())
                {
                    win.getPos().add(this.#mouseDiff);
                    win.containWithin(this.#windowRect);
                }
            }
            this.#mousePosLast = new Vec2();
            this.#mouseDiff = new Vec2();
            this.#mouseDown = false;
            
        });

        this.#eWindow.addEventListener("mousemove", event => {
            if(this.#mouseDown)
            {
                this.#mousePosCurrent = new Vec2(event.clientX, event.clientY);
                this.#mouseDiff = this.#mousePosCurrent.subR(this.#mousePosLast);
                for(const win of this.#eChildWindows)
                {
                    if(win.isDraggable())
                    {
                        win.setPosBuffer(this.#mouseDiff);
                    }
                }
            }
        });


        this.#eWindow.addEventListener("keydown", event => {
            switch(event.keyCode)
            {
                case 38:
                    
                    for(const win of this.#eChildWindows)
                    {
                        win.containWithin(this.#windowRect);
                    }


                default:
                    break;
            }
        });

        this.#eWindow.addEventListener("resize", event => {
            
            
        });
    }

    registerWindow(window)
    {
        this.#eChildWindows.push(window);
    }

    refreshSize()
    {
        this.#windowRect = this.#eWindow.getBoundingClientRect();
        for(const win of this.#eChildWindows)
        {
            win.containWithin(this.#windowRect);
        }
    }
}



export default Desktop;
