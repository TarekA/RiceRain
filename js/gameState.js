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
    this.dishMaterial;
    this.dishHeight;
    this.points;
    this.printPoints;
    this.table;
    this.grain;
}

gameState.prototype = {

   /* fire: function() {

        var rice = this.rices.getFirstExists(false);

        if (rice)
        {
            rice.frame = this.game.rnd.integerInRange(0,6);
            rice.exists = true;
            rice.reset(this.game.world.randomX, 0);
            //rice.body.bounce.y = 0.8;
        }

    },*/

    create: function() {

        var speedbar_config = {x: 650, y: 30, speed: 100};
        this.speedbar = new SpeedBar(this.game, speedbar_config);
        this.speedbar.setPercent(50);

        this.rice_audio = game.add.audio('rice');
        //this.rice.play();

        //this.load.setPreloadSprite(this.speedbar);
        //this.speedbar.anchor.setTo(0,0);
        //this.game.add.existing(this.speedbar);

        //this.game.add(this.speedbar);


        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.defaultRestitution = 0;
        this.game.physics.p2.gravity.y = 400;
        this.game.physics.p2.restitution = 0;
        this.game.physics.p2.setImpactEvents(true);

        this.fairy = new Fairy(this, this.game, 10, 10, 500, 150, 100);

        //Resize Fairy:
        //this.fairy.anchor.setTo(0, 0);
        //this.fairy.scale.setTo(2, 2);

        this.game.add.existing(this.fairy);
        
        this.fairy.animations.add('fly');
        this.fairy.animations.play('fly', 30, true);

        this.game.stage.backgroundColor = '#fff';
        //var spriteMaterial = this.game.physics.p2.createMaterial('spriteMaterial');
        //var worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
        //var contactMaterial = this.game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial, { restitution: 1.0 })

        //this.game.physics.p2.setWorldMaterial(worldMaterial);

        this.game.stage.backgroundColor = '#f9f9f9';

        this.riceCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.dishCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.floorCollisionGroup = this.game.physics.p2.createCollisionGroup();

        this.game.physics.p2.updateBoundsCollisionGroup(); // borders

        this.createFloor();
        this.createDish();

        this.dishMaterial = game.physics.p2.createMaterial('dishMaterial', this.dish.body);

        this.rices = this.game.add.group();

        //this.game.time.events.loop(Phaser.Timer.SECOND, this.createRice(), this);
        //this.game.time.events.repeat(Phaser.Timer.SECOND, 100, this.createRice, this); // 100mal

        // this.game.physics.p2.updateBoundsCollisionGroup();
        this.game.physics.p2.gravity.y = 300;
        this.game.physics.p2.enable(this.rices);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        //this.game.time.events.loop(150, this.fire, this);
        //this.game.time.events.repeat((Phaser.Timer.SECOND*5), 100, this.createFairy, this);
        this.game.add.text(16, 16, 'Left / Right to move', { font: '18px Arial', fill: '#000' });
        this.printPoints = this.game.add.text(200,16, 0, {font: '24px Arial', fill: '#FF0000'});
    },

    riceCaught: function(bowl, rice){
        console.log("Collision detected");
        this.dish.body.y = 545;
        //this.dish.body.velocity.y = 0;
       // this.dish.addChild(bowl);
        rice.data.gravityScale = 3.0;
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
        this.calculateRice();
        this.printPoints.setText(this.points);
    },

    checkBounds: function (rice) {
        //console.log("checkBounds");
        if (rice.y > 800)
        {
            rice.kill();
        }

        /*if(rice.x < 10) {
            rice.kill();
        }

        if(rice.x > 790) {
            rice.kill();
        }*/

    },

    render: function() {
        this.game.debug.geom(this.floor,'#8B4513');
    },
    createDish: function () {
        this.dish = this.game.add.sprite(350, 545, 'dish');
        this.game.physics.p2.enable([this.dish], true); // false
        this.dish.body.clearShapes(); // Get rid of current bounding box
        this.dish.body.loadPolygon("sprite_physics", "ricedish"); // // Add our PhysicsEditor bounding shape
        this.dish.body.setCollisionGroup(this.dishCollisionGroup);
        this.dish.body.setZeroDamping(); //  Modify a few body properties
        this.dish.body.data.gravityScale = 1.5;
        //this.dish.body.fixedRotation = true; // fixedRotation = true --> dish is fix
        this.dish.body.allowGravity = 10;
        this.dish.body.immovable = true;
        this.dish.angle = 40;

        //this.dish.body.collideWorldBounds = true;
        this.dish.body.collides(this.riceCollisionGroup, this.riceCaught, this);
        this.dishHeight = this.dish.height;

        //this.dish.body.setMaterial(spriteMaterial);
        //this.dish.physicsBodyType = Phaser.Physics.P2JS;
        //this.dish.enableBody = true;
        //this.dish.body.onBeginContact.add(blockHit, this.rice);
    },
    createRice: function (appear_x, appear_y) {
        //this.rices.enableBody = true;
        //this.rices.physicsBodyType = Phaser.Physics.P2JS;

        //rices.createMultiple(250, 'gain', 0, false);

        //var position_x = this.game.rnd.integerInRange(5,595);

        this.rice = this.game.add.sprite(appear_x, appear_y, 'grain');
        this.game.physics.p2.enable([this.rice], true); // false
        this.rice.body.clearShapes(); // Get rid of current bounding box
        this.rice.body.loadPolygon("sprite_physics", "grain"); // // Add our PhysicsEditor bounding shape
        this.rice.body.setCollisionGroup(this.riceCollisionGroup);
        this.rice.body.data.gravityScale = 1.5;
        //this.rice.body.gravity.y = 300;
        //this.rice.body.gravity.x = 600000;
        //collide with both groups, but do nothing
        //this.rice.frame = this.game.rnd.integerInRange(0,6);
        this.rice.body.collides([this.dishCollisionGroup, this.riceCollisionGroup]);

        var riceMaterial = game.physics.p2.createMaterial('riceMaterial', this.rice.body);
        var contactMaterial = game.physics.p2.createContactMaterial(riceMaterial, this.dishMaterial);

        contactMaterial.friction = 0;     // Friction to use in the contact of these two materials.
        contactMaterial.restitution = 0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
        contactMaterial.stiffness = 999;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
        contactMaterial.relaxation = 15;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
        contactMaterial.frictionStiffness = 10;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
        contactMaterial.frictionRelaxation = 100;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
        contactMaterial.surfaceVelocity = 1;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

        this.rice.frame = this.game.rnd.integerInRange(0,6);
        this.rice.body.collides([this.dishCollisionGroup, this.riceCollisionGroup]);
        this.rices.add(this.rice);
        this.rice_audio.play();
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
    },

    calculateRice: function() {
        var centerX = this.dish.x
        var centerY = this.dish.y;
        var radius = this.dishHeight;
        this.points = 0;

        this.rices.forEachExists(this.checkInsideDish, this, centerX, centerY, radius);

    },

    checkInsideDish: function(rice, centerX, centerY, radius){
        var x = rice.x;
        var y = rice.y;
        if((x - centerX)*(x - centerX) + (y - centerY)*(y - centerY) < radius*radius){
            if(y > centerY){
                this.points++;
            }
        }
    },
    createFloor: function(){
        this.floor = new Phaser.Rectangle(0, 595, 800, 5); // pos x, posY, width, height
        this.game.physics.p2.enable([this.floor], true); // false - true zeigt den Debugger an
        this.floor.enableBody = true;
        //this.floor.body.setCollisionGroup(this.floorCollisionGroup);
    },
    createRice2: function(){
        console.log('rice');
        new Rice(this.game, this.position.x, this.position.y);
    },

    createFairy: function(){
        
        var appear_x = Math.random()*200;
        var disappear_x = Math.random()*200;

         if(Math.random()>0.5){
             this.fairy = new Fairy(this, this.game, appear_x, Math.random()*200, 600+disappear_x , 10+Math.random()*200, 100);
             this.game.add.existing(this.fairy);
         } else {
             this.fairy = new Fairy(this, this.game, 600+appear_x, Math.random()*200, disappear_x , 10+Math.random()*200, 100);
             this.game.add.existing(this.fairy);

         }
    },

}
