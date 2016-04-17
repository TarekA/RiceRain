/**
 * Created by User on 16.04.2016.
 */
/**
 * Created by Markus_Neu on 16.04.2016.
 */
var riceProperties = function(game){
    this.appear_x;
    this.appear_y;
    this.dishCollisionGroup;
    this.gamestate;
};

Rice = function(gamestate, game, appear_x, appear_y){

        this.appear_x = appear_x + 80;
        this.appear_y = appear_y + 80;
        this.gamestate = gamestate;

        // Phaser.Sprite.call(this, game, appear_x, appear_y, 'grain');

    if(game != null) {
        // this.rice = game.add.sprite(this.appear_x, this.appear_y, 'grain');
        // game.physics.p2.enable([this.rice], true); // false
        // this.rice.body.clearShapes(); // Get rid of current bounding box
        // this.rice.body.loadPolygon("sprite_physics", "grain"); // // Add our PhysicsEditor bounding shape
        // this.rice.body.setCollisionGroup(gamestate.riceCollisionGroup);
        // this.rice.body.data.gravityScale = 1.5;
        gamestate.createRice(this.appear_x, this.appear_y);

        //collide with both groups, but do nothing
        //this.rice.frame = game.rnd.integerInRange(0,6);
        //this.rice.body.collides(this.dishCollisionGroup);
        // this.rices.add(this.rice);
    }

};

Rice.prototype = Object.create(Phaser.Sprite.prototype);
Rice.prototype.constructor = Rice;

/**
 * Automatically called by World.update
 */
Rice.prototype.update = function() {

};


