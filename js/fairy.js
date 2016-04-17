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
}

Fairy = function(gameState, game, appear_x, appear_y, disappear_x, disappear_y, velocity){
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
    
    this.animations.add('fly');
    this.animations.play('fly', 30, true);
    
    this.vector_length = Math.sqrt((this.disappear_x - this.appear_x)^2 + (this.disappear_y - this.appear_y)^2);

    this.game.time.events.repeat(Phaser.Timer.SECOND, 100, this.dropRice, this);

};

Fairy.prototype = Object.create(Phaser.Sprite.prototype);
Fairy.prototype.constructor = Fairy;

/**
 * Automatically called by World.update
 */
Fairy.prototype.update = function() {

    this.x = this.x + this.velocity*(this.disappear_x-this.appear_x)/(this.vector_length*1000);
    this.y = this.y + this.velocity*(this.disappear_y-this.appear_y)/(this.vector_length*1000);

    if((this.x > 800) || (this.y > 600)|| (this.x < 0 )|| (this.y < 0)){
        //console.log("Fairy-Kill");
        this.destroy();
    }
    //this.rices = this.game.add.group();
    //this.game.time.events.repeat(Phaser.Timer.SECOND, 100, this.dropRice, this);
    //this.game.time.events.loop(Phaser.Timer.SECOND, this.dropRice, this);
};

Fairy.prototype.dropRice = function() {
    console.log('rice');
    new Rice(this.game, this.position.x, this.position.y);

    //grain.scale.setTo(2, 2);

}



/*
Schreibe eine Methode: Event auslösen - bei Rand des Bildschirms wird die Fairy zerstört!
 */