//This was originally a php file, but I was getting a "Failed to load module script: Expected a JavaScript module" error when importing User into terminal



//#!/usr/local/bin/php

//<html>

//<script>
    class User
    {
        uName;
        hp;
        currentHp;
        str;
        def;
        eva;
        location;
        //Enemy stats
        enemyHp;
        enemyChp;
        enemyStr;
        enemyDef;
        enemyEva;

        //Others
        damage;

        constructor(username, health, strength, defense, evasion){
            this.uName = username;
            this.hp = health;
            this.currentHp = health;
            this.str = strength;
            this.def = defense;
            this.eva = evasion;
        }
    
    //<?php 
    // $conn = mysqli_connect("mysql.cise.ufl.edu", "username", "password", "database");
	// // Check connection
	// if ($conn->connect_error) {
	//   die("Connection failed: " . $conn->connect_error);
	// }
//Sign up
        //signUp(name, password){
            //$sql = "INSERT INTO user_stats(username,password,hp,cHp,str,def,eva,loc) VALUES (?, ?, 20, 20, 10, 10, 10)";
            //$stmt = mysqli_prepare($conn, $sql);
            //mysqli_stmt_bind_param($stmt, "s", name, password);
            //mysqli_stmt_execute($stmt);
            
            //close access to mysql
            //mysqli_close($conn);
        //}

//Load in
        // Load(name, password){

        // }

//?>

//Enemy stats
grunt(){
    this.enemyHp = Math.random() * this.hp;
    this.enemyChp = this.enemyHp;
    this.enemyStr = Math.random()* this.str;
    this.enemyDef = Math.random()* this.def;
    this.enemyEva = Math.random()* this.eva;
}
boss(){
    this.enemyHp = Math.random()* this.hp + 4;
    this.enemyChp = this.enemyHp;
    this.enemyStr = Math.random()* this.str + 4;
    this.enemyDef = Math.random()* this.def + 4;
    this.enemyEva = Math.random()* this.eva + 4;

}
enemyAtt(){
    let attRoll = Math.random();
    if(attRoll >= this.eva){
        this.damage = (this.enemyStr - this.enemyStr*this.def);
        this.currentHp -= this.damage;
        return true;
    }
    return false;
}
att(){
    let attRoll = Math.random();
    if(attRoll >= this.enemyEva){
        this.damage = (this.str - this.str*this.enemyDef);
        this.enemyChp -= this.damage;
        return true;
    }
    return false;
}
exp(){
    this.hp += this.enemyStr;
    this.def += this.enemyStr;
    this.str += this.enemyStr;
    this.eva += this.enemyStr;

}
}

export default User;
//</script>

//</html>