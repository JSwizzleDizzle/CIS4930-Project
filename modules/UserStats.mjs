//This was originally a php file, but I was getting a "Failed to load module script: Expected a JavaScript module" error when importing User into terminal



//#!/usr/local/bin/php

//<html>

//<script>

class Inventory
{
    profileName;
    items;

    constructor(pname = "", healqty = 0, keyqty = 0)
    {
        this.profileName = pname;
        this.items = new Map();
        this.items.set("heal", healqty);
        this.items.set("keys", keyqty);
    }


}

    class User
    {
        uName;
        hp;
        currentHp;
        str;
        def;
        eva;
        location;
        inventory;
        //Enemy stats
        enemyHp;
        enemyChp;
        enemyStr;
        enemyDef;
        enemyEva;

        //Others
        damage;

        constructor(username, health, strength, defense, evasion, heals = 0, keys = 0){
            this.uName = username;
            this.hp = health;
            this.currentHp = health;
            this.str = strength;
            this.def = defense;
            this.eva = evasion;
            this.inventory = new Inventory(username, heals, keys);
        }

        loadInventory(heals, keys)
        {
            this.inventory = new Inventory(this.uName, heals, keys)
        }

        addItem(type)
        {
            if (type == "heal")
            {
                this.inventory.items.set("heal", this.inventory.items.get("heal") + 1);
                return true;
            }

            else if (type == "key")
            {
                this.inventory.items.set("key", this.inventory.items.get("keys") + 1);
                return true;
            }
            else{
                return false;
            }
        }

        removeItem(type)
        {
            if (type == "heal" && this.inventory.items.get("heal") > 0)
            {
                this.inventory.items.set("heal", this.inventory.items.get("heal") - 1);
                return true;
            }

            else if (type == "key" && this.inventory.items.get("keys") > 0)
            {
                this.inventory.items.set("key", this.inventory.items.get("keys") - 1);
                return true;
            }
            else{
                return false;
            }
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