/**
 * Created by Kevin on 16.04.2016.
 */
//  Here is a custom game object
var SpeedBar = function (game, prov_config) {

    //Phaser.Sprite.call(this, game, x, y, 'atari');
    //this.scale.pageAlignHorizontally = true;
    this.game = game;
    this.setupConfiguration(prov_config);
    this.setPosition(this.config.x, this.config.y)
    this.drawBackground();
    this.drawSpeedBar();

};

SpeedBar.prototype.setupConfiguration = function (prov_config) {
    this.config = this.mergeWithDefaultConfiguration(prov_config);
}

SpeedBar.prototype.mergeWithDefaultConfiguration = function(new_config) {
    var default_config = {
        width: 300,
        height: 40,
        x: 0,
        y: 0,
        bg: {
            color: '#8B0000'
        },
        bar: {
            color: '##8B4513'
        },
        animation_duration: 200,
    };

    return mergeObjects(default_config, new_config);
}

function mergeObjects(target_obj, new_obj) {
    for (var p in new_obj) {
        try {
            target_obj[p] = new_obj[p].constructor==Object ? mergeObjetcs(target_obj[p], new_obj[p]) : new_obj[p];
        } catch(e) {
            target_obj[p] = new_obj[p];
        }
    }
    return target_obj;
}

SpeedBar.prototype.drawBackground = function() {

    var bmd = this.game.add.bitmapData(this.config.width+10, this.config.height);
    bmd.ctx.fillStyle = this.config.bg.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();

    this.bg_sprite = this.game.add.sprite(this.x, this.y, bmd);
    this.bg_sprite.anchor.set(0.5);
};

SpeedBar.prototype.drawSpeedBar = function() {
    var bmd = this.game.add.bitmapData(this.config.width+10, this.config.height-10);
    bmd.ctx.fillStyle = this.config.bar.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();

    this.bar_sprite = this.game.add.sprite(this.x - this.bg_sprite.width/2+5, this.y, bmd);
    this.bar_sprite.anchor.y = 0.5;
};

SpeedBar.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;

    if(this.bg_sprite !== undefined && this.bar_sprite !== undefined){
        this.bg_sprite.position.x = x;
        this.bg_sprite.position.y = y;

        this.bar_sprite.position.x = x - this.config.width/2;
        this.bar_sprite.position.y = y;
    }
};

SpeedBar.prototype.setPercent = function(new_value){
    if(new_value < 0) new_value = 0;
    if(new_value > 30) new_value = 30;

    var new_width =  (new_value*3 * this.config.width) / 100 + new_value; //this.config.width

    this.setWidth(new_width);
};

SpeedBar.prototype.setWidth = function(new_width){
    this.game.add.tween(this.bar_sprite).to( { width: new_width }, this.config.animation_duration, Phaser.Easing.Linear.None, true);
};

//SpeedBar.prototype = Object.create(Phaser.Sprite.prototype);
SpeedBar.prototype.constructor = SpeedBar;

/**
 * Automatically called by World.update
 */
SpeedBar.prototype.update = function() {

    //this.speed += this.speed;

};


