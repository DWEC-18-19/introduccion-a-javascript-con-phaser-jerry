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

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();

  //Coins
  createItem(375, 300, 'coin');
  createItem(750, 30, 'coin');
  createItem(75, 30, 'coin');
  createItem(275, 300, 'coin');
  createItem(50, 150, 'coin');
  createItem(175, 300, 'coin');
  createItem(540, 200, 'coin');
  createItem(720, 100, 'coin');
  createItem(30, 400, 'coin');
  createItem(290, 500, 'coin');

  //Star
  createItem(125, 50, 'star');

  //Poison
  createItem(370, 500, 'poison');
  createItem(100, 375, 'poison');

}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(450, 450, 'platform');
  platforms.create(550, 350, 'platform');
  platforms.create(550, 100, 'platform');
  platforms.create(50, 150, 'platform2');
  platforms.create(200, 250, 'platform2');
  platforms.create(50, 350, 'platform2');
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
  var badge = badges.create(750, 400, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {
  item.kill();
  if( item.key === 'coin'){
    currentScore = currentScore + 10;
    if (currentScore === WINNINGSCORE) {
        createBadge();
    }
  }else if( item.key === 'poison' ){
    if( --lives == 0 ){
      winningMessage.text = "YOU LOSE!!!";
      end = true;
      items.removeAll();
    }
  }else if( item.key === 'star' ){
    lives++;
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
  player.body.x = 50;
  player.body.y = 600;
  addItems();
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
  
  // before the game begins
  function preload() {
    //Background
    game.load.image('background','Full Moon - background.png');
    
    //Load images
    game.load.image('platform', 'platform_1.png');
    game.load.image('platform2', 'platform_2.png');
    
    //Load spritesheets
    //game.load.spritesheet('player', 'chalkers.png', 48, 62);
    game.load.spritesheet('player', 'mikethefrog.png', 32, 32);
    game.load.spritesheet('coin', 'coin.png', 36, 44);
    game.load.spritesheet('badge', 'badge.png', 42, 54);
    game.load.spritesheet('star', 'star.png', 32 , 32);
    game.load.spritesheet('poison', 'poison.png', 32 , 32);
  }

  // initial game set up
  function create() {
    //Background load
    game.add.tileSprite(0, 0, 800 , 600, 'background');

    //Player creation
    player = game.add.sprite(50, 600, 'player');
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
    livesLabel = game.add.text(650, 0, "LIVES: " + lives, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
    restartMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    restartMessage.anchor.setTo(0.5, 2);
    
  }

  // while the game is running
  function update() {
    scoreLabel.text = "SCORE: " + currentScore;
    livesLabel.text = "\nLIVES: " + lives;
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
      //is the up cursosr key pressed?
      else if (cursors.up.isDown && (player.body.onFloor() || player.body.touching.down)){
        player.body.velocity.y = -400;
      }
      // player doesn't move
      else {
        player.animations.stop();
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
