var gameState = function(game){
    console.log("Hello");
    //this.atari;
    //this.balls;
}


gameState.prototype = {

    fire: function() {

        var ball = balls.getFirstExists(false);

        if (ball)
        {
            ball.frame = this.game.rnd.integerInRange(0,6);
            ball.exists = true;
            ball.reset(this.game.world.randomX, 0);

            ball.body.bounce.y = 0.8;
        }

    },

    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#fff';

        balls = this.game.add.group();

        balls.createMultiple(250, 'bullets', 0, false);

        atari = this.game.add.sprite(300, 450, 'atari');

        this.game.physics.arcade.gravity.y = 400;

        //  Enable physics on everything added to the world so far (the true parameter makes it recurse down into children)
        this.game.physics.arcade.enable(this.game.world, true);

        atari.body.allowGravity = 0;
        atari.body.immovable = true;

        cursors = this.game.input.keyboard.createCursorKeys();

        this.game.time.events.loop(150, this.fire, this);

        this.game.add.text(16, 16, 'Left / Right to move', { font: '18px Arial', fill: '#000' });
    },

    reflect: function(a, ball) {

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
    },

    update: function () {

        this.game.physics.arcade.collide(atari, balls, null, this.reflect, this);

        atari.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            atari.body.velocity.x = -400;
        }
        else if (cursors.right.isDown)
        {
            atari.body.velocity.x = 400;
        }

        balls.forEachAlive(this.checkBounds, this);

    },

    checkBounds: function (ball) {

        if (ball.y > 600)
        {
            ball.kill();
        }

    },

    render: function() {

    }
}
