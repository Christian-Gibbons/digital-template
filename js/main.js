window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
	    
	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {

	    game.load.image('sky', 'assets/sky.png');
	    game.load.image('ground', 'assets/platform.png');
		game.load.image('hydrant', 'assets/hydrant.png');
		game.load.image('hydrant2', 'assets/hydrant2.png');
		game.load.spritesheet('guy', 'assets/John_Sheet.png', 37, 48); 
	    game.load.spritesheet('dog', 'assets/dog_brown_0.png', 46, 27);

	}

	var player;
	var platforms;
	var cursors;
	var jumpButton;

	var catcher;
	var hydrants;
	var hydrants2;
	var score = 0;
	var scoreText;

	function create() {

	    //  We're going to be using physics, so enable the Arcade Physics system
	    game.physics.startSystem(Phaser.Physics.ARCADE);

	    //  A simple background for our game
	    game.add.sprite(0, 0, 'sky');
		
	    //  The platforms group contains the ground and the 2 ledges we can jump on
	    platforms = game.add.group();

	    //  We will enable physics for any object that is created in this group
	    platforms.enableBody = true;

	    // Here we create the ground.
	    var ground = platforms.create(0, game.world.height - 64, 'ground');

	    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
	    ground.scale.setTo(2, 2);

	    //  This stops it from falling away when you jump on it
	    ground.body.immovable = true;

	    //  Now let's create two ledges
	    var ledge = platforms.create(400, 400, 'ground');
	    ledge.body.immovable = true;

	    ledge = platforms.create(-150, 250, 'ground');
	    ledge.body.immovable = true;

		// Add fire hydrants to pee on.
		hydrants2 = game.add.group();
		hydrants2.enableBody = false;
		var hydrant2;

		hydrants = game.add.group();
		hydrants.enableBody = true;
		var hydrant;

		var arrHydrantx = [20,120,420,550,770,50,200,330,400,620,730];
		var arrHydranty = [228,228,378,378,378,514,514,514,514,514,514];
		for(var i =0; i<arrHydrantx.length; i++){
			hydrant2 = hydrants2.create(arrHydrantx[i],arrHydranty[i], 'hydrant2');
			hydrant = hydrants.create(arrHydrantx[i],arrHydranty[i], 'hydrant');
		}


	    // The player and its settings
	    player = game.add.sprite(32, game.world.height - 100, 'dog');
		player.anchor.setTo(0.5,0.5);
	    //  We need to enable physics on the player
	    game.physics.arcade.enable(player);

	    //  Player physics properties. Give the little guy a slight bounce.
	    player.body.bounce.y = 0.0;
	    player.body.gravity.y = 800;
	    player.body.collideWorldBounds = true;

	    //  Our two animations, walking and peeing.
	    player.animations.add('walk', [0, 1, 2], 10, true);
		player.animations.add('piss', [6, 7], 10, true);

		catcher = game.add.sprite(700, 350, 'guy');
		catcher.anchor.setTo(0.5,0.5);
		game.physics.arcade.enable(catcher);
		catcher.body.bounce.y = 0.0;
		catcher.body.gravity.y = 500;
		catcher.body.collideWorldBounds = false;
		catcher.outOfBoundsKill = true;
		catcher.animations.add('walk', [1,2,3], 10, true);

/*
		var catchers = game.add.group();
		catchers.enableBody = true;
		game.physics.arcace.enable(catchers);
		catchers.anchor.setTo(0.5,0.5);
		catchers.body.gravity.y = 500;
		catchers.body.bounce.y = 0.0;
		catchers.collideWorldBounds = false;
		catchers.outOfBoundsKill = true;
		catchers.animations.add('walk', [1,2,3], 10, true);
		var arrCatchx = [400, 600];
		var arrCatchy = [game.world.height - 100, 700];
		for(var i=0; i<arrCatchx.length; i++){
			catcher = catchers.create(arrCatchx[i], arrCatchy[i], 'guy');
		}
*/
	    //  The score
	    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

	    //  Our controls.
	    cursors = game.input.keyboard.createCursorKeys();
	    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	}

	function update() {

	    //  Collide the player and the stars with the platforms
	    game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(catcher, platforms);
	    //  Reset the players velocity (movement)
	    player.body.velocity.x = 0;


		
		catcher.body.velocity.x = -100;
		catcher.scale.x = -1;
		catcher.animations.play('walk');

		game.physics.arcade.overlap(player, catcher, killPlayer, null, this);
	    if (cursors.left.isDown)
	    {
			//  Move to the left
			player.body.velocity.x = -150;

			player.scale.x = 1;
			if(player.body.touching.down){
				player.animations.play('walk');
			}
			else{
				player.animations.stop();
				player.frame = 0; 
			}
	    }
	    else if (cursors.right.isDown)
	    {
			//  Move to the right
			player.body.velocity.x = 150;

			player.scale.x = -1;
			if(player.body.touching.down){
				player.animations.play('walk');
			}
			else{
				player.animations.stop();
				player.frame = 0; 
			}
	    }
	    //  Allow the player to piss if they are touching the ground and stationary.
	    else if (cursors.up.isDown && player.body.touching.down)
	    {
			player.animations.play('piss');

			game.physics.arcade.overlap(player, hydrants, peeHydrant, null, this);
	    }
	    else
	    {
			//  Stand still
			player.animations.stop();

			player.frame = 5; 
	    }

		// Allow player to jump if they are touching the ground.
	    if (jumpButton.isDown && player.body.touching.down)
	    {
			player.body.velocity.y = -600;
	    }	    


	}

	function peeHydrant (player, hydrant) {
		hydrant.kill();
		score += 100;
		scoreText.text = 'Score: ' + score;
	}

	function killPlayer (player, catcher) {
		player.kill();
		scoreText.text = 'Score: ' + score + '            GAME OVER';
	}
};
