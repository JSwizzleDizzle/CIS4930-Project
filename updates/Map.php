#!/usr/local/bin/php
<?php
    function debug_to_console($data){
        $output = $data;
        if (is_array($output)) $output = implode(',', $output);
        echo $output;
    }
    // fetch the passed variables
    $newMap = $_POST['Map'];
    $username = $_COOKIE['username'];
    $profile = $_COOKIE['profile'];

    // Database connection
    $config = parse_ini_file("../dbconfig.ini");
    $conn = new mysqli($config["host"], $config["user"], $config["pass"], $config["dbname"]);
    if( $conn->connect_error ){ die("Connection failed: " . $conn->connect_error);}

    // Define the UPDATE statement
    $sql = "UPDATE Profiles SET Map='$newMap' WHERE Username='$username' AND Name='$profile'";

    // Execute the UPDATE statement
    $conn->query($sql) ? debug_to_console("Map updated") : debug_to_console("error updating Map");

    // Close the database connection
    $conn->close();

?>