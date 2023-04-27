import Vec2 from "./Vec2.mjs";
import ResourceManager from "./ResourceManager.mjs";
import BaseWindow from "./BaseWindow.mjs";

class Pong
{
    ////////////////////////////////////////////////////////////////
    //  MEMBER ATTRIBUTES
    ////////////////////////////////////////////////////////////////
    #baseWindow;

    #gameState;

    #paddle_1_coord;
    #paddle_2_coord;
    #initial_ball_coord;
    #ball_coord;

    #dx;
    #dy;
    #dxd;
    #dyd;

    //HTML elements
    #gameBoard
    #paddle_common;
    #eWindow;
    #initial_ball;
    #ball;
    #scoreText;
    #message;

    constructor(parent, id, title = "pong", icon = "terminal", position = new Vec2(450, 320), size = new Vec2(976, 512))
    {
        this.#baseWindow = new BaseWindow(parent, id, title, icon, position, size);

        this.#gameState = 'start';
        this.#dx = Math.floor(Math.random() * 4) + 3;
        this.#dy = Math.floor(Math.random() * 4) + 3;
        this.#dxd = Math.floor(Math.random() * 2);
        this.#dyd = Math.floor(Math.random() * 2);
        
        this.#initialize();
    }

    ////////////////////////////////////////////////////////////////
    //  HELPER FUNCTIONS
    ////////////////////////////////////////////////////////////////
    // Sets up terminal context and variables
    #initialize()
    {
        this.#setupHTML();
        //this.#setupCoords();
        //this.#setupEventListeners();
    }

    // Generates the HTML for a terminal
    #setupHTML()
    {
        this.#ball = document.createElement("div");
        this.#ball.setAttribute("id", "ball");
        this.#paddle_1 = document.createElement("div");
        this.#paddle_1.setAttribute("id", "paddle paddle_1");
        this.#paddle_2 = document.createElement("div");
        this.#paddle_2.setAttribute("id", "paddle paddle_2");
        this.#scoreText = document.createElement("div");
        this.#scoreText.setAttribute("id", "scoreText");
        this.#message.setAttribute("id", "message");
        this.#gameBoard = document.createElement("canvas");
        this.#gameBoard.setAttribute("id", "gameBoard");
        this.#gameBoard.appendChild(this.#ball);
        this.#gameBoard.appendChild(this.#paddle_1);
        this.#gameBoard.appendChild(this.#paddle_2);
        this.#gameBoard.appendChild(this.#message);
        this.#eWindow = this.#baseWindow.getWindowElements().eContent;
        this.#eWindow.appendChild(this.#gameBoard);

    }
    #setupCoords()
    {
        this.#paddle_common = document.getElementById('paddle').getBoundingClientRect();
        this.#paddle_1_coord = this.paddle_1.getBoundingClientRect();
        this.#paddle_2_coord = this.paddle_2.getBoundingClientRect();
        this.#initial_ball_coord = this.#ball.getBoundingClientRect();
        this.#initial_ball = document.getElementById('ball');
        this.#ball_coord = this.#initial_ball_coord;
        this.#ball_coord = this.#board.getBoundingClientRect();
    }

    // Initializes cmd window event listeners
    #setupEventListeners()
    {
        document.addEventListener('keydown', (e) => {
            if (e.key == 'Enter') {
              gameState = gameState == 'start' ? 'play' : 'start';
              if (gameState == 'play') {
                message.innerHTML = 'Game Started';
                message.style.left = 42 + 'vw';
                requestAnimationFrame(() => {
                  dx = Math.floor(Math.random() * 4) + 3;
                  dy = Math.floor(Math.random() * 4) + 3;
                  dxd = Math.floor(Math.random() * 2);
                  dyd = Math.floor(Math.random() * 2);
                  moveBall(dx, dy, dxd, dyd);
                });
              }
            }
            if (gameState == 'play') {
                if (e.key == 'w') {
                  paddle_1.style.top =
                    Math.max(
                      board_coord.top,
                      paddle_1_coord.top - window.innerHeight * 0.06
                    ) + 'px';
                  paddle_1_coord = paddle_1.getBoundingClientRect();
                }
                if (e.key == 's') {
                  paddle_1.style.top =
                    Math.min(
                      board_coord.bottom - paddle_common.height,
                      paddle_1_coord.top + window.innerHeight * 0.06
                    ) + 'px';
                  paddle_1_coord = paddle_1.getBoundingClientRect();
                }
            
                if (e.key == 'ArrowUp') {
                  paddle_2.style.top =
                    Math.max(
                      board_coord.top,
                      paddle_2_coord.top - window.innerHeight * 0.1
                    ) + 'px';
                  paddle_2_coord = paddle_2.getBoundingClientRect();
                }
                if (e.key == 'ArrowDown') {
                  paddle_2.style.top =
                    Math.min(
                      board_coord.bottom - paddle_common.height,
                      paddle_2_coord.top + window.innerHeight * 0.1
                    ) + 'px';
                  paddle_2_coord = paddle_2.getBoundingClientRect();
                }
              }
            });
    }


    ////////////////////////////////////////////////////////////////
    //  ACCESSORS
    ////////////////////////////////////////////////////////////////
    getBaseWindow() { return this.#baseWindow; }

}

export default Pong;