#!/usr/local/bin/php
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
    function debug_to_console($data){
        $output = $data;
        if (is_array($output)) $output = implode(',', $output);
        echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
    }

    // login code is shown by default, game code is hidden
    $showLoginCode = true;
    $displayGame = false;

    
    // Check if the form was submitted
    if( $_SERVER['REQUEST_METHOD'] == 'POST' ){

        // Get the form data
        $inputtedUsername = $_POST['username'];
        $inputtedPassword = $_POST['password'];
        $inputtedProfile = $_POST['profile'];

        //Database connection
        $config = parse_ini_file("dbconfig.ini");
        $conn = new mysqli($config["host"], $config["user"], $config["pass"], $config["dbname"]);
        if( $conn->connect_error ){ die("Connection failed: " . $conn->connect_error);}


        ////////////////////////////////////////////////////////////////
        ////////////////// load Users from database ////////////////////
        ////////////////////////////////////////////////////////////////
        $users = "SELECT * FROM Users";
        $result = $conn->query($users);

        // check Username table for the inputted username
        $foundUser = false;
        $invalidPassword = false;
        while( $row = mysqli_fetch_array($result, MYSQLI_ASSOC) ){

            $username = $row['Username'];
            $password = $row['Password'];
            if( $username == $inputtedUsername && $password != $inputtedPassword ){ $invalidPassword = true;  break; }
            if( $username == $inputtedUsername ){ $foundUser = true; break;}
        }
        

        if( $invalidPassword ){
            
            // username is VALID, password id INVALID
            // do not show the main game page and remain on login page
            echo "alert('password is invalid')";
        }else{

            // username and password are VALID
            // display main game page, hide login page
            $showLoginCode = false;
            $displayGame = true;

            // if user was nat found, then update the database for this user
            if( $foundUser == false ){

                //sanitize inputs
                $stmt = $conn->prepare("INSERT INTO Users (Username, Password) VALUES (?, ?)");
                $stmt->bind_param('ss', $sanitized_username, $sanitized_password);
                $sanitized_username = $conn->real_escape_string($inputtedUsername);
                $sanitized_password = $conn->real_escape_string($inputtedPassword);

                $stmt->execute();
                $stmt->close();
            }



            ////////////////////////////////////////////////////////////////
            /////////////////    load the profile      /////////////////////
            ////////////////////////////////////////////////////////////////
            $profiles = "SELECT * FROM Profiles INNER JOIN Users ON Users.Username=Profiles.Username WHERE Profiles.Name='$inputtedProfile'";
            $result = $conn->query($profiles);
            
            // if the profile is not found, create a new one under the current username
            if( $result->num_rows <= 0 ){
                debug_to_console("NEW PROFILE CREATED");
                // default stats
                $currentHealth = 20.0;
                $maxHealth = 20.0;
                $attack = 10.0;
                $defense = 0.5;
                $evasion = 0.5;
                $map = "map1.txt";
                $directory = "C:";
                $healqty = 0;
                $keyqty = 0;

                // sanitize inputs
                $stmt = $conn->prepare("INSERT INTO Profiles (Name, Username, Max_health, Current_health, Attack, Defense, Evasion, Location, Map, Heal_quantity, Key_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->bind_param('ssdddddssii', $sName, $sUsername, $sMaxHealth, $sCurrentHealth, $sAttack, $sDefense, $sEvasion, $sDirectory, $sMap, $sHealqty, $sKeyqty);
                $sName = $conn->real_escape_string($inputtedProfile);
                $sUsername = $conn->real_escape_string($inputtedUsername);
                $sCurrentHealth = $conn->real_escape_string($currentHealth);
                $sMaxHealth = $conn->real_escape_string($maxHealth);
                $sAttack = $conn->real_escape_string($attack);
                $sDefense = $conn->real_escape_string($defense);
                $sEvasion = $conn->real_escape_string($evasion);
                $sMap = $conn->real_escape_string($map);
                $sDirectory = $conn->real_escape_string($directory);
                $sHealqty = $conn->real_escape_string($healqty);
                $sKeyqty = $conn->real_escape_string($keyqty);  

                $stmt->execute();
                $stmt->close();
            } 
            
            // profile must be in DB, so fetch its contents
            $profiles = "SELECT * FROM Profiles WHERE Name='$inputtedProfile' AND Username='$inputtedUsername'"; // fix for sql injection
            $result = $conn->query($profiles);
            while( $row = mysqli_fetch_array($result,  MYSQLI_ASSOC) ){
                
                $profileName = $row['Name'];
                $currentHealth = $row['Current_health'];
                $maxHealth = $row['Max_health'];
                $attack = $row['Attack'];
                $defense = $row['Defense'];
                $evasion = $row['Evasion'];
                $directory = $row['Location'];
                $map = $row['Map'];
                $healqty = $row['Heal_quantity'];
                $keyqty = $row['Key_quantity'];
            }

            // create cookies for profile and username
            setcookie("username", $inputtedUsername, time() + 86400); // Expires in 1 day
            setcookie("profile", $profileName, time() + 86400); // Expires in 1 day
            $conn->close();
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
                    url: 'map1.txt',
                    dataType: 'text',
                    success: function(data){
                        console.log(data);
                        testSystem.loadFromFile(data);
                    }
                });

                // Webpage setup
                const desktop = document.getElementById('desktop');
                const game = new Desktop(desktop);

                const terminal = new Terminal(desktop, 0, testSystem, '$directory');
                // set user stats and inventory
                terminal.getUser.currentHp = $currentHealth;
                terminal.getUser.hp = $maxHealth;
                terminal.getUser.str = $attack;
                terminal.getUser.def = $defense;
                terminal.getUser.eva = $evasion;
                terminal.getUser().setItems($healqty,$keyqty);

                game.registerWindow(terminal.getBaseWindow());
                });
            </script>";
    }
    ?>

</body>
</html>