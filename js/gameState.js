var gameState = function(game){
    console.log("Hello");
    this.cursors;
    this.floor;
    this.dish;
    this.riceCollisionGroup;
    this.bowlCollisionGroup;
    this.fairy;
    this.rices;
    this.rice;
}

gameState.prototype = {

    fire: function() {

        var rice = this.rices.getFirstExists(false);

        if (rice)
        {
            rice.frame = this.game.rnd.integerInRange(0,6);
            rice.exists = true;
            rice.reset(this.game.world.randomX, 0);
            //rice.body.bounce.y = 0.8;
        }

    },

    create: function() {

        this.game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.defaultRestitution = 0.8;
        game.physics.p2.gravity.y = 100;
        this.game.physics.p2.restitution = 1;
        this.game.physics.p2.setImpactEvents(true);

        this.fairy = new Fairy(this.game, 10, 10, 500, 150, 100);
        
        //this.fairy.anchor.setTo(0, 0);
        this.fairy.scale.setTo(2, 2);

        this.game.add.existing(this.fairy);
        
        this.fairy.animations.add('fly');
        this.fairy.animations.play('fly', 30, true);

        this.game.stage.backgroundColor = '#fff';
        var spriteMaterial = this.game.physics.p2.createMaterial('spriteMaterial');
        var worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
        var contactMaterial = this.game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial, { restitution: 1.0 })

        this.game.physics.p2.setWorldMaterial(worldMaterial);

        this.game.stage.backgroundColor = '#f9f9f9';

        this.riceCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.bowlCollisionGroup = this.game.physics.p2.createCollisionGroup();

        this.floor = new Phaser.Rectangle(0, 575, 800, 25);
        this.game.physics.p2.enable([this.floor], true); // false
        this.floor.enableBody = true;

        this.createDish();

        //  Enable physics on everything added to the world so far (the true parameter makes it recurse down into children)
        // this.game.physics.arcade.enable(this.game.world, true);
        this.createRice();

        // this.game.physics.p2.updateBoundsCollisionGroup();
        this.game.physics.p2.gravity.y = 300;
        this.game.physics.p2.enable(this.rices);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.time.events.loop(150, this.fire, this);
        this.game.add.text(16, 16, 'Left / Right to move', { font: '18px Arial', fill: '#000' });
    },

    riceCaught: function(bowl, rice){
        console.log("Collision detected");
        this.dish.body.y = 450;
        this.dish.body.velocity.y = 0;
    },

    reflect: function(a, rice) {
        console.log("reflect");
        if (rice.y > (this.dish.y + 5))
        {
            return true;
        }
        else
        {
            rice.body.velocity.x = this.dish.body.velocity.x;
            rice.body.velocity.y *= -(rice.body.bounce.y);

            return false;
        }
    },

    update: function () {

        this.game.physics.arcade.collide(this.dish, this.rice, null, this.reflect, this);
        this.dish.body.setZeroVelocity();

        //this.dish.body.velocity.x = 0;
        if (this.cursors.left.isDown)
        {
            //this.dish.body.velocity.x = -400;
            this.dish.body.moveLeft(400);
        }
        else if (this.cursors.right.isDown)
        {
            //this.dish.body.velocity.x = 400;
            this.dish.body.moveRight(400);
        }

        this.rices.forEachAlive(this.checkBounds, this);
    },

    checkBounds: function (rice) {
        //console.log("checkBounds");
        if (rice.y > 800)
        {
            rice.kill();
        }

    },

    render: function() {
        this.game.debug.geom(this.floor,'#8B4513');
    },
    createDish: function () {
        this.dish = this.game.add.sprite(350, 535, 'dish');
        game.physics.p2.enable(this.dish);
        this.game.physics.p2.enable([this.dish], true); // false
        this.dish.body.clearShapes(); // Get rid of current bounding box
        this.dish.body.loadPolygon("sprite_physics", "dish"); // // Add our PhysicsEditor bounding shape
        this.dish.body.setCollisionGroup(this.bowlCollisionGroup);
        this.dish.body.setZeroDamping(); //  Modify a few body properties
        this.dish.body.data.gravityScale = 0;
        this.dish.body.fixedRotation = true; // fixedRotation = true --> dish is fix
        this.dish.body.allowGravity = 0;
        this.dish.body.immovable = true;
        this.dish.body.collideWorldBounds = true;
        this.dish.body.collides(this.riceCollisionGroup, this.riceCaught, this);

        //this.dish.body.setMaterial(spriteMaterial);
        //this.dish.physicsBodyType = Phaser.Physics.P2JS;
        //this.dish.enableBody = true;
        //this.dish.body.onBeginContact.add(blockHit, this.rice);
    },
    createRice: function () {

        this.rices = this.game.add.group();
        this.rices.enableBody = true;
        //rices.physicsBodyType = Phaser.Physics.P2JS;

        //rices.createMultiple(250, 'gain', 0, false);
        for (var i = 0; i < 250; i++)
        {
            this.rice = this.game.add.sprite(0,false, 'grain');
            this.game.physics.p2.enable([this.rice], true); // false
            this.rice.body.clearShapes(); // Get rid of current bounding box
            this.rice.body.loadPolygon("sprite_physics", "grain"); // // Add our PhysicsEditor bounding shape
            this.rice.body.setCollisionGroup(this.riceCollisionGroup);
            this.dish.body.setZeroDamping();

            //collide with both groups, but do nothing
            this.rice.frame = this.game.rnd.integerInRange(0,6);
            this.rice.body.collides(this.bowlCollisionGroup);
            this.rices.add(this.rice);
        }
    }
}
