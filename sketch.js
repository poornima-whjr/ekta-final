var START = 2;
var PLAY = 1;
var END = 0;

var submarine;
var submarineImg;
var sea;
var invBg;
var gameState = 2;
var obstacleGroup;
var start, startImg;
var play, playImg;
var gameOver, gameOverImg;

var sonar, theme;
var jumpSound;

var diverImg, whaleImg;
var score = 0;


var wall;


function preload() {
  submarineImg = loadImage("images/sub.png")
  seaImg = loadImage("images/bg.png");
  diverImg = loadImage("images/obs2.png");
  whaleImg = loadImage("images/obs1.png");
  startImg = loadImage("images/1120358.jpg");
  playImg = loadImage("images/Play.png");
  gameOverImg = loadImage("images/over.png")
  sonar = loadSound("sounds/sonar.mp3");
  theme = loadSound("sounds/theme.mp3")
  jumpSound = loadSound("sounds/jump.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  sea = createSprite(500, windowHeight / 2, 10, 10);
  sea.addImage(seaImg);
  start = createSprite(windowWidth / 2, windowHeight / 1.9, 20, 20);
  start.addImage(startImg);

  gameOver = createSprite(windowWidth / 2, windowHeight / 2, 10, 10);
  gameOver.addImage(gameOverImg);

  play = createSprite(windowWidth / 2, windowHeight / 1.25, 20, 20);
  play.addImage(playImg);
  play.scale = 0.5;

  submarine = createSprite(windowWidth / 6, windowHeight / 2, 5, 5);
  submarine.addImage(submarineImg);

  submarine.scale = 1.5;
  invBg = createSprite(windowWidth / 2, windowHeight, windowWidth, 20);

  wall = createSprite(-150, height / 2, 10, height)

  obstacleGroup = new Group();

  theme.setVolume(0.1);




  submarine.setCollider("rectangle", 0, 20, 300, 70)
  submarine.debug = false;
}

function draw() {

  if (gameState === START) {
    start.visible = true;
    play.visible = true;
    submarine.visible = false;
    sea.visible = false;
    gameOver.visible = false;
    submarine.y = windowHeight / 2;
    if (mousePressedOver(play)) {
      theme.loop()
      gameState = PLAY;
    }
  }


  if (gameState === PLAY) {
    start.visible = false;
    play.visible = false;
    submarine.visible = true;
    sea.visible = true;

    sea.velocityX = -20;

    if (sea.x < 0) {

      sea.x = sea.width / 2;
    }


    if (keyWentDown("up")) {
      submarine.velocityY = -10;
    }
    if (keyWentUp("up")) {
      submarine.velocityY = 0;

    }
    if (keyWentUp("down")) {
      submarine.velocityY = 0;
    }
    if (keyWentDown("down")) {
      submarine.velocityY = 10;
    }
    invBg.visible = false;

    obstacles();



   /* for (var i = 0; i < obstacleGroup.length; i++) {

      if (obstacleGroup.get(i).x < 50 && obstacleGroup.get(i).x > 0) {
      
          sonar.play();
       

      }
      
    }*/


    obstacleGroup.overlap(wall, increaseScore)



    if (submarine.isTouching(obstacleGroup)) {
      theme.stop()
      gameState = END;
    }


  }


  if (gameState === END) {
    sea.velocityX = 0;
    obstacleGroup.destroyEach();
    gameOver.visible = true;
    submarine.velocityY = 0;
    if (mousePressedOver(gameOver)) {
      reset();
    }

  }
  drawSprites();
  fill("white");
  textSize(20);
  text("Score= " + score, 30, 20);


}

function increaseScore(obs) {
  score = score + 10
  obs.remove()
  //sonar.stop()
  jumpSound.play()
}

function obstacles() {

  if (World.frameCount % 120 === 0) {
    var obstacle = createSprite(width, 200, 20, 20);
    obstacle.y = Math.round(random(100, 900));
    //create switch statement
    rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: obstacle.addImage(whaleImg);
        obstacle.setCollider("rectangle", 0, 0, 650, 200)
        break;
      case 2: obstacle.addImage(diverImg);
        break;
      default: break;


    }

    obstacle.velocityX = -(20 + (score / 2));
    obstacle.scale = 0.5;
    obstacle.depth = submarine.depth + 1;
    obstacleGroup.add(obstacle);
    obstacle.debug = false;
  }
}

function reset() {
  gameState = START;
  score = 0;

}