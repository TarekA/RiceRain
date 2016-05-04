var titleScreen = function(game){
    this.btnPlay;
    this.btnPlayBomb;
    this.background;
}
titleScreen.prototype = {
    init: function () {

    },
    create: function(){
        this.background = this.game.add.sprite(game.world.centerX, game.world.centerY, 'background').anchor.set(0.5);
        //this.background.scale.setTo(800, 600);
        this.btnPlay = game.add.button(550, 400, 'button', this.startGame, this, 1, 2, 2);
        this.btnPlayBomb = game.add.button(550, 450, 'button_bomb', this.startBombGame, this, 1, 2, 2);
        this.title_music = game.add.audio("title_music");
        this.title_music.play();
    },
    update: function(){

    },
    startGame: function(){
        this.title_music.stop();
        var startsound = game.add.audio('startgame');
        startsound.play();
        game.state.start("GameState",gameState,false,false);
    },
    startBombGame: function(){
        this.title_music.stop();
        var startsound = game.add.audio('startgame');
        startsound.play();
        game.state.start("GameState",gameState,false,true);
    }
}
