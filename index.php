<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="images/cmd-icon.png" type="image/x-icon">

    <!-- GOOGLE FONTS -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@300&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="style.css">
    <link rel="shortcut icon" href="images/icons/titlebar/terminal-icon.png" type="image/x-icon">

    <!-- jQuery stuff -->
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"
    integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8="
    crossorigin="anonymous"></script>
    
    <title>&gt; TERMINAL</title>

    
</head>
<body id="body">
    <?php
        // once the input is validated, then hide the login stuff
        $showLoginCode = true;
        $displayGame = false;
        // Check if the form was submitted
        if ($_SERVER['REQUEST_METHOD'] == 'POST'){
            
            // Get the form data
            $username = $_POST['username'];
            $password = $_POST['password'];
            $profile = $_POST['profile'];



            //Database connection
            $conn = new mysqli("mysql.cise.ufl.edu", "elewinkoh", "mysqlpassw0rd", "DBNAME");
            if( $conn->connect_error ){ die("Connection failed: " . $conn->connect_error);}


            ////////////////////////////////////////////////////////////////
            ////////////////// load Users from database ////////////////////
            ////////////////////////////////////////////////////////////////
            $users = "SELECT * FROM Users";
            $result = $conn->query($sql);

            // check Username table for the inputted username
            $foundUser = false;
            $invalidPassword = false;
            while( $row = $result->fetch_assoc() ){

                $username = $row['Username'];
                $password = $row['Password'];
                if( $username == $inputtedUsername && $password != $inputtedPassword ){ $invalidPassword = true; break; }
                if( $username == $inputtedUsername ){ $foundUser = true; break;}
            }

            if( $invalidPassword ){
                echo "alert('password is invalid')";
            }else{

                // inputted username is new Or username and password is correct
                $showLoginCode = false;
                $displayGame = true;

                // if user nat found, then update the database for this user
                if( $foundUser == false ){

                    $stmt = $conn->prepare("INSERT INTO Users (Username, Password, Date) VALUES (?, ?, ?)");
                    $stmt->bind_param('sss', $sanitized_username, $sanitized_password, $sanitized_date);
                    $sanitized_username = $conn->real_escape_string($username);
                    $sanitized_password = $conn->real_escape_string($password);
                    $sanitized_date = htmlspecialchars($_POST['date']);

                    $stmt->execute();
                    $stmt->close();
                }

                ////////////////////////////////////////////////////////////////
                ///////////////// load the profile columns /////////////////////
                ////////////////////////////////////////////////////////////////
                $profiles = "SELECT $profile FROM Profiles WHERE Username = $username";
                $result = $conn->query($profiles);
                $row = $result->fetch_assoc();

                //Primary Key for Profile
                $profileName = $row['Name'];

                // User Stats
                $level = $row['Level'];
                $currentHealth = $row['Current health'];
                $maxHealth = $row['Max health'];
                $attack = $row['Attack'];
                $defense = $row['Defense'];
                $evasion = $row['Evasion'];
                $experience = $row['Experience'];

                // Location
                $directory = $row['Directory'];
                $map = $row['Map'];
   
                ////////////////////////////////////////////////////////////////
                /////////////////////// load Inventory /////////////////////////
                ////////////////////////////////////////////////////////////////
                $itemsMap = array();
                $itemsCollected = "SELECT * FROM Items_collected WHERE Profile_name = '$profileName'";
                $result = $conn->query($itemsCollected);
                while ($row = $result->fetch_assoc()) {
                    $itemName = $row['Item_name'];
                    $numberHeld = $row['Number_held'];
                    $itemsMap[$itemName] = $numberHeld;
                }

                  
            }   
        }
    ?>
    <script>
        function refreshTime() 
        {
            const timeDisplay = document.getElementById("time");
            const dateDisplay = document.getElementById("date");
            const dateString = new Date().toLocaleString();
            const formattedString = dateString.split(",");
            timeDisplay.textContent = formattedString[1];
            dateDisplay.textContent = formattedString[0];
        }
        setInterval(refreshTime, 1000);
        var date = new Date().getDate();
        var time = new Date().getDate();
    
    </script>

    <main>
        <article id="desktop">  
            
            <div id="datetime">
                <div id="taskbar"></div>
                <div id="time"></div>
                <div id="date"></div>
            </div>
        </article>

    </main>

    <footer></footer>

    
    <?php if( $showLoginCode ):?>
    <!-- Show this code if the form submitted is not valid-->
    <script type="module">
        import BaseWindow from "./modules/BaseWindow.mjs";
        import Desktop from "./modules/Desktop.mjs";
        import Pong from "./modules/Pong.mjs";
        import FlappyBird from "./modules/FlappyBird.mjs";
        import Login from "./modules/Login.mjs";
        import Instructions from "./modules/Instructions.mjs";

        // Webpage setup
        const desktop = document.getElementById("desktop");
        const game = new Desktop(desktop);

        const pong = new Pong(desktop, 1);
        const flappybird = new FlappyBird(desktop, 2);
        const login = new Login(desktop, 3);
        const notepad = new Instructions(desktop, 4);
        game.registerWindow(pong.getBaseWindow());
        game.registerWindow(flappybird.getBaseWindow());
        game.registerWindow(login.getBaseWindow());
        game.registerWindow(notepad.getBaseWindow());
    </script>
    <?php endif; ?>
        
    <?php
    // echo the new script based on the database parameters
    if( $displayGame ){

        echo "<script type='module'>
                import Vec2 from './modules/Vec2.mjs';
                import BaseWindow from './modules/BaseWindow.mjs';
                import Terminal from './modules/Terminal.mjs';
                import Desktop from './modules/Desktop.mjs';
                import NameTree from './modules/NameTree.mjs';
                import {FileSystem, FileData} from './modules/FileSystem.mjs';
                import Pong from './modules/Pong.mjs';
                import FlappyBird from './modules/FlappyBird.mjs';
                import Login from './modules/Login.mjs';

                $(function() {
                var testSystem = new FileSystem();
                $.ajax({
                    url: '$map',
                    dataType: 'text',
                    success: function(data){
                        console.log(data);
                        testSystem.loadFromFile(data);
                    }
                });

                // Webpage setup
                const desktop = document.getElementById('desktop');
                const game = new Desktop(desktop);

                const terminal = new Terminal(desktop, 0, testSystem, $directory);

                // set user stats and inventory
                terminal.getUser.currentHp = $currentHealth;
                terminal.getUser.hp = $maxHealth;
                terminal.getUser.str = $attack;
                terminal.getUser.def = $defense;
                terminal.getUser.eva = $evasion;
                terminal.getUser.inventory = $itemsMap;

                game.registerWindow(terminal.getBaseWindow());
                });
            </script>";
    }
    ?>

</body>
</html>