var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var bricksGroup, bricksImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score;

var gameOverImg, restartImg
var jumpSound, checkPointSound, dieSound

function preload() {
  mario_running = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  mario_collided = loadAnimation("collided.png");

  groundImage = loadImage("ground2.png");

  backgroundImage = loadImage("bg.png");

  bricksImage = loadImage("brick.png");


  obstacles1 = loadImage("obstacle1.png");
  obstacles2 = loadImage("obstacle2.png");
  obstacles3 = loadImage("obstacle3.png");
  obstacles4 = loadImage("obstacle4.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 500);

  //creating background sprite
  bg = createSprite(300, 200, 600, 400);
  bg.addImage("background", backgroundImage);
  bg.scale = 1;

  //creating mario sprite
  mario = createSprite(20, 350, 300, 300);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 2;

  //creating edges for mario to bounce off ground
  edges = createEdgeSprites();

  //creating ground sprite
  ground = createSprite(400, 370, 600, 20);
  ground.addImage("ground", groundImage);

  //creating invisible ground
  invisibleGround = createSprite(400, 380, 600, 20);
  invisibleGround.visible = false;


  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 140);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  //creating obstacles and bricks group
  obstaclesGroup = new Group();
  bricksGroup = new Group();

  mario.setCollider("rectangle", 0, 0, 20, 40);
  mario.debug = true

  score = 0;

}

function draw() {
  background("white");

  console.log("this is ", gameState)

  if (gameState === PLAY) {
    gameOver.visible = false
    restart.visible = false
    ground.velocityX = -4
    //scoring
    score = score + Math.round(frameCount / 60);




    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //jump when the space key is pressed
    if (keyDown("space") && mario.y >= 100) {
      mario.velocityY = -10;
      jumpSound.play();
    }

    //add gravity
    mario.velocityY = mario.velocityY + 0.5;

    //spawm bricks
    spawmBricks();
    //spawm obstacles
    spawmObstacles();

    if (obstaclesGroup.isTouching(mario)) {
      gameState = END;
      dieSound.play();

    }
    /*if(bricksGroup.isTouching(mario)){
     //brick.visible= false; 
      bricksGroup.destroyEach();
    
    score=score+1;
    
   }*/

  } else if (gameState === END) {
    console.log("hey")
    gameOver.visible = true;
    restart.visible = true;



    //stop ground
    ground.velocityX = 0;
    mario.velocityY = 0;

    //change the trex animation
    mario.changeAnimation("collided", mario_collided);

    //set lifetime of objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
  }

  //mario collide invisible ground
  mario.collide(invisibleGround);

  mario.collide(ground);

  drawSprites();

  fill("black")
  text("Score: " + score, 400, 50);
}

function spawmBricks() {
  if (frameCount % 60 === 0) {

    var bricks = createSprite(600, 200, 20, 40);
    bricks.addImage("bricks", bricksImage);
    bricks.y = Math.round(random(150, 200));
    bricks.velocityX = -3;
    bricks.setCollider("rectangle", 0, 0, 3, 15);
    bricks.debug = true

    //assigning depth
    bricks.depth = mario.depth;
    mario.depth = mario.depth + 1;

    //assign lifetime to the variable
    bricks.lifetime = 180;

    //add bricks to bricks group
    bricksGroup.add(bricks);
  }

}

function spawmObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(300, 310, 30, 40);
    obstacle.velocityX = -6;
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacles1);
        break;
      case 2:
        obstacle.addImage(obstacles2);
        break;
      case 3:
        obstacle.addImage(obstacles3);
        break;
      case 4:
        obstacle.addImage(obstacles4);
        break;
      default:
        break;
    }
    obstacle.depth = mario.depth;
    mario.depth = mario.depth + 2;


    //assign scale and lifetime to the obstacle
    obstacle.scale = 1;
    obstacle.lifetime = 300;

    //add each obstacle to obstacle group
    obstaclesGroup.add(obstacle);
  }
}