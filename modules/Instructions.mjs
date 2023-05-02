import Vec2 from "./Vec2.mjs";
import BaseWindow from "./BaseWindow.mjs";

class Instructions
{
    ////////////////////////////////////////////////////////////////
    //  MEMBER ATTRIBUTES
    ////////////////////////////////////////////////////////////////
    #baseWindow;

    #eInstructions;
    #eBlock;

    constructor(parent, id, title = "instructions.txt", icon="instructions",position = new Vec2(450, 320), size = new Vec2(932, 649))
    {
        this.#baseWindow = new BaseWindow(parent, id, title, icon, position, size);
        this.#initialize();
    }
    #initialize(){

        this.#setupHTML(); 
    }
    
    #setupHTML(){

        // Bottom spacer block
        this.#eBlock = document.createElement("div");
        this.#eBlock.setAttribute("class", "filler");

        this.#eInstructions = this.#baseWindow.getWindowElements().eContent;
        this.#eInstructions.setAttribute("id", "instructions");
        this.#eInstructions.appendChild(this.#eBlock);
    }

    ////////////////////////////////////////////////////////////////
    //  ACCESSORS
    ////////////////////////////////////////////////////////////////
    getBaseWindow() { return this.#baseWindow; }
}



export default Instructions;