/**
 * Created by User on 17.04.2016.
 */
var gameOverScreen = function(game){
    this.btnReplay;
    this.background;
    this.video;
    this.sprite;
    this.emitter;
    this.riceGrains;
    this.points;
}
gameOverScreen.prototype = {
    init: function(points){
        this.points = points;
    },
    create: function(){
        this.background = this.game.add.sprite(game.world.centerX, game.world.centerY, 'bg_gameOver1').anchor.set(0.5);
        this.video = this.game.add.video('vid_gameOver');
        //this.video.onPlay.addOnce(start, this);
        this.video.onComplete.add(this.vidComplete, this);
        this.sprite = this.video.addToWorld(400, 300, 0.5, 0.5);
        this.video.play();
    },
    update: function(){

    },
    replayGame: function(){
        var startsound = game.add.audio('startgame');
        startsound.play();
        game.state.start("GameState",gameState);
    },
    vidComplete: function(){
        this.btnReplay = game.add.button(300, 75, 'replaybutton', this.replayGame, this, 1, 2, 2);
        var color;
        var xPos;
        var sound;
        if(this.points >= 25){
            color = '#458B00';
            sound = game.add.audio("win");
        }else{
            color = '#DD0000';
            sound = game.add.audio("lost");
        }
        if(this.points >= 10){
            xPos = 385;
        }else{
            xPos = 395;
        }
        sound.play();
        this.riceGrains = game.add.text(xPos,325, this.points, {font: '30px Arial', fill: color});
        //this.emitter = game.add.emitter(game.world.centerX, 100, 600);
        //
        //this.emitter.makeParticles('fairy_effect');
        //
        //this.emitter.setRotation(0, 0);
        //this.emitter.setAlpha(1, 1);
        //this.emitter.setScale(0.1, 0.1);
        //this.emitter.gravity = 0;

        //	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
        //	The 5000 value is the lifespan of each particle before it's killed
        //this.emitter.start(false, 200, 100);
    }
}

