
import Vec2 from "./Vec2.mjs";
import ResourceManager from "./ResourceManager.mjs";
import BaseWindow from "./BaseWindow.mjs";
import {FileSystem, FileData} from "./FileSystem.mjs";



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
    #directoryStack;

    // HTML Elements
    #eWindow;
    #eTerminal;
    #eCurrentLine;
    #eActiveEntry;
    #eBlock;
    #eTextbox;

    // Data
    #fileSystem;



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
        ["ls", "cmdDirectory"]
    ]);

    constructor(parent, id, filesys = new FileSystem(), directory = `C:\\`, title = "C:\\Windows\\System32\\cmd.exe", icon = "terminal", position = new Vec2(450, 320), size = new Vec2(976, 512))
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
        this.#directoryStack = []
        this.#directoryStack.push(directory);

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
    }

    // Initializes cmd window event listeners
    #setupEventListeners()
    {
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
        this.#eTerminal.scrollTop = 0;
        this.awaitCommand();
    }



    ////////////////////////////////////////////////////////////////
    //  USER COMMANDS
    ////////////////////////////////////////////////////////////////

    cmdChangeDir(args)
    {
        if (this.#fileSystem.getFileTree())
        this.printLine();
        this.#fileSystem.getFileTree().moveTo(args);
        this.#directoryStack.push(args);
        this.#directory = args;
        this.awaitCommand();
    }
    
    cmdClearScreen(args)
    {
        this.#numLines = 0;
        this.#entryHistory = [];
        this.#eTextbox.innerHTML = "";
        this.#eTerminal.scrollTop = 0;
        this.printLine();
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
        this.printLine();
        this.#fileSystem.fileTree.removeChild(args, this.#directory);
        this.awaitCommand();
    }

    cmdDirectory(args)
    {
        this.printLine();
        for (let [key, value] of this.#fileSystem.getFileTree().getNode().children)
        {
            this.printLine(value.name);
        }
        this.printLine();
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
        this.#running = true;
        this.printFile("resources/intro.txt");
        this.enableInput();
        this.#awaitingCommand = false;
    }

    #cmdError()
    {
        this.printLine(this.errorString(this.#currentEntry));
        this.printLine();
        this.awaitCommand();
    }



    ////////////////////////////////////////////////////////////////
    //  COMBAT COMMANDS
    ////////////////////////////////////////////////////////////////
    printCharacters(enemy) 
    {
        this.printFile(enemy);
        this.printFile("images/ascii-images/bacteriophage.txt");
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
            const itemized = command.split(' ', 2);
            if(itemized.length === 0)
            {
                this.awaitCommand();
            }
            else
            {
                const cmd = itemized[0];
                const args = itemized.slice(1);

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
        this.#awaitingCommand = true;
        let directoryPath = this.#directoryStack.join('\\');
        directoryPath += '>';
        this.printLine(directoryPath);
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
    printLine(text = "")
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



    ////////////////////////////////////////////////////////////////
    //  MUTATORS
    ////////////////////////////////////////////////////////////////
    
    
}


export default Terminal;
