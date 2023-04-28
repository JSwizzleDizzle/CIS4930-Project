import Vec2 from "./Vec2.mjs";
import BaseWindow from "./BaseWindow.mjs";

class FlappyBird
{

    // holds the canvas element of the game
    #baseWindow;
    #eFlappyBird;
    static canvas = document.createElement("canvas");

    // holds the methods and properties to draw on the canvas
    static context;

    //========================= game functions =========================//
    static gameState;
    static GameStates = {
        Start : "Start",
        Running : "Running",
        Win : "Win",
        Loss : "Loss"
    }
    #loop;
    #framePerSecond = 50;

    //========================= Objects =========================//

    static user = {
        x : 200,
        y : 300,
        vy : -20,
        ay : -1.5,
        score : 0,
        color : "YELLOW"
    }
    static pipe1 = {
        x : 600,
        speed : 5,
        holeSize : 200,
        holePos : -1
    }
    static pipe2 = {
        x : 900,
        speed : 5,
        holeSize : 200,
        holePos : -1
    }
    static pipe3 = {
        x : 1200,
        speed : 5,
        holeSize : 200,
        holePos : -1
    }

    constructor(parent, id, title = "FlappyBird", icon = "Pong", position = new Vec2(110, 320), size = new Vec2(500, 600)){

        this.#baseWindow = new BaseWindow(parent, id, title, icon, position, size);
        FlappyBird.gameState = FlappyBird.GameStates.Start;
        this.#initialize();
        
    }

    #initialize(){

        this.#setupHTML();
        this.#setupAudio();
        FlappyBird.render();
        this.#setupEventListeners();

        this.#loop = setInterval(this.#game, 1000/this.#framePerSecond);
    }

    // sets up canvas element holding the game
    #setupHTML(){

        FlappyBird.canvas.setAttribute("id", "FlappyBird");
        FlappyBird.canvas.setAttribute("width", "500");
        FlappyBird.canvas.setAttribute("height", "600");
        FlappyBird.context = FlappyBird.canvas.getContext("2d");
        this.#eFlappyBird = this.#baseWindow.getWindowElements().eContent;
        this.#eFlappyBird.appendChild(FlappyBird.canvas);
    }

    #setupAudio(){

    }

    #setupEventListeners(){
        
        FlappyBird.canvas.addEventListener("click", () => {
            switch( FlappyBird.gameState ){
                
                case FlappyBird.GameStates.Start:
                    FlappyBird.gameState = FlappyBird.GameStates.Running;
                    FlappyBird.user.vy = -15;
                    break;
                case FlappyBird.GameStates.Running:
                    FlappyBird.user.vy = -15;
                    break;
                case FlappyBird.GameStates.Win:
                    FlappyBird.gameState = FlappyBird.GameStates.Start;
                    FlappyBird.setDefault();
                    break;
                case FlappyBird.GameStates.Loss:
                    FlappyBird.gameState = FlappyBird.GameStates.Start;
                    FlappyBird.setDefault();
                    break;
            }


        });
    }

    static resetBird(){
        
        FlappyBird.user.x = FlappyBird.canvas.width/5;
        FlappyBird.user.y = FlappyBird.canvas.height/2;
        
    }

    static drawBackground(){

        // clear the canvas
        FlappyBird.drawRect(0, 0, 500, 600, "blue");

        // citation : https://stackoverflow.com/questions/19541192/how-to-draw-cloud-shape-in-html5-canvas
        drawCloud = (x, y) => {
            FlappyBird.canvas.beginPath();
            FlappyBird.canvas.arc(x, y, 60, Math.PI * 0.5, Math.PI * 1.5);
            FlappyBird.canvas.arc(x + 70, y - 60, 70, Math.PI * 1, Math.PI * 1.85);
            FlappyBird.canvas.arc(x + 152, y - 45, 50, Math.PI * 1.37, Math.PI * 1.91);
            FlappyBird.canvas.arc(x + 200, y, 60, Math.PI * 1.5, Math.PI * 0.5);
            FlappyBird.canvas.moveTo(x + 200, y + 60);
            FlappyBird.canvas.lineTo(x, y + 60);
            FlappyBird.canvas.strokeStyle = '#797874';
            FlappyBird.canvas.stroke();
            FlappyBird.canvas.fillStyle = '#8ED6FF';
            FlappyBird.canvas.fill()
        }

        // for ()
    }
    // for pipes
    static drawRect(x, y, w, h, color){

        FlappyBird.context.fillStyle = color;
        FlappyBird.context.fillRect(x, y, w, h);
    }

    // for background
    static drawCircle(x, y, r, color){

        FlappyBird.context.fillStyle = color;
        FlappyBird.context.beginPath();
        FlappyBird.context.arc(x, y, r, 0, Math.PI*2, false);
        FlappyBird.context.closePath();
        FlappyBird.context.fill();
    }

    static drawText(text, x, y){

        FlappyBird.context.fillStyle = "#FFF";
        FlappyBird.context.font = "30px fantasy";
        FlappyBird.context.fillText(text, x, y);
    }
    
    // bird movement mechanics
    static Fly(){

        // update velocity with acceleration
        FlappyBird.user.vy -= FlappyBird.user.ay;
        // update position with velocity
        FlappyBird.user.y += FlappyBird.user.vy;
    }

    static update(){

        //if game hasn't started, continuously bob the bird
        if( FlappyBird.gameState == FlappyBird.GameStates.Start ){

            FlappyBird.Fly();
            if( FlappyBird.user.y >= 280) {
                FlappyBird.user.vy = -15;
            }
            return;
        }

        //======================GameState : Running============================//

        // update gameState if user goes out of bounds
        if( FlappyBird.user.y > FlappyBird.canvas.height || FlappyBird.user.y < 0 ){

            FlappyBird.gameState = FlappyBird.GameStates.Loss;
            return;
        }

        // update gameState if user hits a pipe
        if(((FlappyBird.user.x >= FlappyBird.pipe1.x-10 && FlappyBird.user.x <= FlappyBird.pipe1.x+90 ) && ( FlappyBird.user.y < FlappyBird.pipe1.holePos || FlappyBird.user.y+20 > FlappyBird.pipe1.holePos+FlappyBird.pipe1.holeSize)) ||
        ((FlappyBird.user.x >= FlappyBird.pipe2.x-10 && FlappyBird.user.x <= FlappyBird.pipe2.x+90 ) && ( FlappyBird.user.y < FlappyBird.pipe2.holePos || FlappyBird.user.y+20 > FlappyBird.pipe2.holePos+FlappyBird.pipe2.holeSize)) ||
        ((FlappyBird.user.x >= FlappyBird.pipe3.x-10 && FlappyBird.user.x <= FlappyBird.pipe3.x+90 ) && ( FlappyBird.user.y < FlappyBird.pipe3.holePos || FlappyBird.user.y+20 > FlappyBird.pipe3.holePos+FlappyBird.pipe3.holeSize))) {

            FlappyBird.gameState = FlappyBird.GameStates.Loss;
            return;
        }
        
        // update the score
        if( FlappyBird.user.x == FlappyBird.pipe1.x || FlappyBird.user.x == FlappyBird.pipe2.x || FlappyBird.user.x == FlappyBird.pipe3.x ) FlappyBird.user.score++;

        // check if score == 30
        if( FlappyBird.user.score == 30 ) FlappyBird.gameState = FlappyBird.GameStates.Win;

        // move bird position
        FlappyBird.Fly();

        // set the pipe hole position if it has not been set previously or needs to be regenerated
        if( FlappyBird.pipe1.holePos == -1 ) FlappyBird.pipe1.holePos = Math.floor(Math.random() * (500-FlappyBird.pipe1.holeSize)) + 50;
        if( FlappyBird.pipe2.holePos == -1 ) FlappyBird.pipe2.holePos = Math.floor(Math.random() * (500-FlappyBird.pipe2.holeSize)) + 50;
        if( FlappyBird.pipe3.holePos == -1 ) FlappyBird.pipe3.holePos = Math.floor(Math.random() * (500-FlappyBird.pipe3.holeSize)) + 50;
        
        // decrement hole size as game progresses
        // set hole position to null
        switch( -85 ){

            case FlappyBird.pipe1.x:

                FlappyBird.pipe1.holePos = -1;
                FlappyBird.pipe1.holeSize -= 7;
                break;

            case FlappyBird.pipe2.x:

                FlappyBird.pipe2.holePos = -1;
                FlappyBird.pipe2.holeSize -= 7;   
                break;
            
            case FlappyBird.pipe3.x:

                FlappyBird.pipe3.holePos = -1;
                FlappyBird.pipe3.holeSize -= 7;
                break;
        }
            
        // move pipes 
        FlappyBird.pipe1.x = FlappyBird.pipe1.x > -90 ? FlappyBird.pipe1.x - FlappyBird.pipe1.speed : 800;
        FlappyBird.pipe2.x = FlappyBird.pipe2.x > -90 ? FlappyBird.pipe2.x - FlappyBird.pipe2.speed : 800;
        FlappyBird.pipe3.x = FlappyBird.pipe3.x > -90 ? FlappyBird.pipe3.x - FlappyBird.pipe3.speed : 800;

    }
        
    

    // draws background based on the gameState
    static render(){

        switch( FlappyBird.gameState ){

            case FlappyBird.GameStates.Start:

                 // clear the canvas
                FlappyBird.drawRect(0, 0, 500, 600, "black");

                // start text
                FlappyBird.drawText("Flappy Bird", 170, 100);
                FlappyBird.drawText("Get 30 points for a prize", 80, 150);
                FlappyBird.drawText("Click to start", 160, 400);

                // draw the bird
                FlappyBird.drawRect(FlappyBird.user.x,FlappyBird.user.y, 20, 20, FlappyBird.user.color);
                break;

            case FlappyBird.GameStates.Running:

                // clear the canvas
                FlappyBird.drawRect(0, 0, 500, 600, "black");

                // draw the pipes without holes
                FlappyBird.drawRect(FlappyBird.pipe1.x,0,80,FlappyBird.canvas.height, "green");
                FlappyBird.drawRect(FlappyBird.pipe2.x,0,80,FlappyBird.canvas.height, "green");
                FlappyBird.drawRect(FlappyBird.pipe3.x,0,80,FlappyBird.canvas.height, "green");

                // draw the pipes holes
                FlappyBird.drawRect(FlappyBird.pipe1.x,FlappyBird.pipe1.holePos,80,FlappyBird.pipe1.holeSize, "black");
                FlappyBird.drawRect(FlappyBird.pipe2.x,FlappyBird.pipe2.holePos,80,FlappyBird.pipe2.holeSize, "black");
                FlappyBird.drawRect(FlappyBird.pipe3.x,FlappyBird.pipe3.holePos,80,FlappyBird.pipe3.holeSize, "black");

                // draw pipe decoration
                FlappyBird.drawRect(FlappyBird.pipe1.x-10,FlappyBird.pipe1.holePos-40,100,40,"green");
                FlappyBird.drawRect(FlappyBird.pipe1.x-10,FlappyBird.pipe1.holePos+FlappyBird.pipe1.holeSize,100,40,"green");
                FlappyBird.drawRect(FlappyBird.pipe2.x-10,FlappyBird.pipe2.holePos-40,100,40,"green");
                FlappyBird.drawRect(FlappyBird.pipe2.x-10,FlappyBird.pipe2.holePos+FlappyBird.pipe2.holeSize,100,40,"green");
                FlappyBird.drawRect(FlappyBird.pipe3.x-10,FlappyBird.pipe3.holePos-40,100,40,"green");
                FlappyBird.drawRect(FlappyBird.pipe3.x-10,FlappyBird.pipe3.holePos+FlappyBird.pipe3.holeSize,100,40,"green");

                // draw the score
                FlappyBird.drawText(FlappyBird.user.score,50, 50)
                // draw the bird
                FlappyBird.drawRect(FlappyBird.user.x,FlappyBird.user.y, 20, 20, FlappyBird.user.color);
                break;
            
            case FlappyBird.GameStates.Win:

                // draw the bird green
                FlappyBird.drawRect(FlappyBird.user.x,FlappyBird.user.y, 20, 20, "green");

                // display Win text
                FlappyBird.drawText("You win! U get x powerup", 110, 150);

                break;
            case FlappyBird.GameStates.Loss:

                // draw bird red 
                FlappyBird.drawRect(FlappyBird.user.x,FlappyBird.user.y, 20, 20, "red");

                // draw loss text
                FlappyBird.drawText("You Lost! try again?", 120, 150);

                break;
        }
    }

    #game(){

        FlappyBird.update();
        FlappyBird.render();
    }

    static setDefault(){
        FlappyBird.user.x = 200;
        FlappyBird.user.y = 300;
        FlappyBird.user.vy = -20;
        FlappyBird.user.ay = -1.5;
        FlappyBird.user.score = 0;
        FlappyBird.user.color = "YELLOW";

        FlappyBird.pipe1.x = 600;
        FlappyBird.pipe1.speed = 5;
        FlappyBird.pipe1.holeSize = 200;
        FlappyBird.pipe1.holePos = -1;

        FlappyBird.pipe2.x = 900;
        FlappyBird.pipe2.speed = 5;
        FlappyBird.pipe2.holeSize = 200;
        FlappyBird.pipe2.holePos = -1;

        FlappyBird.pipe3.x = 1200;
        FlappyBird.pipe3.speed = 5;
        FlappyBird.pipe3.holeSize = 200;
        FlappyBird.pipe3.holePos = -1;
    }

    ////////////////////////////////////////////////////////////////
    //  ACCESSORS
    ////////////////////////////////////////////////////////////////
    getBaseWindow() { return this.#baseWindow; }
}


export default FlappyBird;