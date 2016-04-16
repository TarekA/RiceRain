var gameState = function(game){
    console.log("Hello");
    this.cursors;
    this.floor;
    this.riceCollisionGroup;
    this.bowlCollisionGroup;
}

gameState.prototype = {

    fire: function() {

        var ball = balls.getFirstExists(false);

        if (ball)
        {
            ball.frame = this.game.rnd.integerInRange(0,6);
            ball.exists = true;
            ball.reset(this.game.world.randomX, 0);

            //ball.body.bounce.y = 0.8;
        }

    },

    create: function() {
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);

        this.game.stage.backgroundColor = '#fff';

        this.riceCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.bowlCollisionGroup = this.game.physics.p2.createCollisionGroup();

        // this.floor = new Phaser.Rectangle(0, 575, 800, 25);
        // this.floor.enableBody = true;
        // this.floor.setCollisionGroup(this.bowlCollisionGroup);

        balls = this.game.add.group();
        balls.enableBody = true;
        balls.physicsBodyType = Phaser.Physics.P2JS;

        //balls.createMultiple(250, 'bullets', 0, false);
        for (var i = 0; i < 250; i++)
        {
            var ball = balls.create(0,false,'bullets');
            //panda.body.setRectangle(40, 40);

            ball.body.setCollisionGroup(this.riceCollisionGroup);

            //collide with both groups, but do nothing
            ball.frame = this.game.rnd.integerInRange(0,6);
            ball.body.collides(this.bowlCollisionGroup);
        }

        // this.game.physics.p2.updateBoundsCollisionGroup();
        this.game.physics.p2.gravity.y = 400;
        this.game.physics.p2.enable(balls);


        atari = this.game.add.sprite(300, 450, 'atari');
        this.game.physics.p2.enable(atari, false);
        atari.enableBody = true;
        atari.physicsBodyType = Phaser.Physics.P2JS;

        atari.body.setCollisionGroup(this.bowlCollisionGroup);
        atari.body.data.gravityScale = 0;
        atari.body.fixedRotation = true;


        //  Enable physics on everything added to the world so far (the true parameter makes it recurse down into children)
        // this.game.physics.arcade.enable(this.game.world, true);

        //atari.body.allowGravity = 0;
        //atari.body.immovable = true;

        atari.body.setCollisionGroup(this.bowlCollisionGroup);
        atari.body.collides(this.riceCollisionGroup, this.riceCaught, this);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.game.time.events.loop(150, this.fire, this);

        this.game.add.text(16, 16, 'Left / Right to move', { font: '18px Arial', fill: '#000' });
    },

    riceCaught: function(bowl, rice){
        //alert("Collision detected");
        atari.body.y = 450;
        atari.body.velocity.y = 0;
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

        if (this.cursors.left.isDown)
        {
            atari.body.velocity.x = -400;
        }
        else if (this.cursors.right.isDown)
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
        this.game.debug.geom(this.floor,'#8B4513');
    }
}
