import Vec2 from "./Vec2.mjs";
import BaseWindow from "./BaseWindow.mjs";

class Pong
{
    ////////////////////////////////////////////////////////////////
  //  MEMBER ATTRIBUTES
  ////////////////////////////////////////////////////////////////
    #baseWindow;
    #eTaskbar;

    // holds the canvas element of the game
    static canvas = document.createElement("canvas");

    // holds the methods and properties to draw on the canvas
    static context;

    //html holding eContents from baseWindow
    #ePong;

    //sounds
    static hit = new Audio();
    static wall = new Audio();
    static userScore = new Audio();
    static comScore = new Audio();


    //========================= game functions =========================//

    static gameState;
    static GameStates = {
        ComputerWin : "ComputerWin",
        UserWin : "UserWin",
        Running : "Running",
        Start : "Start"
    }  
    #loop;
    #framePerSecond = 50;

    //=============================objects=============================//

    static ball = {
        x : 300,
        y : 200,
        radius : 10,
        velocityX : 5,
        velocityY : 5,
        speed : 8,
        color : "WHITE"
    }

    //user paddle
    static user = {
        x : 0,
        y : 150,
        width : 10,
        height : 100,
        score : 0,
        color : "WHITE"
    }

    //computer paddle
    static com = {
        x : 590,
        y : 150,
        width : 10,
        height : 100,
        score : 0,
        color : "WHITE"
    }

    static net = {
        x : 299,
        y : 0,
        height : 10,
        width : 2,
        color : "WHITE"
    }


    constructor(parent, id, title = "pong", icon = "pong", position = new Vec2(50, 0), size = new Vec2(600, 400)){

        this.#baseWindow = new BaseWindow(parent, id, title, icon, position, size);
        Pong.gameState = Pong.GameStates.Start;
        this.#initialize();
        
    }


    ////////////////////////////////////////////////////////////////
    //  HELPER FUNCTIONS
    ////////////////////////////////////////////////////////////////

    // Sets up html, audio, event listeners, and refresh loop
    #initialize(){

        this.#setupHTML();
        //this.#setupAudio();
        Pong.render();
        this.#setupEventListeners();
        
        this.#loop = setInterval(this.#game, 1000/this.#framePerSecond);
    }

    // sets up the canvas element holding the game
    #setupHTML(){

        Pong.canvas.setAttribute("id", "pong");
        Pong.canvas.setAttribute("width", "600");
        Pong.canvas.setAttribute("height", "400");
        Pong.context = Pong.canvas.getContext("2d");
        this.#ePong = this.#baseWindow.getWindowElements().eContent;
        this.#ePong.appendChild(Pong.canvas); 
    }
    
    // links audio
    #setupAudio(){

        Pong.hit.src = "./resources/sounds/hit.mp3";
        Pong.wall.src = "./resources/sounds/wall.mp3";
        Pong.comScore.src = "./resources/sounds/comScore.mp3";
        Pong.userScore.src = "./resources/sounds/userScore.mp3";
    }

    #setupEventListeners(){

        Pong.canvas.addEventListener("mousemove", this.#getMousePos);
        Pong.canvas.addEventListener("click", () => {
            Pong.gameState = Pong.GameStates.Running;
        });
    }

    // for user paddle control
    #getMousePos(evt){

        let rect = Pong.canvas.getBoundingClientRect();
        Pong.user.y = evt.clientY - rect.top - Pong.user.height/2;
    }
    
    // for paddles and net
    static drawRect(x, y, w, h, color){

        Pong.context.fillStyle = color;
        Pong.context.fillRect(x, y, w, h);
    }

    // for ball
    static drawCircle(x, y, r, color){

        Pong.context.fillStyle = color;
        Pong.context.beginPath();
        Pong.context.arc(x, y, r, 0, Math.PI*2, false);
        Pong.context.closePath();
        Pong.context.fill();
    }

    // after user / com scores, reset the ball
    static resetBall(){

        Pong.ball.x = Pong.canvas.width/2;
        Pong.ball.y = Pong.canvas.height/2;
        Pong.ball.velocityX = -Pong.ball.velocityX;
        Pong.ball.speed = 8;
    }

    static drawNet(){

        for(let i = 0; i <= Pong.canvas.height; i+=15)
        {
          Pong.drawRect(Pong.net.x, Pong.net.y + i, Pong.net.width, Pong.net.height, Pong.net.color);
        }
    }

    static drawText(text, x, y){

        Pong.context.fillStyle = "#FFF";
        Pong.context.font = "75px fantasy";
        Pong.context.fillText(text, x, y);
    }

    // handles collision between ball and paddle
    static collision(b, p){

        p.top = p.y;
        p.bottom = p.y + p.height;
        p.left = p.x;
        p.right = p.x + p.width;

        b.top = b.y - b.radius;
        b.bottom = b.y + b.radius;
        b.left = b.x - b.radius;
        b.right = b.x + b.radius;

        return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
    }

    // updates ball position, and velocity
    // updates the user and computer scores
    // handles collisions between ball and borders/paddles
    // updates gameState if user / computer score = 2
    static update(){

        // change the score of players, if the ball goes too far left, computer wins, else user wins
        // updates gameState if user / computer score = 2
        if( Pong.ball.x - Pong.ball.radius <= 0 ){

            Pong.com.score++;
            if( Pong.com.score == 2 ){
                Pong.gameState = Pong.GameStates.ComputerWin;
                Pong.com.score = 0;
                Pong.user.score = 0;
            }
            //Pong.comScore.play();
            Pong.resetBall();
        }else if( Pong.ball.x + Pong.ball.radius > Pong.canvas.width ){

            Pong.user.score++;
            if( Pong.user.score == 2 ){
                Pong.gameState = Pong.GameStates.UserWin;
                Pong.com.score = 0;
                Pong.user.score = 0;
            }
            //Pong.userScore.play();
            Pong.resetBall();
        }

        // the ball has a velocity
        Pong.ball.x += Pong.ball.velocityX;
        Pong.ball.y += Pong.ball.velocityY;

        // simple AI for computer paddle
        Pong.com.y += ((Pong.ball.y - (Pong.com.y + Pong.com.height/2)))*0.1;

        // when the ball collides with bottom and top walls we inverse the y velocity
        if( Pong.ball.y - Pong.ball.radius < 0 || Pong.ball.y + Pong.ball.radius > Pong.canvas.height ){

            Pong.ball.velocityY = -Pong.ball.velocityY;
            //Pong.wall.play();
        }

        // check if the paddle hit the user or the com paddle
        let player = (Pong.ball.x + Pong.ball.radius < Pong.canvas.width/2) ? Pong.user : Pong.com;

        // if the ball hits a paddle
        if( Pong.collision(Pong.ball, player) ){

            //play sound
            //Pong.hit.play();

            // we check where the ball hits the paddle
            let collidePoint = (Pong.ball.y - (player.y + player.height/2));

            // normalize the value of collidePoint, we need to get numbers between -1 and 1
            collidePoint = collidePoint / (player.height/2);

            // when the ball hits the top of a paddle, take a -45 degree angle
            // when the ball hits the center of the paddle, take a 0 degree angle
            // when the ball hits the bottom of the paddle, take a 45 degree angle
            let angleRad = (Math.PI/4) *  collidePoint;

            // change the X and Y velocity direction
            let direction = (Pong.ball.x + Pong.ball.radius < Pong.canvas.width/2) ? 1 : -1;
            Pong.ball.velocityX = direction * Pong.ball.speed * Math.cos(angleRad);
            Pong.ball.velocityY = Pong.ball.speed * Math.sin(angleRad);

            // speed up the ball every time a paddle hits it
            Pong.ball.speed += 0.25;
        }
    }

    // draws background based on the gameState
    static render(){

        switch( Pong.gameState ){

            case Pong.GameStates.Start:

                // clear the canvas
                Pong.drawRect(0, 0, 600, 400, "black");

                // draw start text
                Pong.drawText("Click to start",90, 150);
                Pong.drawText("First to 2 wins",70, 240);
                break;


            case Pong.GameStates.Running:
              
                // clear the canvas
                Pong.drawRect(0, 0, 600, 400, "black");

                // draw the user score to the left
                Pong.drawText(Pong.user.score,Pong.canvas.width/4,Pong.canvas.height/5);

                // draw the COM score to the right
                Pong.drawText(Pong.com.score,3*Pong.canvas.width/4,Pong.canvas.height/5);
                
                // draw the net
                Pong.drawNet();

                // draw the user paddle
                Pong.drawRect(Pong.user.x,Pong.user.y,Pong.user.width,Pong.user.height,Pong.user.color);

                // draw the com paddle
                Pong.drawRect(Pong.com.x,Pong.com.y,Pong.com.width,Pong.com.height,Pong.com.color);

                // draw the ball
                Pong.drawCircle(Pong.ball.x,Pong.ball.y,Pong.ball.radius,Pong.ball.color);
                break;


            case Pong.GameStates.ComputerWin:

                // clear the canvas
                Pong.drawRect(0, 0, 600, 400, "black");

                // draw losing text
                Pong.drawText("u suck bro.", 90, 180);
                Pong.drawText("try again?", 100, 300)
                break;
            

            case Pong.GameStates.UserWin:

                // clear the canvas
                Pong.drawRect(0, 0, 600, 400, "black");

                // draw winning text
                Pong.drawText("u win! u gain _", 70, 180);
                break;
          
        }
      
    }

    #game(){
        if(Pong.gameState == Pong.GameStates.Running) {

            Pong.update();
            Pong.render();
        }

    }

    ////////////////////////////////////////////////////////////////
    //  ACCESSORS
    ////////////////////////////////////////////////////////////////
    getBaseWindow() { return this.#baseWindow; }
}

export default Pong;