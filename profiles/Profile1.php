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
    <script>
        // for refreshing the date/time
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
    <?php 
        // get the passed parameters
        $level = htmlspecialchars($_GET['level']);
        $currentHealth = htmlspecialchars($_GET['currentHealth']);
        $maxHealth = htmlspecialchars($_GET['maxHealth']);
        $attack = htmlspecialchars($_GET['attack']);
        $defense = htmlspecialchars($_GET['defense']);
        $evasion = htmlspecialchars($_GET['evasion']);
        $experience = htmlspecialchars($_GET['experience']);
        $location = htmlspecialchars($_GET['location']);
        $healingItemQuantity = htmlspecialchars($_GET['healingItemQuantity']);
        $keyQuantity = htmlspecialchars($_GET['keyQuantity']);
    ?>
    <script type="module">
        import Vec2 from "./modules/Vec2.mjs";
        import BaseWindow from "./modules/BaseWindow.mjs";
        import Terminal from "./modules/Terminal.mjs";
        import Desktop from "./modules/Desktop.mjs";
        import NameTree from "./modules/NameTree.mjs";
        import {FileSystem, FileData} from "./modules/FileSystem.mjs";
        import Pong from "./modules/Pong.mjs";
        import FlappyBird from "./modules/FlappyBird.mjs";
    </script>
</body> 
</html>