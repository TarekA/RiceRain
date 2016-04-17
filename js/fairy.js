/**
 * Created by Markus_Neu on 16.04.2016.
 */
//var fairyProperties = {
//    appear_x:0,
//    appear_y:0,
//    disappear_x:0,
//    disappear_y:0,
//    velocity:0,
//    diff_x:0,
//    diff_y:0,
//    vector_length:0,
//    sprite:0,
//    game: 0
//};

var fairyProperties = function(game){
    this.appear_x;
    this.appear_y;
    this.disappear_x;
    this.disappear_y;
    this.velocity;
    this.diff_x;
    this.diff_y;
    this.vector_length;
    this.gamestate;
    this.didReverse;
    this.randReverse;
}

Fairy = function(gamestate, game, appear_x, appear_y, disappear_x, disappear_y, velocity){
    console.log("Fairy-Konstruktor");
    this.appear_x = appear_x;
    this.appear_y = appear_y;
    this.disappear_x = disappear_x;
    this.disappear_y = disappear_y;
    this.velocity = velocity;
    this.game = game;
    this.gamestate = gamestate;
    this.didReverse=false;
    this.randReverse = Math.random();

    Phaser.Sprite.call(this, game, appear_x, appear_y, 'fairy');
    this.animations.add('left',[0,1,2,3,4,5,6,7]);
    this.animations.add('right', [8,9,10,11,12,13,14,15]);

    if(this.appear_x < this.disappear_x){
        this.animations.play('right', 30, true);
    } else {
        this.animations.play('left', 30, true);
    }

    this.vector_length = Math.sqrt(Math.pow(this.disappear_x - this.appear_x,2) + Math.pow(this.disappear_y - this.appear_y,2));

    this.gamestate.riceTimer = this.game.time.events.repeat(Phaser.Timer.SECOND, 100, this.dropRice, this);
};


Fairy.prototype = Object.create(Phaser.Sprite.prototype);
Fairy.prototype.constructor = Fairy;

/**
 * Automatically called by World.update
 */
Fairy.prototype.update = function() {

    this.x = this.x + this.velocity*(this.disappear_x-this.appear_x)/(this.vector_length*50);
    this.y = this.y + this.velocity*(this.disappear_y-this.appear_y)/(this.vector_length*50);

    if((this.x > 800) || (this.y > 300)|| (this.x <= 0 )|| (this.y <= 0)){
        //console.log("Fairy-Kill");
        if(!this.gamestate.finish) {
            this.gamestate.createFairy();
        }
        this.destroy();
    }

    if((this.x < 402) && (this.x >398) && (this.didReverse==false) && (this.randReverse <0.5)){
        this.revertFairy();
        this.didReverse=true;
    }

    //this.rices = this.game.add.group();
    //this.game.time.events.repeat(Phaser.Timer.SECOND, 100, this.dropRice, this);
    //this.game.time.events.loop(Phaser.Timer.SECOND, this.dropRice, this);
};

Fairy.prototype.dropRice = function() {
    console.log("dropCalled")
    if(this.gamestate.dropCounter>0) {
        if (this.position.x > 0 && this.position.x < 800 && this.position.y > 0 && this.position.y < 300) {
            new Rice(this.gamestate, this.game, this.position.x, this.position.y);
            this.gamestate.dropCounter--;
        }
    }


    //grain.scale.setTo(2, 2);

};

Fairy.prototype.revertFairy = function(){

    console.log("RevertFairy: "+this.x + " "+ this.y);
    this.animations.stop();
    if(this.disappear_x>300){
        this.appear_x = 600;
        this.appear_y = 0
        this.disappear_x =0;
        this.disappear_y = 50;
        this.animations.play('left', 30, true);
    } else {
        this.appear_x = 0;
        this.appear_y = 0
        this.disappear_x = 600;
        this.disappear_y = 50;
        this.animations.play('right', 30, true);
    }

};



/*
Schreibe eine Methode: Event auslösen - bei Rand des Bildschirms wird die Fairy zerstört!
 */