var gameState = function(game){
    console.log("Hello");
    this.cursors;
    this.floor;
    this.dish;
    this.riceCollisionGroup;
    this.dishCollisionGroup;
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

        var speedbar_config = {x: 650, y: 30, speed: 100};
        this.speedbar = new SpeedBar(this.game, speedbar_config);
        this.speedbar.setPercent(50);

        this.rice = game.add.audio('rice');

        //this.load.setPreloadSprite(this.speedbar);
        //this.speedbar.anchor.setTo(0,0);
        //this.game.add.existing(this.speedbar);

        //this.game.add(this.speedbar);


        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.defaultRestitution = 0.9;
        this.game.physics.p2.gravity.y = 300;
        this.game.physics.p2.restitution = 0.2;
        this.game.physics.p2.setImpactEvents(true);

        this.fairy = new Fairy(this.game, 10, 10, 500, 150, 100);

        //Resize Fairy:
        //this.fairy.anchor.setTo(0, 0);
        //this.fairy.scale.setTo(2, 2);

        this.game.add.existing(this.fairy);
        

        this.game.stage.backgroundColor = '#fff';
        //var spriteMaterial = this.game.physics.p2.createMaterial('spriteMaterial');
        //var worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
        //var contactMaterial = this.game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial, { restitution: 1.0 })

        //this.game.physics.p2.setWorldMaterial(worldMaterial);

        this.game.stage.backgroundColor = '#f9f9f9';

        this.riceCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.dishCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.floorCollisionGroup = this.game.physics.p2.createCollisionGroup();

        this.game.physics.p2.updateBoundsCollisionGroup();

        this.createFloor();
        this.createDish();
        //this.createRice();
        this.rices = this.game.add.group();

        //this.game.time.events.loop(Phaser.Timer.SECOND, this.createRice(), this);
        this.game.time.events.repeat(Phaser.Timer.SECOND, 100, this.createRice, this); // 100mal

        // this.game.physics.p2.updateBoundsCollisionGroup();
        this.game.physics.p2.gravity.y = 300;
        this.game.physics.p2.enable(this.rices);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.time.events.loop(150, this.fire, this);
        this.game.add.text(16, 16, 'Left / Right to move', { font: '18px Arial', fill: '#000' });
    },

    riceCaught: function(bowl, rice){
        console.log("Collision detected");
        this.dish.body.y = 555;
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

        //for (var i = 0; i < 250; i++) {

        //}
        //this.createRice();

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
        this.dish = this.game.add.sprite(350, 555, 'dish');
        this.game.physics.p2.enable([this.dish], true); // false
        this.dish.body.clearShapes(); // Get rid of current bounding box
        this.dish.body.loadPolygon("sprite_physics", "dish"); // // Add our PhysicsEditor bounding shape
        this.dish.body.setCollisionGroup(this.dishCollisionGroup);
        this.dish.body.setZeroDamping(); //  Modify a few body properties
        this.dish.body.data.gravityScale = 0;
        //this.dish.body.fixedRotation = true; // fixedRotation = true --> dish is fix
        this.dish.body.allowGravity = 0;
        this.dish.body.immovable = true;
        //this.dish.body.collideWorldBounds = true;
        this.dish.body.collides(this.riceCollisionGroup, this.riceCaught, this);

        //this.dish.body.setMaterial(spriteMaterial);
        //this.dish.physicsBodyType = Phaser.Physics.P2JS;
        //this.dish.enableBody = true;
        //this.dish.body.onBeginContact.add(blockHit, this.rice);
    },
    createRice: function () {
        //this.rices.enableBody = true;
        //this.rices.physicsBodyType = Phaser.Physics.P2JS;

        //rices.createMultiple(250, 'gain', 0, false);

        //var position_x = this.game.rnd.integerInRange(5,595);

        this.rice = this.game.add.sprite(this.game.world.randomX,0, 'grain');
        this.game.physics.p2.enable([this.rice], true); // false
        this.rice.body.clearShapes(); // Get rid of current bounding box
        this.rice.body.loadPolygon("sprite_physics", "grain"); // // Add our PhysicsEditor bounding shape
        this.rice.body.setCollisionGroup(this.riceCollisionGroup);
        this.rice.body.data.gravityScale = 0.1;

        //collide with both groups, but do nothing
        this.rice.frame = this.game.rnd.integerInRange(0,6);
        this.rice.body.collides([this.dishCollisionGroup, this.riceCollisionGroup]);
        this.rices.add(this.rice);
        this.rice.play();
    },
    createFloor: function () {
        /*this.floor = this.game.add.sprite(0, 590, 'floor');
        this.game.physics.p2.enable([this.floor], true); // false
        this.floor.body.data.gravityScale = 0;
        this.floor.body.fixedRotation = true; // fixedRotation = true --> dish is fix
        this.floor.body.allowGravity = 0;
        this.floor.body.setCollisionGroup(this.floorCollisionGroup);
        this.floor.body.collideWorldBounds = true;*/

        this.floor = new Phaser.Rectangle(0, 595, 800, 5);
        this.game.physics.p2.enable([this.floor], true); // false
        this.floor.enableBody = true;
    }
}
