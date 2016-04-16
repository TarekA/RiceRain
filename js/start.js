/**
 * Created by User on 16.04.2016.
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('atari', 'assets/dish.png');
    game.load.spritesheet('background', 'assets/spritesheets/titlescreen-rice.png');
    game.load.spritesheet('button', 'assets/spritesheets/startbutton-sprite-x2.png', 200, 40);
    game.load.spritesheet('bullets', 'assets/grain.png', 17, 17);
    game.load.physics("sprite_physics", "assets/exported_shapes.json");
    game.load.spritesheet('grain', 'assets/grain.png');
    game.load.image('dish', 'assets/dish.png');
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

