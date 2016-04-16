var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', 'assets/dish.png');
    game.load.spritesheet('bullets', 'assets/grain.png');
    //game.load.spritesheet('bullets', 'assets/grain.png', 17, 17);
}

var atari;
var balls;
var cursors;
var floor;
var riceCollisionGroup;
var bowlCollisionGroup;

function create() {

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);

    game.stage.backgroundColor = '#fff';

    riceCollisionGroup = game.physics.p2.createCollisionGroup();
    bowlCollisionGroup = game.physics.p2.createCollisionGroup();

    // floor = new Phaser.Rectangle(0, 575, 800, 25);
    // floor.enableBody = true;
    // floor.setCollisionGroup(bowlCollisionGroup);

    balls = game.add.group();
    balls.enableBody = true;
    balls.physicsBodyType = Phaser.Physics.P2JS;

    //balls.createMultiple(250, 'bullets', 0, false);
    for (var i = 0; i < 250; i++)
    {
        var ball = balls.create(0,false,'bullets');
        //panda.body.setRectangle(40, 40);

        ball.body.setCollisionGroup(riceCollisionGroup);

        //collide with both groups, but do nothing
        ball.frame = game.rnd.integerInRange(0,6);
        ball.body.collides(bowlCollisionGroup);
    }

    // game.physics.p2.updateBoundsCollisionGroup();
    game.physics.p2.gravity.y = 400;
    game.physics.p2.enable(balls);


    atari = game.add.sprite(300, 450, 'atari');
    game.physics.p2.enable(atari, false);
    atari.enableBody = true;
    atari.physicsBodyType = Phaser.Physics.P2JS;

    atari.body.setCollisionGroup(bowlCollisionGroup);
    atari.body.data.gravityScale = 0;
    atari.body.fixedRotation = true;


    //  Enable physics on everything added to the world so far (the true parameter makes it recurse down into children)
    // game.physics.arcade.enable(game.world, true);

    //atari.body.allowGravity = 0;
    //atari.body.immovable = true;

    atari.body.setCollisionGroup(bowlCollisionGroup);
    atari.body.collides(riceCollisionGroup, riceCaught, this);

    cursors = game.input.keyboard.createCursorKeys();

    game.time.events.loop(150, fire, this);

    game.add.text(16, 16, 'Left / Right to move', { font: '18px Arial', fill: '#000' });

}

function riceCaught(bowl, rice){
    //alert("Collision detected");
    atari.body.y = 450;
    atari.body.velocity.y = 0;
}


function fire() {

    var ball = balls.getFirstExists(false);

    if (ball)
    {
        ball.frame = game.rnd.integerInRange(0,6);
        ball.exists = true;
        ball.reset(game.world.randomX, 0);

        //ball.body.bounce.y = 0.8;
    }

}

function reflect(a, ball) {

    if (ball.y > (atari.y + 5))
    {
        return true;
    }
    else
    {
        ball.body.velocity.x = atari.body.velocity.x;
        ball.body.velocity.y *= -(ball.body.bounce.y);

        return false;
    }

}

function update() {

    game.physics.arcade.collide(atari, balls, null, reflect, this);

    atari.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        atari.body.velocity.x = -400;
    }
    else if (cursors.right.isDown)
    {
        atari.body.velocity.x = 400;
    }

    balls.forEachAlive(checkBounds, this);

}

function checkBounds(ball) {

    if (ball.y > 600)
    {
        ball.kill();
    }

}

function render() {
    game.debug.geom(floor,'#8B4513');
}