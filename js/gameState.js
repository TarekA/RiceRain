var gameState = function(game){
    console.log("Hello");
    this.cursors;
    this.floor;
    this.dish;
    this.riceCollisionGroup;
    this.riceBadCollisionGroup;
    this.dishCollisionGroup;
    this.fairy;
    this.rices;
    this.bombs;
    this.rice;
    this.dishMaterial;
    this.points;
    this.printPoints;
    this.dish_speed;
    this.radius;
    this.dropCounter;
    this.background_music;
    this.finish;
    this.riceInBowl;
    this.update_rice;
    this.goal = 25;
    this.explosion;
    this.with_bomb;
}

gameState.prototype = {
    
    init: function(with_bomb){
        this.with_bomb = with_bomb;
        console.log(this.with_bomb);
    },
    create: function() {
        
        this.background = this.game.add.sprite(game.world.centerX, game.world.centerY, 'background-main').anchor.set(0.5);
        this.finish = false;
        this.update_rice = 0;
        this.riceInBowl = new Array();
        var speedbar_config = {x: 650, y: 5, goal: 25};
        this.speedbar = new SpeedBar(this.game, speedbar_config);


        // ADD SOUND
        this.rice_audio = game.add.audio('rice');
        this.rice_audio.volume = 0.3;
        this.background_music = new Phaser.Sound(game,'background_music',1,true);
        this.background_music.play();
        this.bomb_audio = game.add.audio('bomb');

        this.dish_speed = 350;
        this.points = 0;

        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.defaultRestitution = 0;
        this.game.physics.p2.gravity.y = 400;
        this.game.physics.p2.restitution = 0;
        this.game.physics.p2.setImpactEvents(true);

        this.dropCounter = 100;
        this.fairy = new Fairy(this, this.game, 10, 10, 500, 150, 100);


        this.game.add.existing(this.fairy);

        this.game.stage.backgroundColor = '#f9f9f9';

        this.riceCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.riceBadCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.dishCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.floorCollisionGroup = this.game.physics.p2.createCollisionGroup();

        this.game.physics.p2.updateBoundsCollisionGroup(); // borders

        this.createFloor();
        this.createDish();

        this.dishMaterial = game.physics.p2.createMaterial('dishMaterial', this.dish.body);

        this.rices = this.game.add.group();
        this.bombs = this.game.add.group();

        this.game.physics.p2.gravity.y = 300;
        this.game.physics.p2.enable(this.rices);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.add.text(16, 16, 'Left / Right to move', { font: '18px Arial', fill: '#000' });
        this.printPoints = this.game.add.text(200,16, 0, {font: '24px Arial', fill: '#FF0000'});
        this.printDropCounter = this.game.add.text(240,16, this.dropCounter, {font: '24px Arial', fill: '#00FF00'});
    },

    riceCaught: function(bowl, rice){
        //console.log("Collision detected");

        console.log("Collision detected");
        this.dish.body.y = 545;
        rice.data.gravityScale = 3.0;
        if(!rice.sprite.sound_played) {
            if (this.checkInsideDish(rice.sprite, this.dish.x, this.dish.y)) {
                this.rice_audio.play();
                rice.sprite.sound_played = true;
            }
        }
        console.log(rice.sprite.sound_played);
    },

    riceCaughtOnRice: function(rice1, rice2){
        rice1.data.gravityScale = 3.0;
        if(!rice1.sprite.sound_played){
            if (this.checkInsideDish(rice1.sprite, this.dish.x, this.dish.y)) {
                this.rice_audio.play();
                rice1.sprite.sound_played = true;
            }
        }

        rice2.data.gravityScale = 3.0;
        if(!rice2.sprite.sound_played){
            if (this.checkInsideDish(rice2.sprite, this.dish.x, this.dish.y)) {
                this.rice_audio.play();
                rice2.sprite.sound_played = true;
            }
        }
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

        this.dish_speed = 400 - (400 * (this.points)) / 100;
        console.log(this.dish_speed);


        if (this.cursors.left.isDown)
        {
            //this.dish.body.velocity.x = -400;
            this.dish.body.moveLeft(this.dish_speed);
        }
        else if (this.cursors.right.isDown)
        {
            //this.dish.body.velocity.x = 400;
            this.dish.body.moveRight(this.dish_speed);
        }


        this.rices.forEachAlive(this.checkBounds, this);
        this.bombs.forEachAlive(this.checkBombBounds, this);
        this.update_rice++;
        if(this.update_rice == 30){
            this.update_rice = 0;
            this.calculateRice();
        }
        this.printPoints.setText(this.points);
        this.speedbar.setPercent(this.points);
        //this.current_points = this.points;

        if (this.points == 20 || this.dropCounter == 0) {
            this.finish = true;
            this.background_music.stop();
            game.state.start("GameOverScreen", false, false, this.points);
        }
        this.printDropCounter.setText(this.dropCounter)
    },

    checkBounds: function (rice) {
        //console.log("checkBounds");
        if (rice.y > 800)
        {
            rice.kill();
        }
    },

    checkBombBounds: function (bomb) {
        if(bomb.y > 592)
        {
            this.bomb_audio.volume = 0.3;
            this.bomb_audio.play();
            bomb.kill();
        }
    },

    render: function() {
        this.game.debug.geom(this.floor,'#8B4513');
    },
    createDish: function () {
        this.dish = this.game.add.sprite(350, 545, 'dish');
        this.game.physics.p2.enable([this.dish], false); // false
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
        this.dish.body.collides([this.riceCollisionGroup, this.riceBadCollisionGroup], this.riceCaught, this);
        this.radius=75;

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
        var isBomb = false;
        if(this.with_bomb){
            var bad_rice_random = game.rnd.integerInRange(1, 10);
            if(bad_rice_random == 5)
            {
                isBomb = true;
            }
        }


        if(isBomb)
        {
            this.bomb = this.game.add.sprite(appear_x, appear_y, 'bomb-big');
            this.game.physics.p2.enable([this.bomb], false); // false
            this.bomb.body.clearShapes(); // Get rid of current bounding box
            this.bomb.body.loadPolygon("sprite_physics", "bomb-big"); // // Add our PhysicsEditor bounding shape
            this.bomb.body.gravity.y = 600000;
            this.bomb.body.gravity.x = 600000;
            this.bomb.body.data.gravityScale = 1.5;
            //this.rice.body.gravity.y = 300;
            //this.rice.body.gravity.x = 600000;
            //collide with both groups, but do nothing
            //this.rice.frame = this.game.rnd.integerInRange(0,6);
            this.bomb.sound_played = false;
            //var riceMaterial = game.physics.p2.createMaterial('riceMaterial', this.bomb.body);
            // var contactMaterial = game.physics.p2.createContactMaterial(riceMaterial, this.dishMaterial);
            //
            // contactMaterial.friction = 0;     // Friction to use in the contact of these two materials.
            // contactMaterial.restitution = 0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
            // contactMaterial.stiffness = 999;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
            // contactMaterial.relaxation = 15;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
            // contactMaterial.frictionStiffness = 10;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
            // contactMaterial.frictionRelaxation = 100;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
            // contactMaterial.surfaceVelocity = 1;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

            this.bomb.frame = this.game.rnd.integerInRange(0,6);
            this.bomb.body.setCollisionGroup(this.riceBadCollisionGroup);
            //this.rice.body.collides([this.dishCollisionGroup]);
            this.bomb.body.collides([this.dishCollisionGroup, this.riceCollisionGroup], this.riceBadCaughtOnDish, this);
            //this.rice.body.collides([, this.riceBadCollisionGroup], this.riceBadCaughtOnRice, this);
            this.bombs.add(this.bomb);
        }
        else{
            this.rice = this.game.add.sprite(appear_x, appear_y, 'grain');
            this.game.physics.p2.enable([this.rice], false); // false
            this.rice.body.clearShapes(); // Get rid of current bounding box
            this.rice.body.loadPolygon("sprite_physics", "grain");
            this.rice.body.data.gravityScale = 1.5;
            //this.rice.body.gravity.y = 300;
            //this.rice.body.gravity.x = 600000;
            //collide with both groups, but do nothing
            //this.rice.frame = this.game.rnd.integerInRange(0,6);
            this.rice.sound_played = false;
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
            this.rice.body.setCollisionGroup(this.riceCollisionGroup);
            this.rice.body.collides([this.dishCollisionGroup]);
            this.rice.body.collides([this.riceCollisionGroup], this.riceCaughtOnRice, this);
            //this.rice.body.collides([this.riceBadCollisionGroup], this.riceBadCaughtOnRice, this);
            this.rices.add(this.rice);
        }



        //this.rice_audio.play();
    },
    riceBadCaughtOnDish: function (bomb, dish) {
        console.log("riceBadCaughtOnDish!!!!!!!!!");

        this.bomb_audio.volume = 0.3;
        this.bomb_audio.play();

        try {
            console.log("bomb");
            bomb.sprite.sound_played = true;

            console.log("explosion")
            this.explosion = this.game.add.sprite(bomb.sprite.x-50, bomb.sprite.y-50, 'explosion');
            var explode = this.explosion.animations.add('explode');
            this.explosion.animations.play('explode', 81, false);
            bomb.sprite.kill();
        }
        catch (err){

        }

        for(var i = 0; i<this.riceInBowl.length; i++){
            var rice = this.riceInBowl[i];
            rice.kill();
        }


    },
    riceBadCaughtOnRice: function (bomb, rise) {
        console.log("riceBadCaughtOnDish!!!!!!!!!----------!!!!!!!");
        bomb.sprite.kill();
        rise.sprite.kill();

    },

    calculateRice: function() {
        var centerX = this.dish.x
        var centerY = this.dish.y;
        var radius = 75;
        this.points = 0;
        this.riceInBowl = new Array();

        this.rices.forEachExists(this.checkInsideDish, this, centerX, centerY);

    },

    checkInsideDish: function(rice, centerX, centerY){
        var width = 60;
        var height = 55;
        var x = Math.pow(rice.x - centerX, 2)/Math.pow(width,2);
        var y = Math.pow(rice.y - centerY, 2)/Math.pow(height,2);
        if(x+y < 1){
            this.points++;
            this.riceInBowl.push(rice);
            return true;
        }
        return false;
    },
    createFloor: function(){
        this.floor = new Phaser.Rectangle(0, 595, 800, 5); // pos x, posY, width, height
        this.game.physics.p2.enable([this.floor], false); // false - true zeigt den Debugger an
        this.floor.enableBody = true;
        //this.floor.body.setCollisionGroup(this.floorCollisionGroup);
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
    }
}
