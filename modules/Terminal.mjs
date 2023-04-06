
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

    constructor(parent, id, filesys = new FileSystem(), directory = `C:\\>`, title = "C:\\Windows\\System32\\cmd.exe", icon = "terminal", position = new Vec2(450, 320), size = new Vec2(976, 512))
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

        // Bottom spacer block
        this.#eBlock = document.createElement("div");
        this.#eBlock.setAttribute("class", "spacer");
        
        // The window content section
        this.#eTerminal = this.#baseWindow.getWindowElements().eContent;
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
        this.printLine();
        this.#fileSystem.getFileTree().moveTo(args);
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
        this.printLine();
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
        this.printLine();
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
        this.printLine(this.#directory);
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
