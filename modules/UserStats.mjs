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
        crit;


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
                this.inventory.items.set("key", this.inventory.items.get("key") + 1);
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

att(target){
    //Roll to attack!! If roll is higher than enemy evasion then attack successfully hits.
    let attRoll = Math.random();
this.crit = false;
    if(attRoll >= target.eva){
        let critRoll = Math.random();
        //Make damage go to hundreths decimal places max
        this.damage = 100 * (this.str - this.str*target.def);
        this.damage = Math.round(this.damage)/100;
        if(critRoll <= .1){
            this.damage *= 2;
            this.crit = true;
        }
        target.currentHp -= this.damage;
        target.currentHp = Math.round(target.currentHp *100)/100;
        return true;
    }
    return false;
}

exp(target){
    this.hp += Math.round(target.str);
    this.def += target.str;
    this.str += Math.round(target.str);
    this.eva += target.str;}
    
heal(){
    let healamt = this.hp / 5.0
    this.currentHp += healamt;
    if (this.currentHp > this.hp)
    {
        let healamt = this.currentHp - this.hp;
        this.currentHp = this.hp;
    }
    return healamt;
}
}

export default User;
//</script>

//</html>