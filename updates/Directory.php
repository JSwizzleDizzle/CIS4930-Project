#!/usr/local/bin/php
<?php
    function debug_to_console($data){
        $output = $data;
        if (is_array($output)) $output = implode(',', $output);
        echo $output;
    }
    // fetch the user command
    $arg = $_POST['arg'];
    $username = $_COOKIE['username'];
    $profile = $_COOKIE['profile'];

    // Database connection
    $config = parse_ini_file("../dbconfig.ini");
    $conn = new mysqli($config["host"], $config["user"], $config["pass"], $config["dbname"]);
    if( $conn->connect_error ){ die("Connection failed: " . $conn->connect_error);}
    
    
    // fetch the correct profile
    $profiles = "SELECT * FROM Profiles WHERE Name='$profile' AND Username='$username'"; // fix for sql injection
    $result = $conn->query($profiles);
    while( $row = mysqli_fetch_array($result,  MYSQLI_ASSOC) ){
        $directory = $row['Location'];
    }

    $array = explode("\\", $directory);
    // if cd .. then pop, else push arg
    $arg == ".." ? array_pop($array) : array_push($array, $arg);
    $newDirectory = implode("\\\\", $array);

    // Define the UPDATE statement
    $sql = "UPDATE Profiles SET Location='$newDirectory' WHERE Username='$username' AND Name='$profile'";

    // Execute the UPDATE statement
    $conn->query($sql) ? debug_to_console("Location updated") : debug_to_console("error updating location");

    // Close the database connection
    $conn->close();

?>