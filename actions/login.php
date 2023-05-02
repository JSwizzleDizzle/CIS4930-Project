<?php 
    //get user inputs
    $inputtedUsername = htmlspecialchars($_GET['username']);
    $inputtedPassword = htmlspecialchars($_GET['password']);

    //Database connection
    $conn = new mysqli("mysql.cise.ufl.edu", "elewinkoh", "mysqlpassw0rd", "DBNAME");
    if( $conn->connect_error ){ die("Connection failed: " . $conn->connect_error);}

    // load Users from database
    $users = "SELECT * FROM Users";
    $result = $conn->query($sql);

    // check Username table for the inputted username
    $foundUser = false;
    while( $row = $result->fetch_assoc() ){

        $username = $row['Username'];
        $password = $row['Password'];
        if( $username == $inputtedUsername ){ $foundUser = true; break;}
    }

    
    if( $foundUser == false ){

        // if user nat found, then update the database for this user
        $stmt = $conn->prepare("INSERT INTO Users (Username, Password, Date) VALUES (?, ?, ?)");
        $stmt->bind_param('sss', $sanitized_username, $sanitized_password, $sanitized_date);
        $sanitized_username = $conn->real_escape_string($username);
        $sanitized_password = $conn->real_escape_string($password);
        $sanitized_date = htmlspecialchars($_POST['date']);

        $stmt->execute();
        $stmt->close();
    } 
    else if( $inputtedPassword != $password) {

        // im not sure how to go about verifying that the password is correct
    }


    // display the users available profiles
    echo 'this.printLine("Select a Profile");';

    $profiles = "SELECT * FROM Profiles WHERE Username = $username";
    $result = $conn->query($profiles);
    $profileCounter = 1;
    while( $row = $result->fetch_assoc() ){

        $level = $row['Level'];
        $currentHealth = $row['Current health'];
        $maxHealth = $row['Max health'];
        $attack = $row['Attack'];
        $defense = $row['Defense'];
        $evasion = $row['Evasion'];
        $experience = $row['Experience'];
        $location = $row['Location'];
        $healingItemQuantity = $row['Healing item quantity'];
        $keyQuantity = $row['Key quantity'];

        // printProfile creates a button with an onclick function. This onclick function will redirect the user a new page with their desired profile, passing all parameters
        echo 'this.printProfile("Profile {$profileCounter}: Level {$level}", "Profile{$profileCounter}.php?level=$level&currentHealth=$currentHealth&maxHealth=$maxHealth&attack=$attack&defense=$defense&evasion=$evasion&experience=$experience&location=$location&healingItemQuantity=$healingItemQuantity&keyQuantity=$keyQuantity");';
        $profileCounter+=1;
    }
    

?>