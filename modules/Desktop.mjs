
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


                default:
                    break;
            }
        });
    }

    registerWindow(window)
    {
        this.#eChildWindows.push(window);
    }
}



export default Desktop;
