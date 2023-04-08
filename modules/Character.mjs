class Character
{
    #health;
    #strength;
    #moves;

    constructor(health, strength, moves)
    {
        this.#health = health;
        this.#strength = strength;
        this.#moves = moves;
    }



    // ================ ACCESSORS ================ //
    get health() { return this.#health; }
    get strength() { return this.#strength; }
    get moves() { return this.#moves; }
}


class Player extends Character
{
    #evasion;

    constructor(health, strength, moves, evasion)
    {
        super(health, strength, moves);
        this.#evasion = evasion;
    }



    // ================ ACCESSORS ================ //
    get evasion() { return this.#evasion; }
}

class Enemy extends Character
{
    #stealPercentage; // possible idea: enem has the chance to steal items from player
    constructor(health, strength, moves, stealPercentage)
    {
        super(health, strength, moves);
        this.#stealPercentage = stealPercentage;
    }



    // ================ ACCESSORS ================ //
    get stealPercentage() { return this.#stealPercentage; }
}