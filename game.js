//define constant values
var WINNINGSCORE = 100 , INILIVES = 2;

// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var scoreLabel, livesLabel ;
var winningMessage , restartMessage;
var lives = INILIVES;
var won = false;
var end = true;
var currentScore = 0;
var level = 0;

//Config Array
var config = {
  'imagesPath' : 'Images/',
  'preload' : {
    'images' : [
      { 'key' : 'background' , 'name' : 'Full Moon - background.png' },
      { 'key' : 'platform' , 'name' : 'platform_1.png' },
      { 'key' : 'platform2' , 'name' : 'platform_2.png' }
    ],
    'spritesheets' : [
      { 'key' : 'chalkers' , 'name' : 'chalkers.png' , 'width' : 48 , 'height' : 62  },
      { 'key' : 'mikethefrog' , 'name' : 'mikethefrog.png' , 'width' : 32 , 'height' : 32  },
      { 'key' : 'skeleton' , 'name' : 'skeleton.png' , 'width' : 32 , 'height' : 32  },
      { 'key' : 'coin' , 'name' : 'coin.png' , 'width' : 36 , 'height' : 44  },
      { 'key' : 'badge' , 'name' : 'badge.png' , 'width' : 42 , 'height' : 54  },
      { 'key' : 'badge_2' , 'name' : 'badge_2.png' , 'width' : 42 , 'height' : 54  },
      { 'key' : 'badge_3' , 'name' : 'badge_3.png' , 'width' : 42 , 'height' : 54  },
      { 'key' : 'star' , 'name' : 'star.png' , 'width' : 32 , 'height' : 32  },
      { 'key' : 'poison' , 'name' : 'poison.png' , 'width' : 32 , 'height' : 32  }
    ]
  },
  'levels' : [
              {
                'player' : { 'key' : 'skeleton' , 'X' : 50 , 'Y' : 600 },
                'items' : [
                  { 'type' : 'coin' , 'X' : 375 , 'Y' : 300 },
                  { 'type' : 'coin' , 'X' : 750 , 'Y' : 30 },
                  { 'type' : 'coin' , 'X' : 75 , 'Y' : 30 },
                  { 'type' : 'coin' , 'X' : 640 , 'Y' : 450 },
                  { 'type' : 'coin' , 'X' : 50 , 'Y' : 200 },
                  { 'type' : 'coin' , 'X' : 175 , 'Y' : 300 },
                  { 'type' : 'coin' , 'X' : 500 , 'Y' : 100 },
                  { 'type' : 'coin' , 'X' : 720 , 'Y' : 150 },
                  { 'type' : 'coin' , 'X' : 70 , 'Y' : 400 },
                  { 'type' : 'coin' , 'X' : 290 , 'Y' : 500 },
                  { 'type' : 'star' , 'X' : 125 , 'Y' : 50 },
                  { 'type' : 'poison' , 'X' : 370 , 'Y' : 500 },
                  { 'type' : 'poison' , 'X' : 100 , 'Y' : 375 }
                ],
                'platforms' : [
                  { 'type' : 'platform' , 'X' : 450 , 'Y' : 450 },
                  { 'type' : 'platform' , 'X' : 550 , 'Y' : 350 },
                  { 'type' : 'platform' , 'X' : 550 , 'Y' : 100 },
                  { 'type' : 'platform2' , 'X' : 50 , 'Y' : 150 },
                  { 'type' : 'platform2' , 'X' : 200 , 'Y' : 250 },
                  { 'type' : 'platform2' , 'X' : 50 , 'Y' : 350 }
                ],
                'interaction' : [
                  { 'key' : 'coin' , 'point' : 10 , 'live' : 0  },
                  { 'key' : 'star' , 'point' : 20 , 'live' : 1 },
                  { 'key' : 'poison' , 'point' : -10 , 'live' : -1 },
                  { 'key' : 'badge' , 'point' : 100 , 'live' : 1 }
                ],
                'badge' : { 'type' : 'badge' , 'X' : 750, 'Y' : 400 } 
              }
            ]
};

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  config.levels[level].items.forEach( item => createItem( item.X , item.Y , item.type ) );
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  config.levels[level].platforms.forEach( platform => platforms.create( platform.X , platform.Y , platform.type ) );
  platforms.setAll('body.immovable', true);
}

// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create( config.levels[level].badge.X , config.levels[level].badge.Y , config.levels[level].badge.type );
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {
  addInteraction(item);
  if (currentScore === WINNINGSCORE)  createBadge();
  if( lives == 0 ){
    winningMessage.text = "YOU LOSE!!!";
    end = true;
    items.removeAll();
  }
}

//Funcion para generar datos iniciales
function restartGame(){
  winningMessage.text = "";
  restartMessage.text = "";
  end = false;
  won = false;
  lives = INILIVES;
  currentScore = 0;

  //Player
  player.body.x = config.levels[level].player.X;
  player.body.y = config.levels[level].player.Y;
  addItems();
}

function addInteraction( I_object ){
  Interaction_type = config.levels[level].interaction.find( function( element ){ return element.key === I_object.key } );
  I_object.kill();
  currentScore += Interaction_type.point;
  lives += Interaction_type.live;
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  addInteraction(badge);
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
  
  // before the game begins
  function preload() {

    //load images from config
    config.preload.images.forEach( img => game.load.image( img.key , config.imagesPath + img.name ) );

    //Load spritesheets
    config.preload.spritesheets.forEach( spritesheet => game.load.spritesheet( spritesheet.key , config.imagesPath + spritesheet.name , spritesheet.width , spritesheet.height ) );
  }

  // initial game set up
  function create() {
    //Background load
    game.add.tileSprite(0, 0, 800 , 600, 'background');

    //Player creation
    player = game.add.sprite( config.levels[level].player.X , config.levels[level].player.Y ,  config.levels[level].player.key );
    player.animations.add('walk');
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 400;

    //addItems();
    addPlatforms();

    //Keys
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //Labels
    scoreLabel = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
    livesLabel = game.add.text(650, 16, "LIVES: " + lives, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
    restartMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    restartMessage.anchor.setTo(0.5, 2);
    
  }

  // while the game is running
  function update() {
    scoreLabel.text = "SCORE: " + currentScore;
    livesLabel.text = "LIVES: " + lives;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    if( !end ){

      // is the left cursor key presssed?
      if (cursors.left.isDown) {
        player.animations.play('walk', 10, true);
        player.body.velocity.x = -300;
        player.scale.x = - 1;
      }
      // is the right cursor key pressed?
      else if (cursors.right.isDown) {
        player.animations.play('walk', 10, true);
        player.body.velocity.x = 300;
        player.scale.x = 1;
      }
      // player doesn't move
      else {
        player.animations.stop();
      }
      
      //is the up cursosr key pressed?
      if (cursors.up.isDown && (player.body.onFloor() || player.body.touching.down)){
        player.body.velocity.y = -400;
      }

      // when the player winw the game
      if (won) {
        winningMessage.text = "YOU WIN!!!";
        items.removeAll();
        end = true;
      }
    }else{
      if( restartMessage.text === "" )
          restartMessage.text = "Press Space Key To Start";
      if( jumpButton.isDown ){
        restartGame();
      }
    }
  }

  function render() {

  }

};
