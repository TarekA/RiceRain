/**
 * Created by Markus_Neu on 16.04.2016.
 */
var fairyProperties = {
    appear_x:0,
    appear_y:0,
    disappear_x:0,
    disappear_y:0,
    velocity:0,
    diff_x:0,
    diff_y:0,
    vector_length:0,
};

Fairy = function(game, appear_x, appear_y, disappear_x, disappear_y, velocity){
    console.log("Fairy-Konstruktor");
    this.appear_x = appear_x;
    this.appear_y = appear_y;
    this.disappear_x = disappear_x;
    this.disappear_y = disappear_y;
    this.velocity = velocity;
    this.game = game;
    
    if(this.appear_x < this.disappear_x){
        Phaser.Sprite.call(this, game, appear_x, appear_y, 'fairy_right');
    } else {
        Phaser.Sprite.call(this, game, appear_x, appear_y, 'fairy_left');
    }
    

    //this.animations.add('fly');

    //this.sprite.animations.play('fly', 50, true);
    
    this.vector_length = Math.sqrt((this.disappear_x - this.appear_x)^2 + (this.disappear_y - this.appear_y)^2);

};

Fairy.prototype = Object.create(Phaser.Sprite.prototype);
Fairy.prototype.constructor = Fairy;

/**
 * Automatically called by World.update
 */
Fairy.prototype.update = function() {

    //console.log("Fairy-Update");

    this.x = this.x + this.velocity*(this.disappear_x-this.appear_x)/(this.vector_length*1000);
    this.y = this.y + this.velocity*(this.disappear_y-this.appear_y)/(this.vector_length*1000);

    if((this.x > 800) || (this.y > 600)|| (this.x < 0 )|| (this.y < 0)){
        //console.log("Fairy-Kill");
        this.destroy();
    }

};



/*
Schreibe eine Methode: Event auslösen - bei Rand des Bildschirms wird die Fairy zerstört!
 */