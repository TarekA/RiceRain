/**
 * Created by User on 16.04.2016.
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('atari', 'assets/dish.png');
    game.load.spritesheet('bullets', 'assets/grain.png');
    //game.load.spritesheet('bullets', 'assets/grain.png', 17, 17);
}

function create(){
    //var game = new Phaser.Game(320, 480, Phaser.CANVAS, "game");
    //game.state.add("Start",start);
    //game.state.add("TitleScreen",titleScreen);
    game.state.add("GameState",gameState);

}
function update(){
    console.log("Start");
    game.state.start("GameState");
    console.log("Ende");
}

function render() {

}

