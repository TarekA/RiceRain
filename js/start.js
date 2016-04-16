/**
 * Created by User on 16.04.2016.
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('atari', 'assets/dish.png');
    game.load.spritesheet('bullets', 'assets/grain.png');
    game.load.image('background', 'assets/example/rice_copy.png');
    game.load.spritesheet('button', 'assets/example/button_sprite_sheet.png', 193, 71);
    game.load.spritesheet('bullets', 'assets/grain.png', 17, 17);
}

function create(){
    game.state.add("TitleScreen",titleScreen);
    game.state.add("GameState",gameState);
}
function update(){
    game.state.start("TitleScreen");
}

function render() {

}

