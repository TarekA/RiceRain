/**
 * Created by User on 16.04.2016.
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render, init: init });

function preload() {
    game.load.image('floor', 'assets/floor.png');
    //game.load.image('fairy', 'assets/fairy.jpg');
    game.load.spritesheet('fairy', 'assets/spritesheets/fairy-sprite-x16.png', 80, 80, 16);
    //game.load.spritesheet('fairy_left', 'assets/spritesheets/fairy-sprite-x8-left.png', 80, 80, 8);
    game.load.spritesheet('background', 'assets/spritesheets/titlescreen-rice.png');
    game.load.spritesheet('bg_gameOver1', 'assets/gfx/gameover00.png');
    game.load.spritesheet('bg_gameOver2', 'assets/gfx/gameover41.png');
    game.load.spritesheet('button', 'assets/spritesheets/startbutton-sprite-x2.png', 200, 40);
    game.load.spritesheet('replaybutton', 'assets/gfx/restartbutton-sprite-x2.png', 200, 40);
    game.load.spritesheet('bullets', 'assets/grain.png', 17, 17);
    game.load.physics("sprite_physics", "assets/shapes.json");
    game.load.spritesheet('grain', 'assets/grain.png');
    game.load.image('dish', 'assets/ricedish.png');
    game.load.audio('rice', 'assets/sound/rice2.mp3');
    game.load.audio('startgame', 'assets/sound/startgame.mp3');
    game.load.audio('title_music', 'assets/sound/China_Nervig.mp3');
    game.load.audio('background_music', 'assets/sound/China_Slowboat.mp3')
    game.load.audio('fairysound', 'assets/sound/fairy_appear.mp3');
    game.load.audio('lost', 'assets/sound/lost.mp3');
    game.load.audio('win', 'assets/sound/win.mp3');
    game.load.image('platform', 'assets/example/platform.png');
    game.load.video('vid_gameOver', 'assets/vids/gameover.mp4');
    game.load.image('fairy_effect', 'assets/particles/blue.png');
}

function create(){
    game.state.add("TitleScreen",titleScreen);
    game.state.add("GameState",gameState);
    game.state.add("GameOverScreen", gameOverScreen);
}
function update(){
    game.state.start("TitleScreen");
}

function render() {

}

function init(){
    
}
