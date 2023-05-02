import Vec2 from "./Vec2.mjs";
import BaseWindow from "./BaseWindow.mjs";

class Login
{
    ////////////////////////////////////////////////////////////////
    //  MEMBER ATTRIBUTES
    ////////////////////////////////////////////////////////////////
    #baseWindow;

    #eLogin;
    #eTaskbar;

    constructor(parent, id, title = "login", icon="terminal",position = new Vec2(450, 320), size = new Vec2(400, 400))
    {
        this.#baseWindow = new BaseWindow(parent, id, title, icon, position, size);
        this.#initialize();
    }
    #initialize(){

        this.#setupHTML();
        document.getElementById("terminal-button").addEventListener("click", () => {
            this.getBaseWindow().toggleMinimize();
        });
        
    }
    
    #setupHTML(){
        this.#eLogin = this.#baseWindow.getWindowElements().eContent;
        this.#eLogin.innerHTML = "<form method='post'><h1>Login Form</h1><p>enter guest,guest,profile1 to play as guest</p><label for='username'>Username:</label><input type='text' id='username'name='username'><br><br><label for='password'>Password:</label><input type='password' id='password' name='password'><br><br><label>Select Profile:</label><br><input type='radio' id='profile1' name='profile' value='1'><label for='profile1'>Profile 1</label><br><input type='radio' id='profile2' name='profile' value='2'><label for='profile2'>Profile 2</label><br><input type='radio' id='profile3' name='profile' value='3'><label for='profile3'>Profile 3</label><br><br><input type='submit' value='Submit'></form>";
        this.#eTaskbar = document.getElementById("taskbar");
        this.#eTaskbar.innerHTML = `<img class="taskbar-terminal-image" src="images/taskbar/taskbar-terminal.png" alt="terminal taskbar"><img class="taskbar-terminal-overlay" id="terminal-button"src="images/taskbar/taskbar-terminal.png" alt="terminal taskbar">`;
        
    }

    ////////////////////////////////////////////////////////////////
    //  ACCESSORS
    ////////////////////////////////////////////////////////////////
    getBaseWindow() { return this.#baseWindow; }
}



export default Login;
