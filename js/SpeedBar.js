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
    this.flipped = this.config.flipped
}

SpeedBar.prototype.mergeWithDefaultConfiguration = function(new_config) {
    var default_config = {
        width: 300,
        height: 40,
        x: 0,
        y: 0,
        bg: {
            color: '#FF4500'
        },
        bar: {
            color: '#ADFF2F'
        },
        animationDuration: 200,
        flipped: false,
    };

    return mergeObjects(default_config, new_config);
}

function mergeObjects(targetObj, newObj) {
    for (var p in newObj) {
        try {
            targetObj[p] = newObj[p].constructor==Object ? mergeObjetcs(targetObj[p], newObj[p]) : newObj[p];
        } catch(e) {
            targetObj[p] = newObj[p];
        }
    }
    return targetObj;
}

SpeedBar.prototype.drawBackground = function() {

    var bmd = this.game.add.bitmapData(this.config.width+10, this.config.height);
    bmd.ctx.fillStyle = this.config.bg.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();

    this.bgSprite = this.game.add.sprite(this.x, this.y, bmd);
    this.bgSprite.anchor.set(0.5);

    if(this.flipped){
        this.bgSprite.scale.x = -1;
    }
};

SpeedBar.prototype.drawSpeedBar = function() {
    var bmd = this.game.add.bitmapData(this.config.width-10, this.config.height-10);
    bmd.ctx.fillStyle = this.config.bar.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    //bmd.ctx.fillStyle = '#00685e'; set backgroundcolor of speedbar
    bmd.ctx.fill();

    //this.width_speed = new Phaser.Rectangle(0, 0, bmd.width, bmd.height);
    //this.total_speed = bmd.width;

    this.barSprite = this.game.add.sprite(this.x - this.bgSprite.width/2+5, this.y, bmd);
    this.barSprite.anchor.y = 0.5;

    //this.barSprite.cropEnabled = true;
    //this.barSprite.crop(this.width_speed);

    if(this.flipped){
        this.barSprite.scale.x = -1;
    }
};

SpeedBar.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;

    if(this.bgSprite !== undefined && this.barSprite !== undefined){
        this.bgSprite.position.x = x;
        this.bgSprite.position.y = y;

        this.barSprite.position.x = x - this.config.width/2;
        this.barSprite.position.y = y;
    }
};

SpeedBar.prototype.setPercent = function(newValue){
    if(newValue < 0) newValue = 0;
    if(newValue > 100) newValue = 100;

    var newWidth =  (newValue * this.config.width) / 100;

    this.setWidth(newWidth);
};

SpeedBar.prototype.setWidth = function(newWidth){
    if(this.flipped) {
        newWidth = -1 * newWidth;
    }
    this.game.add.tween(this.barSprite).to( { width: newWidth }, this.config.animationDuration, Phaser.Easing.Linear.None, true);
};

//SpeedBar.prototype = Object.create(Phaser.Sprite.prototype);
SpeedBar.prototype.constructor = SpeedBar;

/**
 * Automatically called by World.update
 */
SpeedBar.prototype.update = function() {

    //this.speed += this.speed;

};


