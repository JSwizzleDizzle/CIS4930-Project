
import Vec2 from "./Vec2.mjs";
import ResourceManager from "./ResourceManager.mjs";
import BaseWindow from "./BaseWindow.mjs";
import FileSystem from "./FileSystem.mjs";
import User from "./UserStats.mjs";



/*
* TERMINAL:
* Has a window which allows for the user to input commands
* I document better later OK?
*/
class Terminal
{
    ////////////////////////////////////////////////////////////////
    //  MEMBER ATTRIBUTES
    ////////////////////////////////////////////////////////////////
    #baseWindow;

    // Properties
    #directory;
    #prompt;
    #currentEntry;
    #entryHistory;
    #entryPtr;
    #awaitingCommand;
    #running;
    #numLines;
    #enCounter;
    #bossCounter;
    #fighting;
    #user;
    #enemy;
    #sprite;
    #bossName;
    #bossSprite;
    #deletables;
    #safe;


    // HTML Elements
    #eWindow;
    #eTerminal;
    #eCurrentLine;
    #eActiveEntry;
    #eBlock;
    #eTextbox;
    #eTaskbar;

    // Data
    #fileSystem;
    #file1;
    #file2;
    #file3;



    // Maps command strings to function names to be called by the invoking terminal instance
    static commands = new Map([
        ["", "cmdNone"],
        ["cd", "cmdChangeDir"], 
        ["chdir", "cmdChangeDir"], 
        ["cls", "cmdClearScreen"], 
        ["color", "cmdColor"], 
        ["del", "cmdDelete"], 
        ["dir", "cmdDirectory"], 
        ["echo", "cmdEcho"], 
        ["exit", "cmdExit"], 
        ["help", "cmdHelp"], 
        ["title", "cmdTitle"], 
        ["tree", "cmdTree"], 
        ["terminal.exe", "cmdTerminalExe"],
        ["ls", "cmdDirectory"],
        ["enter", "cmdStart"],
        ["ENTER", "cmdStart"],
        ["att", "cmdAttack"],
        ["inv", "cmdInventory"],
        ["inventory", "cmdInventory"],
        ["use", "cmdUseItem"],
        ["reset", "cmdReset"]
    ]);

    constructor(parent, id, filesys = new FileSystem(), file2 = new FileSystem(), file3 = new FileSystem(), file4 = new FileSystem(), directory = `C:\\>`, title = "C:\\Windows\\System32\\cmd.exe", icon = "terminal", position = new Vec2(450, 320), size = new Vec2(976, 512))
    {
        this.#baseWindow = new BaseWindow(parent, id, title, icon, position, size);

        this.#directory = directory;
        this.#prompt = directory;
        this.#currentEntry = "";
        this.#entryHistory = [];
        this.#entryPtr = 0;
        this.#awaitingCommand = false;
        this.#running = false;
        this.#fileSystem = filesys;
        this.#enCounter = 0;
        this.#bossCounter = 0;
        this.#bossName = "Windows Defender"
        this.#bossSprite = "images/ascii-images/enemies/msoft";
        this.#fighting = false;
        this.#user = new User("Guest",20,5,Math.random(),Math.random());
        this.#deletables = 36;
        this.#file1 = file4;
        this.#file2 = file2;
        this.#file3 = file3;

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
        this.#startPrompt();
    }

    // Generates the HTML for a terminal
    #setupHTML()
    {
        // Editable portion of line
        this.#eActiveEntry = document.createElement("span");
        this.#eActiveEntry.setAttribute("contenteditable", true);

        // Whole current line
        this.#eCurrentLine = document.createElement("pre");
        this.#eCurrentLine.setAttribute("class", "active-line");
        this.#eCurrentLine.textContent = this.#prompt;
        this.#eCurrentLine.appendChild(this.#eActiveEntry);
        this.#eCurrentLine.focus();

        // The text editor area
        this.#eTextbox = document.createElement("section");
        this.#eTextbox.setAttribute("class", "terminal-text");

        // Bottom spacer block
        this.#eBlock = document.createElement("div");
        this.#eBlock.setAttribute("class", "spacer"); 
        
        // The window content section
        this.#eTerminal = this.#baseWindow.getWindowElements().eContent;
        this.#eTerminal.style.backgroundColor = "rgb(12, 12, 12)";
        this.#eTerminal.appendChild(this.#eTextbox);
        this.#eTerminal.appendChild(this.#eBlock);

        // The whole window
        this.#eWindow = this.#baseWindow.getWindowElements().eWindow;

        //this.#eTaskbar = document.getElementById("taskbar");
        //this.#eTaskbar.innerHTML = `<img class="taskbar-terminal-image" src="images/taskbar/taskbar-terminal.png" alt="terminal taskbar"><img class="taskbar-terminal-overlay" id="terminal-button"src="images/taskbar/taskbar-terminal.png" alt="terminal taskbar">`;
        
        this.#eWindow.setAttribute("class", "terminal window");
    }

    // Initializes cmd window event listeners
    #setupEventListeners()
    {
        /*

        document.getElementById("terminal-button").addEventListener("click", () => {
            this.getBaseWindow().toggleMinimize();
        });*/
        
        this.#eWindow.addEventListener("click", () => {
            this.#eActiveEntry.focus();
        });

        this.#eWindow.addEventListener("keydown", event => {

            switch(event.keyCode)
            {
                case 13:
                    // Newline ('\n')
                    event.preventDefault();
                    this.submitEntry();
                    break;

                case 38:
                    // Up arrow
                    this.#entryPtr = Math.max(0, this.#entryPtr - 1);
                    this.#eActiveEntry.textContent = this.#entryHistory.length !== 0 ? this.#entryHistory[this.#entryPtr] : "";
                    break;

                case 40:
                    // Down arrow
                    if(this.#entryPtr !== this.#entryHistory.length)
                    {
                        this.#entryPtr = Math.min(this.#entryPtr + 1, this.#entryHistory.length - 1);
                    }
                    this.#eActiveEntry.textContent = this.#entryPtr === this.#entryHistory.length ? this.#eActiveEntry.textContent : this.#entryHistory[this.#entryPtr];
                    break;

                default:
                    this.#entryPtr = this.#entryHistory.length;
                    break;
            }
        });
    }

    // Readies for first user input
    #startPrompt()
    {
        this.printFile("resources/cmd-header.txt");
        //Title screen
        this.cmdTerminalExe();
        
        this.#eTerminal.scrollTop = 0;
        //this.awaitCommand();
    }



    ////////////////////////////////////////////////////////////////
    //  USER COMMANDS
    ////////////////////////////////////////////////////////////////

    cmdChangeDir(args)
    {   
        if(this.#fighting){
            this.printLine("You can't escape!!")
        }
        else if(this.#running){
            this.printLine();
            if( this.#fileSystem.setLocation(args) ){
                this.#directory = args;
                $.ajax({
                    url: "./updates/Directory.php",
                    type: "POST",
                    data: {arg: args},
                    success: function(response) {
                        console.log(response);
                    },
                    error: function(xhr, status, error) {
                      console.log("Error: " + error);
                    }
                  });
            }else{
                this.printFile("resources/cmd-cd-error.txt");
            }

            //Encounter chance
            this.#enCounter += (Math.random() * 5);
        }
        this.awaitCommand();
    }
    
    cmdClearScreen(args)
    {
        this.#numLines = 0;
        this.#entryHistory = [];
        this.#eTextbox.innerHTML = "";
        this.#eTerminal.scrollTop = 0;
        this.printLine();
        if(!this.#running){
            this.cmdTerminalExe();
            return;
        }
        this.awaitCommand();
    }

    cmdColor(args)
    {   
        let background = args.toString().charAt(0).toLowerCase();
        let foreground = args.toString().charAt(1).toLowerCase();
        let currBackground = this.#eTerminal.style.backgroundColor;

        let colors = new Map([
            ["0", "rgb(12, 12, 12)"],    // black
            ["1", "rgb(0, 0, 255)"],     // blue
            ["2", "rgb(0, 255, 0)"],     // green
            ["3", "rgb(0, 255, 255)"],   // aqua
            ["4", "rgb(255, 0, 0)"],     // red
            ["5", "rgb(160, 32, 240)"],  // purple
            ["6", "rgb(255, 255, 0)"],   // yellow
            ["7", "rgb(208, 208, 208)"], // white
            ["8", "rgb(128, 128, 128)"], // grey
            ["9", "rgb(173, 216, 230)"], // light blue
            ["a", "rgb(144, 238, 144)"], // light green
            ["b", "rgb(48, 213, 200)"],  // light aqua
            ["c", "rgb(255, 204, 203)"], // light red
            ["d", "rgb(203, 195, 227)"], // light purple
            ["e", "rgb(255, 250, 160)"], // light yellow
            ["f", "rgb(255, 255, 255)"]  // bright white
        ]);


        if ((foreground != "" && foreground == background) ||
           (args.toString().length == 1 && colors.get(background) == currBackground))
        {   // edge case: (foreground : background) are the same
            this.printFile("resources/cmd-color-error.txt");
            this.awaitCommand();
            return;
        }
        
        switch(args.toString().length)
        {

            case 0:
                // default theme (white : black)
                this.#eTextbox.style.color = colors.get("7");
                this.#eTerminal.style.backgroundColor = colors.get("0");
                break;

            case 1: 
                // sets foreground color only
                foreground = background;
                colors.has(foreground) ? this.#eTextbox.style.color = colors.get(foreground) : this.printFile("resources/cmd-color-error.txt");
                break;
                
            case 2: 
                // sets foreground and background
                if (colors.has(foreground) && colors.has(background))
                {
                    this.#eTextbox.style.color = colors.get(foreground);
                    this.#eTerminal.style.backgroundColor = colors.get(background);
                } 
                else 
                { 
                    this.printFile("resources/cmd-color-error.txt"); 
                }
                break;
                
            default: 
                //invalid input
                this.printFile("resources/cmd-color-error.txt");

        }

        this.awaitCommand();
    }

    cmdDelete(args)
    {
        if(this.#fighting)
        {
            this.printLine("You can't delete while in combat!!")
        }
        else if(this.#running)
        {
            

            this.printLine();
            const file = this.#fileSystem.getFile(args);
            if (!file)
            {
                this.printLine("'" + args + "' does not exist");
            }
            else if (!file.isDeletable())
            {
                this.printLine("'" + args + "' is not deletable");
            }
            else if (file.isLocked())
            {
                if (this.#user.removeItem("key"))
                {
                    this.printLine("1 file key consumed!")
                    this.printLine("'" + args + "' was successfully unlocked and deleted")
                    //Counting down files in map
                    this.#deletables --;
                }
                else
                {
                    this.printLine("ERROR: '" + args + "' is locked! collect a file key to delete it")
                }
            }
            else
            {
                if(!this.#safe){
                    //75% encounter chance when stealing files
                    let fileFight = Math.random();
                    if(fileFight <= .75){
                    this.#fight(args, 10, "grunt", "images/ascii-images/enemies/file");
                    this.awaitCommand();
                    return;
                    }
                }

                this.#fileSystem.deleteFile(args);
                this.printLine("'" + args + "' was successfully deleted");
                $.ajax({
                    url: "./updates/Map.php",
                    type: "POST",
                    data: {
                           Map: this.#fileSystem.mapToText(), // this should call the maptotext
                          },
                    success: function(response) {
                        console.log(response);
                    },
                    error: function(xhr, status, error) {
                      console.log("Error: " + error);
                    }
                  });
                //Counting down files in map
                this.#deletables --;

                let chance = Math.random();
                if (chance < 0.2)
                {
                    if(this.#user.addItem("heal"))
                    {
                        this.printLine("1 corrupted file added to inventory!");
                    }
                }
                if (chance > 0.9)
                {
                    if(this.#user.addItem("key"))
                    {
                        this.printLine("1 file key added to inventory!");
                    }
                }
                if(this.#safe){
                    this.#safe = false;
                    return;
                }
            }
            
        }
        this.awaitCommand();
    }

    cmdDirectory(args)
    {
        if(this.#running){
        this.printLine();
        for (const name of this.#fileSystem.getDirectoryNames())
        {
            this.printLine(name);
        }
        for (const name of this.#fileSystem.getFileNames())
        {
            this.printLine(name);
        }
        this.printLine();
        }
        this.awaitCommand();
    }
    
    cmdEcho(args)
    {
        this.printLine(args);
        this.awaitCommand();
    }
    
    cmdExit(args)
    {
        this.#baseWindow.setHidden(true);
        this.#numLines = 0;
        this.#entryHistory = [];
        this.#eTextbox.innerHTML = "";
        this.#eTerminal.scrollTop = 0;
        this.printFile("resources/cmd-header.txt");
        this.awaitCommand();
    }

    cmdHelp(args)
    {
        this.printFile("resources/help.txt");
        this.awaitCommand();
    }

    cmdInventory(args)
    {
        if(this.#running){
            this.printLine("");
            this.printLine("---------- INVENTORY ----------");
            this.printLine("corrupted files (healing): " + this.#user.inventory.items.get("heal"));
            this.printLine("file keys (access): " + this.#user.inventory.items.get("keys"));
            this.printLine("enter 'use [ ITEM_NAME ]' to use an item");
        }
        this.awaitCommand();
    }

    cmdNone(args)
    {
        this.awaitCommand();
    }

    cmdTitle(args)
    {
        this.printLine();
        this.awaitCommand();
    }
    
    cmdTree(args)
    {
        this.printLine();
        this.awaitCommand();
    }
    
    cmdTerminalExe(args)
    {
        
        //Music >:D
        var audio = new Audio("resources/Terminal_Chillness.mp3");
        audio.loop = false;

        //If the user tries returning here while in a fight it'll just play the song
        if(this.#fighting){
            this.printLine("You got this!!");
            audio.play();
            this.awaitCommand();
            return;
        }
        //this.#running = true;
        this.printFile("resources/intro.txt");
        audio.play();
        this.enableInput();

        //Temporary reload for guest stats
        if(this.#user.hp <= 0){
            this.#user = new User("Guest",20,20*Math.random(),Math.random(),Math.random());
            return;
        }
        this.awaitCommand();
        //this.#awaitingCommand = false;
    }

    cmdUseItem(args)
    {
        if (args == "corrupted file" || args == "heal")
        {
            if (this.#user.removeItem("heal"))
            {
                let healamt = this.#user.heal();
                this.printLine("Corrupted File consumed successfully! " + healamt + " health points restored");
            }
            else
            {
                this.printLine("ERROR: no corrupted files in inventory!");
            }
        }

        else if (args == "file key" || args == "filekey" || args == "key")
        {
            this.printLine("ERROR: keys are used automatically when deleting locked files");
        }
        
        else
        {
            this.printLine("ERROR: no item '" + args + "' in inventory. Enter 'inv' to view inventory");
        }
        this.awaitCommand();
    }

    #cmdError()
    {
        this.printLine(this.errorString(this.#currentEntry));
        this.printLine();
        this.awaitCommand();
    }

    cmdStart(args)
    {
        this.printFile("resources/instructions.txt");
        this.#running = true;
        this.awaitCommand();
        document.documentElement.requestFullscreen();
    }


    ////////////////////////////////////////////////////////////////
    //  COMBAT COMMANDS
    ////////////////////////////////////////////////////////////////

    sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
      }


      //Check counter, input enemyname, check type, return true if combat started false if not/going
    #fight(enemyName, counter, enemyType, img){
        if(this.#fighting){
           
            //this.sleep(10000)
            let attack = this.#enemy.att(this.#user);
            let message = this.#enemy.uName + " swings at you!";
            this.printLine(message);
            setTimeout(this.printCharacters(this.#sprite + ".txt"),5000);

            if(attack){
                $.ajax({
                    url: "./updates/CurrentHealth.php",
                    type: "POST",
                    data: {
                           Current_health: this.currentHp,
                          },
                    success: function(response) {
                        console.log(response);
                    },
                    error: function(xhr, status, error) {
                      console.log("Error: " + error);
                    }
                  });
                message = "Hits you for " + this.#enemy.damage + " damage!";
                this.printLine(message);
                if(this.#user.currentHp <= 0){
                    this.printLine("You've been defeated! Gameover!")

                    this.#fighting = false;
                    this.#running = false;
                    this.#enCounter = 0;
                    this.#bossCounter = 0;
                    this.cmdTerminalExe();
                    return;
                }
            }
            else{
                message = "It misses!"
                this.printLine(message);
            }
        }
        else if(counter >= 10){
            
            this.#fighting = true;
            if(enemyType == "boss"){
                this.#baseWindow.setSize(new Vec2(900, 800));
                this.#baseWindow.setPos(new Vec2(600, 120));
                this.#enemy = new User(enemyName, Math.round(Math.random()*this.#user.hp*100)/100 + 4, 10, .5, .2);
                this.printFile("resources/boss.txt")
            }
            else{
                this.#baseWindow.setSize(new Vec2(800, 800));
                this.#baseWindow.setPos(new Vec2(600, 120));
                this.#enemy = new User(enemyName, Math.round(Math.random()*this.#user.hp*100)/100, 1 + Math.round(Math.random()*this.#user.str*100)/100, .25, .25);
            }
            this.printLine(enemyName + " attacks!!");
            this.printLine("TYPE ATT TO ATTACK AND INV TO ACCESS INVENTORY");
            this.#sprite = img;
        }
    
    }

    printCharacters(sprite) 
    {   
        this.printLine("");
        this.printLine("");
        let enemyStat = "                            ENEMY HP: " + this.#enemy.currentHp + "/" + this.#enemy.hp;
        this.printLine(enemyStat);
        this.printFile(sprite);
        this.printFile("images/ascii-images/bacteriophage.txt");
        let status = "USER HP: " + this.#user.currentHp + "/" + this.#user.hp;
        this.printLine(status);
        this.printLine("")

    }

    cmdAttack(args){
        if(this.#fighting){
            let attack = this.#user.att(this.#enemy);
            let message = "You attack!";
                this.printLine(message);
                
            if(this.#enemy.currentHp <= 0){
                this.#baseWindow.setSize(new Vec2(976, 512));
                this.#baseWindow.setPos(new Vec2(450, 320));
                this.#fighting = false;
                
                this.printCharacters(this.#sprite + "Dead.txt");
                message = "You inflict " + this.#user.damage + " damage!";
                this.printLine(message);
                this.printLine("You defeated " + this.#enemy.uName + "!");
                this.#user.exp(this.#enemy);
                this.printLine("EXP gained: " + this.#enemy.str);
                
                if(this.#bossCounter >= 10){
                    this.changePhase();
                    this.#bossCounter = 0;
                }
                else if(this.#enCounter >= 10){
                    this.#enCounter = 0;
                }
                else{
                    this.#safe = true;
                    this.cmdDelete(this.#enemy.uName);
                }
                this.$bossCounter += Math.random();
                this.awaitCommand();
                return;
            }

            if(attack){
                if(this.#user.crit){
                    this.printCharacters(this.#sprite + "Hot.txt");
                    this.printLine("It's a critical hit!!")
                }
                else{
                    this.printCharacters(this.#sprite + ".txt");
                }
                message = "You inflict " + this.#user.damage + " damage!";
                this.printLine(message);
            }
            else{
                message = "You miss!"
                this.printLine(message);
            }           
            
        }
        else if(!this.#running){
            this.printLine("Start the game first!");
        }
        else{
            this.printLine("You lunge into the darkness!")
            this.printLine("...but there was nobody to attack.")
        }
        this.awaitCommand();
    }

    changePhase(){
        if(this.#bossName == "Windows Defender"){
            this.printFile("phase1.txt");
            this.#bossName = "Norton Antivirus";
            this.#bossSprite = "images/ascii-images/enemies/norton";
            this.#fileSystem = this.#file2;
            this.#deletables = 2;
        }
        else if(this.#bossName == "Norton Antivirus"){
            this.printFile("phase2.txt");
            this.#bossName = "McAfee";
            this.#bossSprite = "images/ascii-images/enemies/mcAfee";
            this.#fileSystem = this.#file3;

        }
        else{
            this.printFile("phase3.txt");
            this.#running = false;
            this.printLine('TYPE "reset" TO PLAY AGAIN');

        }
    }
    
    cmdReset(){
        this.#running = false;
        this.#fileSystem = this.#file1;
        //Reset stats
        this.#user = new User("Guest",20,5,Math.random(),Math.random());            
        this.cmdTerminalExe();
    }

    ////////////////////////////////////////////////////////////////
    //  BEHAVIORS
    ////////////////////////////////////////////////////////////////
    // Command handling methods
    submitEntry()
    {
        this.disableInput();
        this.#eActiveEntry.textContent = this.#eActiveEntry.textContent.replace('\n', '');
        this.#currentEntry = this.#eActiveEntry.textContent;
        if(this.#currentEntry !== '')
        {
            this.#entryHistory.push(this.#currentEntry);
        }
        
        this.executeCommand(this.#currentEntry);
    }

    executeCommand(command)
    {
        if(this.#awaitingCommand)
        {
            const itemized = command.split(' ');
            if(itemized.length === 0)
            {
                this.awaitCommand();
            }
            else
            {
                const cmd = itemized.shift();
                const args = itemized.join(' ');
                
                Terminal.commands.has(cmd) ? this[Terminal.commands.get(cmd)](args) : this.#cmdError();
            }
        }
        else
        {
            this.printLine();
            this.enableInput();
        }
    }

    awaitCommand()
    {
        if(!this.#fighting){
            let filestuff = this.#fileSystem.getFileNames();
            if(filestuff[0] != undefined){
                this.#fight(filestuff[0], this.#enCounter, "grunt", "images/ascii-images/enemies/file");
            }}
        
        this.#fight(this.#bossName, this.#bossCounter, "boss", this.#bossSprite);
        if(this.#deletables == 0){
            this.#bossCounter = 10;
            this.#fight(this.#bossName, this.#bossCounter, "boss", this.#bossSprite);
        }
        
        
        this.#awaitingCommand = true;
        this.printLine(this.#fileSystem.getPathString() + '>');
        this.enableInput();
    }

    // User input configuring methods
    enableInput()
    {
        this.#entryPtr = this.#entryHistory.length;

        this.#eActiveEntry = document.createElement("span");
        this.#eActiveEntry.setAttribute("contentEditable", true);
        this.#eCurrentLine.setAttribute("class", "active-line");
        this.#eCurrentLine.appendChild(this.#eActiveEntry);
        this.#eActiveEntry.focus();
    }

    disableInput()
    {
        this.#eActiveEntry.removeAttribute("contentEditable");
        this.#eCurrentLine.removeAttribute("class");
    }

    

    // Printing methods
    printLine(text = " ")
    {
        this.#numLines++;
        this.#eCurrentLine = document.createElement("pre");
        this.#eCurrentLine.textContent = text;
        this.#eTextbox.appendChild(this.#eCurrentLine);
    }

    printLines(textLines)
    {
        for(const line of textLines)
        {
            this.printLine(line);
        }
    }

    printFile(directory, asBlock = true)
    {
        const text = ResourceManager.readFile(directory);
        if(text)
        {
            if(asBlock)
            {
                this.printLine(text);
            }
            else
            {
                this.printLines(text.split('\n'));
            }
            
            this.printLine();
        }                
    }
    
    errorString(input)
    {
        return `'${input}' is not recognized as an internal or external command,\noperable program or batch file.`;
    }



    ////////////////////////////////////////////////////////////////
    //  ACCESSORS
    ////////////////////////////////////////////////////////////////
    getBaseWindow() { return this.#baseWindow; }
    getRunning() { return this.#running; }


    ////////////////////////////////////////////////////////////////
    //  MUTATORS
    ////////////////////////////////////////////////////////////////
    
    
}


export default Terminal;
