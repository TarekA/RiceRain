var titleScreen = function(game){
    this.btnPlay;
    this.background;
}
titleScreen.prototype = {
    create: function(){
        this.background = this.game.add.sprite(game.world.centerX, game.world.centerY, 'background').anchor.set(0.5);
        //this.background.scale.setTo(800, 600);
        this.btnPlay = game.add.button(550, 400, 'button', this.startGame, this, 2, 1, 0);
        this.title_music = game.add.audio("title_music");
        this.title_music.play();
    },
    update: function(){

    },
    startGame: function(){
        this.title_music.stop();
        var startsound = game.add.audio('startgame');
        startsound.play();
        game.state.start("GameState",gameState);
    }
}