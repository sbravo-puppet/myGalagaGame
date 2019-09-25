/*Galaga - Assignment 2 - 1701ICT Creative Coding - Due 27 Sep 2019 - 32%
By Sean Bourchier - s5150522 */

// used to switch between screens
const LOADING = 0,
      MAIN_MENU = 1,
      EASY_MODE = 2,
      HIGH_SCORE = 3,
      HARD_MODE = 4,
      TUTORIAL = 5;
let currentScreen = MAIN_MENU;

let video; // LOADING Screen video

let playTime = 0; // counter for general play events
let enemyTwoCounter = 0; // counter for enemyTwo events

let highscores; // json
let score = 0;
let player; // player object for keeping score
let personToBeat; // used to find which score to place the new score above in json

let galagaTitleImg; // picture on main menu page
let playSong; // song during game
let playSong2; // victory song

let starArr = new Array(80);
let comet; // comet sprite
let cometSpeed = 8;
let cometImg;

let maverick; // main hero sprite
let maverickImg;
let mavFireMode = 1;
let maverickFire1Arr = []; // normal ship fire array of sprites
let maverickFire1Img;

let maverickFire2Arr = []; // powerUp ship fire array of sprites
let maverickFire2Img;

let mavPlasmaArr = []; // powerUp ship fire array of sprites
let mavPlasmaImg;

let maverickHealth = 200;
let mavFireSound;
let mavFireTwoSound;
let mavPlasmaSound;
let mavHitSound;
let mavDeathSound;

let enemyOne = []; // enemyOne sprites
let enemyOneImg;
let enemyFireOneArr = []; // enemy fire array of sprites
let enemyOneFireSound;
let enemyDeathSound;

let enemyTwo = []; // enemyTwo sprites
let enemyTwoImg;
let enemyFireTwoArr = []; // enemy fire array of sprites
let enemyTwoHealth = [];

let boss; // boss sprite
let bossImg;
let bossHealth = 200;
let bossCounter = 0;
let accomplishedCounter = 0;
let angle = 0;

let powerUp; // powerUp sprite
let powerUpSound;
let powerUpCounter = 0;

//HTML elements
// let name;
// let nameInput;
// let nameInputButton;
let playButton;
let highScoreButton;
let endGameButton;
let mainMenuButton;
let hardModeButton;
let tutorialButton;

function preload() {
  galagaTitleImg = loadImage('assets/galagaTitle.png');
  playSong = loadSound('assets/sound/MachinimaSound.com_-_Escape_from_the_Temple.mp3');
  playSong2 = loadSound('assets/sound/MachinimaSound.com_-_Queen_of_the_Night.mp3');
  gameFont = loadFont('assets/Bahamas_Light_Regular.ttf');

  maverickImg = loadImage('assets/maverick/maverick00.png');
  maverickFire1Img= loadImage('assets/maverick/mavfireOne01.png');
  mavFireSound = loadSound('assets/sound/mavFire.mp3');
  maverickFire2Img = loadImage('assets/maverick/mavfireTwo01.png');
  mavFireTwoSound = loadSound('assets/sound/mavFireTwo.wav');
  mavPlasmaImg = loadImage('assets/maverick/mavPlasma00.png');
  mavPlasmaSound = loadSound('assets/sound/mavPlasma.mp3');
  mavHitSound = loadSound('assets/sound/mavHit.mp3');
  mavDeathSound = loadSound('assets/sound/mavDeath.mp3');
  explosion = loadAnimation('assets/explosion01.png', 'assets/explosion05.png');

  enemyOneImg = loadImage('assets/enemyOne/enemyOne01.png');
  enemyFireOneImg = loadImage('assets/enemyOne/enemyFireOne02.png');
  enemyOneFireSound = loadSound('assets/sound/enemyOneFire.mp3');
  enemyDeathSound = loadSound('assets/sound/enemyDeath.mp3');

  enemyTwoImg = loadImage('assets/enemyTwo/enemyTwo01.png');
  enemyFireTwoImg = loadImage('assets/enemyTwo/enemyFireTwo01.png');

  bossImg = loadImage('assets/boss/boss00.png');

  powerUpImg = loadImage('assets/powerUp01.png');
  powerUpSound = loadSound('assets/sound/powerUp.mp3');

  cometImg = loadImage('assets/comet00.png');

  highscores = loadJSON('assets/highscores.json');
}

function setup() {
  createCanvas(1000,700);
  imageMode(CENTER);
  stroke('red');
  textFont(gameFont);

  video = createVideo('assets/galagafirstVideoEdit.mp4');
  video.addCue(14.8, videoEnded);
  video.hide();
  video.noLoop();

  // nameInput = createInput('', text);
  // nameInput.elt.isContentEditable = true;
  // nameInput.elt.maxLength = 10;
  // nameInput.position(width/2 - 125, height/3 + 30);
  // nameInput.size(250,50);
  // nameInput.style('font-size', '2em');
  // nameInput.hide();

  // name = nameInput.value();

  // nameInputButton = createButton('Name:');
  // nameInputButton.style('font-size', '2em');
  // nameInputButton.position(width/2 - 125 - 255, height/3 + 30);
  // nameInputButton.size(120,40);
  // nameInputButton.mouseClicked(nameInputButtonClicked);
  // nameInputButton.hide();

  playButton = createButton('Easy Mode');
  playButton.style('font-size', '2em');
  playButton.position(width/2 - 125, 400);
  playButton.size(250,50);
  playButton.mouseClicked(playButtonClicked);
  playButton.hide();

  hardModeButton = createButton('Hard Mode');
  hardModeButton.style('font-size', '2em');
  hardModeButton.position(width/2 - 125, 465);
  hardModeButton.size(250,50);
  hardModeButton.mouseClicked(hardModeButtonClicked);
  hardModeButton.hide();

  highScoreButton = createButton('High Scores');
  highScoreButton.style('font-size', '2em');
  highScoreButton.position(width/2 - 125, 530);
  highScoreButton.size(250,50);
  highScoreButton.mouseClicked(highScoreButtonClicked);
  highScoreButton.hide();

  tutorialButton = createButton('View Tutorial');
  tutorialButton.style('font-size', '2em');
  tutorialButton.position(width/2 - 125, 595);
  tutorialButton.size(250,50);
  tutorialButton.mouseClicked(tutorialButtonClicked);
  tutorialButton.hide();

  endGameButton = createButton('End Game');
  endGameButton.position(width - endGameButton.size().width - 5, 5);
  endGameButton.mouseClicked(endGameButtonClicked);
  endGameButton.hide();

  mainMenuButton = createButton('Back to Main Menu');
  mainMenuButton.position(width - mainMenuButton.size().width - 5, 5);
  mainMenuButton.mouseClicked(mainMenuButtonClicked);
  mainMenuButton.hide();  
}

function draw() {
  switch (currentScreen) {
    case LOADING:
      drawLoadingScreen();
      break;
    case MAIN_MENU:
      drawMainMenuScreen();
      break;
    case EASY_MODE:
      drawPlayGameScreen();
      break;
    case HARD_MODE:
      drawHardModeScreen();
      break;
    case HIGH_SCORE:
      drawHighScoreScreen();
      break;
    case TUTORIAL:
      drawTutorialScreen();
      break;
  }
}

function videoEnded() {
  currentScreen=MAIN_MENU;
  video.stop();
}

function playButtonClicked() {
  currentScreen = EASY_MODE;
  playButton.hide();
  highScoreButton.hide();
  hardModeButton.hide();
  tutorialButton.hide();
  // nameInput.hide();
  // nameInputButton.hide();
  endGameButton.show();
  //start music
  playSong.jump(128, 115);
  playSong.loop();
  //create main ship
  maverick = createSprite(width/2, height - maverickImg.height-20, maverickImg.width, maverickImg.height);
  maverick.addAnimation('mavNormal', 'assets/maverick/maverick00.png', 'assets/maverick/maverick04.png');
  maverick.addAnimation('mavPowerUp', 'assets/maverick/maverickPowerUp00.png', 'assets/maverick/maverickPowerUp04.png');
  maverick.addAnimation('explosion', 'assets/explosion01.png', 'assets/explosion05.png');
  //load background stars
  for(let i=0; i<starArr.length; i++){
    starArr[i] = {
      x : random(0, width),
      y : random(0, height),
      d : random(1,4),
      velY : 3,
      show : function() {
        fill('white');
        noStroke();
        ellipse(this.x,this.y,this.d);
      },
      move : function() {
        this.y += this.velY;
      }      
    }
  };
  //load enemyOne sprites
  for(i=0; i<8; i++) {
  enemyOne[i] = createSprite(220 + i * 70,500,enemyOneImg.width, enemyOneImg.height);
  enemyOne[i].addAnimation('fly', 'assets/enemyOne/enemyOne01.png', 'assets/enemyOne/enemyone02.png');
  enemyOne[i].addAnimation('explosion', 'assets/explosion01.png', 'assets/explosion05.png');
  }
  //load enemyTwo sprites
  for(i=0; i<7; i++) {
    enemyTwo[i] = createSprite(width + 100 + i * 150,200,enemyTwoImg.width, enemyTwoImg.height);
    enemyTwo[i].addAnimation('fly', 'assets/enemyTwo/enemyTwo01.png', 'assets/enemyTwo/enemyTwo02.png');
    enemyTwo[i].addAnimation('explosion', 'assets/explosion01.png', 'assets/explosion05.png');
    enemyTwo[i].mass = 100;
    enemyTwoHealth[i] = 100;
  }
  //load powerUp
  powerUp = createSprite(random(0 + powerUpImg.width, width - powerUpImg.width), -500, powerUpImg.width, powerUpImg.height);
  powerUp.addAnimation('fly', 'assets/powerUp01.png', 'assets/powerUp02.png');
  //load boss
  boss = createSprite(-1000, 600, bossImg.width, bossImg.height);
  boss.addAnimation('fly', 'assets/boss/boss00.png', 'assets/boss/boss09.png');
  boss.addAnimation('explosion', 'assets/boss/bossExplosion00.png', 'assets/boss/bossExplosion06.png');
  //load comet
  comet = createSprite(-800, random(height/2, height), cometImg.width, cometImg.height);
  comet.addAnimation('fly', 'assets/comet00.png', 'assets/comet04.png');
}

function hardModeButtonClicked() {
  currentScreen = HARD_MODE;
  playButton.hide();
  hardModeButton.hide();
  highScoreButton.hide();
  tutorialButton.hide();
  // nameInput.hide();
  // nameInputButton.hide();
  endGameButton.show();
  //start music
  playSong.jump(128, 115);
  playSong.loop();
  //create main ship
  maverick = createSprite(width/2, height - maverickImg.height-20, maverickImg.width, maverickImg.height);
  maverick.addAnimation('mavNormal', 'assets/maverick/maverick00.png', 'assets/maverick/maverick04.png');
  maverick.addAnimation('mavPowerUp', 'assets/maverick/maverickPowerUp00.png', 'assets/maverick/maverickPowerUp04.png');
  maverick.addAnimation('explosion', 'assets/explosion01.png', 'assets/explosion05.png');
  //load background stars
  for(let i=0; i<starArr.length; i++){
    starArr[i] = {
      x : random(0, width),
      y : random(0, height),
      d : random(1,4),
      velY : 3,
      show : function() {
        fill('white');
        noStroke();
        ellipse(this.x,this.y,this.d);
      },
      move : function() {
        this.y += this.velY;
      }      
    }
  };
  //load enemyOne sprites
  for(i=0; i<8; i++) {
  enemyOne[i] = createSprite(220 + i * 70,500,enemyOneImg.width, enemyOneImg.height);
  enemyOne[i].addAnimation('fly', 'assets/enemyOne/enemyOne01.png', 'assets/enemyOne/enemyone02.png');
  enemyOne[i].addAnimation('explosion', 'assets/explosion01.png', 'assets/explosion05.png');
  }
  //load enemyTwo sprites
  for(i=0; i<7; i++) {
    enemyTwo[i] = createSprite(width + 100 + i * 150,200,enemyTwoImg.width, enemyTwoImg.height);
    enemyTwo[i].addAnimation('fly', 'assets/enemyTwo/enemyTwo01.png', 'assets/enemyTwo/enemyTwo02.png');
    enemyTwo[i].addAnimation('explosion', 'assets/explosion01.png', 'assets/explosion05.png');
    enemyTwo[i].mass = 100;
    enemyTwoHealth[i] = 100;
  }
  //load powerUp
  powerUp = createSprite(random(0 + powerUpImg.width, width - powerUpImg.width), -500, powerUpImg.width, powerUpImg.height);
  powerUp.addAnimation('fly', 'assets/powerUp01.png', 'assets/powerUp02.png');
  //load boss
  boss = createSprite(-1000, 600, bossImg.width, bossImg.height);
  boss.addAnimation('fly', 'assets/boss/boss00.png', 'assets/boss/boss09.png');
  boss.addAnimation('explosion', 'assets/boss/bossExplosion00.png', 'assets/boss/bossExplosion06.png');
  //load comet
  comet = createSprite(-800, random(height/2, height), cometImg.width, cometImg.height);
  comet.addAnimation('fly', 'assets/comet00.png', 'assets/comet04.png');
}

function highScoreButtonClicked() {
  currentScreen = HIGH_SCORE;
  highScoreButton.hide();
  playButton.hide();
  hardModeButton.hide();
  tutorialButton.hide();
  // nameInput.hide();
  // nameInputButton.hide();
  mainMenuButton.show();
}

function tutorialButtonClicked() {
  currentScreen = TUTORIAL;
  tutorialButton.hide();
  highScoreButton.hide();
  playButton.hide();
  hardModeButton.hide();
  // nameInput.hide();
  // nameInputButton.hide();
}

function endGameButtonClicked() {
  currentScreen = HIGH_SCORE;
  endGameButton.hide();
  mainMenuButton.show();
  // remove all sprites, reset all values
  playSong.stop();
  playTime = 0;
  enemyTwoCounter = 0;
  mavFireMode = 1;
  maverick.remove();
  maverickHealth = 200;
  enemyTwoHealth = [];
  boss.remove();
  bossHealth = 200;
  bossCounter = 0;
  angle = 0;
  powerUp.remove();
  powerUpCounter = 0;
  accomplishedCounter = 0;
  maverickHealth = 200;
  comet.position.x = -500;
  comet.position.y = random(height*(2/3), height-20);
  for(let i=0; i<maverickFire1Arr.length; i++) {
    maverickFire1Arr[i].remove();
  }
  for(let i=0; i<maverickFire2Arr.length; i++) {
    maverickFire2Arr[i].remove();
  }
  for(let i=0; i<enemyOne.length; i++) {
    enemyOne[i].remove();
  }
  for(let i=0; i<enemyFireOneArr.length; i++) {
    enemyFireOneArr[i].remove();
  }
  for(let i=0; i<enemyTwo.length; i++) {
    enemyTwo[i].remove();
  }
  for(let i=0; i<enemyFireTwoArr.length; i++) {
    enemyFireTwoArr[i].remove();
  }
  //update player scores and write new score to JSON in correct position in array
  player = {  
    "name": "Maverick",
    "score": 000,
    "accuracy": 75
  }
  player.score = score;
  personToBeat = 5;
  for(let i=highscores.highscores.length - 1; i>-1; i--) {
    if(player.score > highscores.highscores[i].score) {
      personToBeat = i;
    }
  }
  if(personToBeat < 5) {
    highscores.highscores.splice(personToBeat, 0, player);
    highscores.highscores.splice(5, 1);
  }
}

function mainMenuButtonClicked() {
  currentScreen = MAIN_MENU;
  mainMenuButton.hide();
  playButton.show();
  playSong2.stop();
  score = 0;
}

function drawLoadingScreen () {
  background(0);
  image(galagaTitleImg, width/2, 150);
  fill(255);
  textSize(30);
  textAlign(CENTER, CENTER)
  text('Loading...', width/2,height/2);
  imageMode(CORNER);
  if(frameCount > 150 && currentScreen==LOADING) {
    image(video, 0, 0,width,height);
    video.play();
  }
}

function drawMainMenuScreen () {
  video.stop();
  // nameInput.show();
  // nameInputButton.show();
  playButton.show();
  highScoreButton.show();
  hardModeButton.show();
  tutorialButton.show();

  background('black');

  image(galagaTitleImg, width/2, 150);
  fill(255);
  textSize(30);
  textAlign(CENTER, CENTER)
  text('Main Menu', width/2,height/2);
}

function drawPlayGameScreen () {
  background('black');
  drawSprites();
  //start playTime counter
  if(playTime < frameCount) {
    playTime++;
  }
  //display star background
  for(let i = 0; i<starArr.length; i++) {
    starArr[i].show();
    starArr[i].move();
    if(starArr[i].y > height) {
      starArr[i].x = random(0,width);
      starArr[i].y = random(-height,0);
    }
  }
  //comet starts flying past
  if(playTime % 600 == 0) {
    comet.position.x = -500;
    comet.position.y = random(height*(2/3), height-20);
  }
  comet.position.x+=cometSpeed;
  //collision detection between maverick and comet
  if(comet.displace(maverick)) {
    mavHitSound.play();
    maverickHealth -= 1;
    if(maverickHealth == 0 && maverick.removed == false) {
      playSong.stop();
      mavDeathSound.setVolume(0.3);
      mavDeathSound.play();
    }
  }
  //display maverick health
  noFill();
  strokeWeight(3);
  stroke('white');
  rect(width/2 - 100, height - 30, 200, 20)
  fill('red');
  noStroke();
  maverickHealth = constrain(maverickHealth, 0, maverickHealth);
  rect(width/2 - 100, height - 30, maverickHealth, 20)
  //display maverick score
  textSize(20);
  text("Score: " + score, 50,50);
  //function for maverick keyboard interactions, move left, move right, normal fire
  maverickShip(); 
  //to return mav to normal after powerUp finishes
  if(mavFireMode == 1 && maverickHealth > 0) {
    maverick.changeAnimation('mavNormal');
  }
  //enemyOne starts at bottom and moves up
  for(let i = 0; i<enemyOne.length; i++) {
    if(enemyOne[i].position.y > 100) {
      enemyOne[i].position.y -= 2;
      enemyOne[i].position.x +=  sin(playTime / 25) * 5;
    }
  }
  //collision detection between mavfireOne and enemyOne - kills enemyOne
  for(let i=0; i<enemyOne.length; i++){
    for(let j=0; j<maverickFire1Arr.length; j++){
      if(maverickFire1Arr[j].overlap(enemyOne[i])) {
        score+=40;
        enemyDeathSound.setVolume(0.3);
        enemyDeathSound.play();
        enemyOne[i].changeAnimation('explosion');
        enemyOne[i].animation.looping = false;
        maverickFire1Arr[j].remove();
        // enemyOne.splice(i, 1); // removed because causing Error: Overlap can only be checked between Sprites or groups
      }      
    }
  }
  //remove enemyOne from array after explosion animation
  for(let i=0; i<enemyOne.length; i++) {
    if(enemyOne[i].animation.looping == false && enemyOne[i].animation.getFrame() == 4) {
      enemyOne[i].remove();
    }
  }
  //added so that splice was not part of the collision loop
  for(let i=0; i<enemyOne.length; i++) {
    if(enemyOne[i].removed) {
      enemyOne.splice(i, 1);
    }
  }
  //create enemy fire from random enemies
  if(enemyOne.length != 0 && playTime > 120 && playTime % 45 == 0) {
    let enemy = floor(random(0, enemyOne.length)); // random enemy still present in the array
    let enemyFire = createSprite(enemyOne[enemy].position.x, enemyOne[enemy].position.y, enemyFireOneImg.width, enemyFireOneImg.height);
    enemyFire.addAnimation('enemyfire', 'assets/enemyOne/enemyFireOne00.png', 'assets/enemyOne/enemyFireOne02.png');
    enemyFire.setVelocity(0, 8);
    enemyFireOneArr.push(enemyFire);
    enemyOneFireSound.setVolume(0.2);
    enemyOneFireSound.play();
  }
  //collision detection between enemyOne fire and maverick - lose health
  for(let i=0; i<enemyFireOneArr.length; i++){
    if(enemyFireOneArr[i].overlap(maverick)) {
      enemyFireOneArr[i].remove();
      mavHitSound.play();
      maverickHealth -= 20;
      if(maverickHealth == 0 && maverick.removed == false) {
        playSong.stop();
        mavDeathSound.setVolume(0.3);
        mavDeathSound.play();
      }
    }      
  }
  //if health = 0, mav blown up animation
  if(maverickHealth == 0) {
    maverick.changeAnimation('explosion');
    maverick.animation.looping = false;
  }
  //if maverick blown up, game over
  if(maverick.animation.looping == false && maverick.animation.getFrame() == 4) {
    maverick.remove();
    textAlign(CENTER, CENTER);
    textSize(60);
    text('GAME OVER', width/2, height/2);
    accomplishedCounter++;
  }
  //enemyTwo show up when enemyOne dies
  if(enemyOne.length == 0) {
    enemyTwoCounter++;
    let speed = 5;
    if(enemyTwoCounter > 800) {
      enemyTwoCounter = 0;
    }
    if(enemyTwoCounter > 400) {
      speed = -speed;
    }
    for(i=0; i<enemyTwo.length; i++) {
      enemyTwo[i].position.x -= speed;
    }
  }
  //collision detection between mavFireOne and EnemyTwo - bounces and shrinks enemyTwo
  for(let i=0; i<enemyTwo.length; i++){
    for(let j=0; j<maverickFire1Arr.length; j++){
      if(maverickFire1Arr[j].bounce(enemyTwo[i])) {
        enemyTwo[i].scale -= 0.1;
        enemyTwo[i].friction = 0.01;
        enemyTwoHealth[i] -=20;
        score+=50;
        maverickFire1Arr[j].remove();
      }      
    }
  }
  //collision detection between mavFireTwo and EnemyTwo - bounces and shrinks enemyTwo
  for(let i=0; i<enemyTwo.length; i++){
    for(let j=0; j<maverickFire2Arr.length; j++){
      if(maverickFire2Arr[j].bounce(enemyTwo[i])) {
        enemyTwo[i].scale -= 0.1;
        enemyTwo[i].friction = 0.01;
        enemyTwoHealth[i] -=25;
        score+=50;
        maverickFire2Arr[j].remove();
      }      
    }
  }
  //collision detection between mavPlasma and EnemyTwo - bounces and shrinks enemyTwo
  for(let i=0; i<enemyTwo.length; i++){
    for(let j=0; j<mavPlasmaArr.length; j++){
      if(mavPlasmaArr[j].displace(enemyTwo[i])) {
        enemyTwo[i].scale -= 0.1;
        enemyTwo[i].friction = 0.01;
        enemyTwoHealth[i] -=25;
        score+=50;
        // maverickFire2Arr[j].remove();
      }      
    }
  }
  //enemyTwo loses all health - enemyTwo explodes
  for(let i=0; i<enemyTwo.length; i++){
    if(enemyTwoHealth[i] <= 0) {
      enemyTwo[i].changeAnimation('explosion');
      enemyTwo[i].animation.looping = false;
    }
  }
  //remove enemyTwo from array after explosion animation
  for(let i=0; i<enemyTwo.length; i++) {
    if(enemyTwo[i].animation.looping == false && enemyTwo[i].animation.getFrame() == 4) {
      enemyTwo[i].remove();
    }
  }
  //added so that splice was not part of the collision loop
  for(let i=0; i<enemyTwo.length; i++) {
    if(enemyTwo[i].removed) {
      enemyTwo.splice(i, 1);
      enemyTwoHealth.splice(i, 1);
    }
  }
  //create enemyTwo fire
  if(enemyOne.length == 0 && enemyTwo.length != 0 && playTime % 30 == 0) {
    let enemy = floor(random(0, enemyTwo.length)); // random enemy still present in the array
    let enemyFire = createSprite(enemyTwo[enemy].position.x, enemyTwo[enemy].position.y, enemyFireTwoImg.width, enemyFireTwoImg.height);
    enemyFire.addAnimation('enemyfire', 'assets/enemyTwo/enemyFireTwo00.png', 'assets/enemyTwo/enemyFireTwo02.png');
    enemyFire.setVelocity(0, 12);
    enemyFireTwoArr.push(enemyFire);
    enemyOneFireSound.setVolume(0.1);
    enemyOneFireSound.play();
  }
    //collision detection between enemy fire and maverick - lose health
  for(let i=0; i<enemyFireTwoArr.length; i++){
    if(enemyFireTwoArr[i].overlap(maverick) && maverick.removed == false) {
      enemyFireTwoArr[i].remove();
      mavHitSound.play();
      maverickHealth -= 60;
      if(maverickHealth == 0 && maverick.removed == false) {
        playSong.stop();
        mavDeathSound.setVolume(0.3);
        mavDeathSound.play();
      }
    }      
  }
  //powerUp comes down after all enemyOne dies
  if(enemyOne.length == 0 && playTime % 600 == 0) {
    powerUp.setVelocity(0, 6);
  }
  //collision detection between powerUp and maverick, changes maverick fire mode
  if(maverick.overlap(powerUp)) {
    powerUpSound.play();
    powerUp.remove();
    powerUp = createSprite(random(0 + powerUpImg.width, width - powerUpImg.width), -500, powerUpImg.width, powerUpImg.height);
    powerUp.addAnimation('fly', 'assets/powerUp01.png', 'assets/powerUp02.png');
    mavFireMode = round(random(2,3));
  }
  //if powerup isn't collected
  if(enemyOne.length == 0 && powerUp.position.y > height*2) {
    powerUp.position.y = -height*2;
    powerUp.position.x = random(0,width);
  }
  //maverick powerUp fire mode only lasts 5 seconds
  if(mavFireMode == 2 || mavFireMode == 3 && maverickHealth > 0) {
    maverick.changeAnimation('mavPowerUp');
    powerUpCounter++
    if(powerUpCounter == 300) {
      mavFireMode = 1;
      powerUpCounter = 0;
    }
  }
  //collision detection between maverick and Boss
  if(boss.displace(maverick)) {
    mavHitSound.play();
    maverickHealth -= 3;
    if(maverickHealth == 0 && maverick.removed == false) {
      playSong.stop();
      mavDeathSound.setVolume(0.3);
      mavDeathSound.play();
    }
  }
  //collision detection between mavFireOne and Boss
  for(let i=0; i<maverickFire1Arr.length; i++){
    if(maverickFire1Arr[i].overlap(boss)) {
      bossHealth -=2;
      score+=100;
      maverickFire1Arr[i].remove();
      // boss explodes
      if(bossHealth <= 0) {
        enemyDeathSound.setVolume(0.3);
        enemyDeathSound.play();
        boss.changeAnimation('explosion');
        boss.animation.looping = false;
      }
    }      
  }
  //collision detection between mavFireTwo and Boss
  for(let i=0; i<maverickFire2Arr.length; i++){
    if(maverickFire2Arr[i].overlap(boss)) {
      bossHealth -=4;
      score+=100;
      maverickFire2Arr[i].remove();
        // boss explodes
      if(bossHealth <= 0) {
        enemyDeathSound.setVolume(0.3);
        enemyDeathSound.play();
        boss.changeAnimation('explosion');
        boss.animation.looping = false;
      }
    }      
  }
  //collision detection between mavFirePlasma and Boss
  for(let i=0; i<mavPlasmaArr.length; i++){
    if(mavPlasmaArr[i].displace(boss)) {
      bossHealth -=4;
      score+=100;
        // boss explodes
      if(bossHealth <= 0) {
        enemyDeathSound.setVolume(0.3);
        enemyDeathSound.play();
        boss.changeAnimation('explosion');
        boss.animation.looping = false;
      }
    }      
  }
  // remove boss after explosion
  if(boss.animation.looping == false && boss.animation.getFrame() == 6) {
    playSong.stop();
    boss.remove();
    textAlign(CENTER, CENTER);
    textSize(60);
    fill('blue');
    text('MISSION ACCOMPLISHED', width/2, height/2);
    accomplishedCounter++;
  }
  if(accomplishedCounter == 1 && boss.animation.looping == false) {
    playSong2.jump(32,158);
  }
  if(accomplishedCounter == 300) {
    endGameButtonClicked();
  }
  //if all of enemyTwo die, the boss comes out
  if(enemyTwo.length == 0 && playTime > 10) {
    bossCounter++
  }
  //display boss health
  if(bossCounter > 0) {
    noFill();
    strokeWeight(3);
    stroke('white');
    rect(width/2 - 100, 30, 200, 20)
    fill(0,255,0);
    noStroke();
    bossHealth = constrain(bossHealth, 0, bossHealth);
    rect(width/2 - 100, 30, bossHealth, 20)
  }
  //boss first fly past
  if(bossCounter == 180 && boss.position.x < width - bossImg.width) {
    boss.setVelocity(10,0);
  }
  //boss first attack mode
  if(bossCounter > 500 && bossCounter < 30*60) {
    let x = cos(frameCount/50);          
    let y = cos(3*(frameCount/50)+PI/2);
    boss.position.x = map(x, -1,1, 0,width);
    boss.position.y = map(y, -1,1, 0, width);
  }
  //boss returns
  if(bossCounter == 30*60) {
    boss.position.x = width/2;
    boss.position.y = 200;
    boss.setVelocity(0,0);
  }
  //boss starts following maverick
  if(bossCounter > 31*60 && bossCounter < 50*60) { 
    if (boss.position.y < maverick.position.y) {
      boss.position.y+=3;
    }
    if (boss.position.y > maverick.position.y) {
        boss.position.y-=3;
    }
    if (boss.position.x < maverick.position.x) {
        boss.position.x+=3;
    }
    if (boss.position.x > maverick.position.x) {
        boss.position.x-=3;
    }
  }
  //boss returns to middle of screen
  if(bossCounter == 50*60) {
    boss.position.x = width/2;
    boss.position.y = 200;
    boss.setVelocity(0,0);
  }
  //boss does second attack mode
  if(bossCounter > 55*60) { 
    angleMode(DEGREES);
    let centreX = width / 2;
    let centreY = height / 2;
    let radius = 350;
    boss.position.x = (radius * cos(angle)) + centreX;
    boss.position.y = (radius * sin(angle)) + centreY;
    angle+=2;
  }
}

function drawHardModeScreen () {
  background('black');
  drawSprites();
  //start playTime counter
  if(playTime < frameCount) {
    playTime++;
  }
  //display star background
  for(let i = 0; i<starArr.length; i++) {
    starArr[i].show();
    starArr[i].move();
    if(starArr[i].y > height) {
      starArr[i].x = random(0,width);
      starArr[i].y = random(-height,0);
    }
  }
  //comet starts flying past
  if(playTime % 500 == 0) {
    comet.position.x = -500;
    comet.position.y = random(height*(2/3), height-20);
  }
  cometSpeed = 10;
  comet.position.x+=cometSpeed;
  //collision detection between maverick and comet
  if(comet.displace(maverick)) {
    mavHitSound.play();
    maverickHealth -= 3;
    if(maverickHealth == 0 && maverick.removed == false) {
      playSong.stop();
      mavDeathSound.setVolume(0.3);
      mavDeathSound.play();
    }
  }
  //display maverick health
  noFill();
  strokeWeight(3);
  stroke('white');
  rect(width/2 - 100, height - 30, 200, 20)
  fill('red');
  noStroke();
  maverickHealth = constrain(maverickHealth, 0, maverickHealth);
  rect(width/2 - 100, height - 30, maverickHealth, 20)
  //display maverick score
  textSize(20);
  text("Score: " + score, 50,50);
  //function for maverick keyboard interactions, move left, move right, normal fire
  maverickShip(); 
  //to return mav to normal after powerUp finishes
  if(mavFireMode == 1 && maverickHealth > 0) {
    maverick.changeAnimation('mavNormal');
  }
  //enemyOne starts at bottom and moves up
  for(let i = 0; i<enemyOne.length; i++) {
    if(enemyOne[i].position.y > 100) {
      enemyOne[i].position.y -= 2;
      enemyOne[i].position.x +=  sin(playTime / 25) * 5;
    }
  }
  //collision detection between mav fire and enemyOne - kills enemyOne
  for(let i=0; i<enemyOne.length; i++){
    for(let j=0; j<maverickFire1Arr.length; j++){
      if(maverickFire1Arr[j].overlap(enemyOne[i])) {
        score+=100;
        enemyDeathSound.setVolume(0.3);
        enemyDeathSound.play();
        enemyOne[i].changeAnimation('explosion');
        enemyOne[i].animation.looping = false;
        maverickFire1Arr[j].remove();
        // enemyOne.splice(i, 1); // removed because causing Error: Overlap can only be checked between Sprites or groups
      }      
    }
  }
  //remove enemyOne from array after explosion animation
  for(let i=0; i<enemyOne.length; i++) {
    if(enemyOne[i].animation.looping == false && enemyOne[i].animation.getFrame() == 4) {
      enemyOne[i].remove();
    }
  }
  //added so that splice was not part of the collision loop
  for(let i=0; i<enemyOne.length; i++) {
    if(enemyOne[i].removed) {
      enemyOne.splice(i, 1);
    }
  }
  //create enemy fire from random enemies
  if(enemyOne.length != 0 && playTime > 90 && playTime % 35 == 0) {
    let enemy = floor(random(0, enemyOne.length)); // random enemy still present in the array
    let enemyFire = createSprite(enemyOne[enemy].position.x, enemyOne[enemy].position.y, enemyFireOneImg.width, enemyFireOneImg.height);
    enemyFire.addAnimation('enemyfire', 'assets/enemyOne/enemyFireOne00.png', 'assets/enemyOne/enemyFireOne02.png');
    enemyFire.setVelocity(0, 9);
    enemyFireOneArr.push(enemyFire);
    enemyOneFireSound.setVolume(0.2);
    enemyOneFireSound.play();
  }
  //collision detection between enemyOne fire and maverick - lose health
  for(let i=0; i<enemyFireOneArr.length; i++){
    if(enemyFireOneArr[i].overlap(maverick)) {
      enemyFireOneArr[i].remove();
      mavHitSound.play();
      maverickHealth -= 40;
      if(maverickHealth == 0 && maverick.removed == false) {
        playSong.stop();
        mavDeathSound.setVolume(0.3);
        mavDeathSound.play();
      }
    }      
  }
  //if health = 0, mav blown up animation
  if(maverickHealth == 0) {
    maverick.changeAnimation('explosion');
    maverick.animation.looping = false;
  }
  //if maverick blown up, game over
  if(maverick.animation.looping == false && maverick.animation.getFrame() == 4) {
    maverick.remove();
    textAlign(CENTER, CENTER);
    textSize(60);
    text('GAME OVER', width/2, height/2);
    accomplishedCounter++;
  }
  //enemyTwo show up when enemyOne dies
  if(enemyOne.length == 0) {
    enemyTwoCounter++;
    let speed = 6;
    if(enemyTwoCounter > 800) {
      enemyTwoCounter = 0;
    }
    if(enemyTwoCounter > 400) {
      speed = -speed;
    }
    for(i=0; i<enemyTwo.length; i++) {
      enemyTwo[i].position.x -= speed;
    }
  }
  //collision detection between mavFireOne and EnemyTwo - bounces and shrinks enemyTwo
  for(let i=0; i<enemyTwo.length; i++){
    for(let j=0; j<maverickFire1Arr.length; j++){
      if(maverickFire1Arr[j].bounce(enemyTwo[i])) {
        enemyTwo[i].scale -= 0.01;
        enemyTwo[i].friction = 0.01;
        enemyTwoHealth[i] -=5;
        score+=100;
        maverickFire1Arr[j].remove();
      }      
    }
  }
  //collision detection between mavFireTwo and EnemyTwo - bounces and shrinks enemyTwo
  for(let i=0; i<enemyTwo.length; i++){
    for(let j=0; j<maverickFire2Arr.length; j++){
      if(maverickFire2Arr[j].bounce(enemyTwo[i])) {
        enemyTwo[i].scale -= 0.02;
        enemyTwo[i].friction = 0.01;
        enemyTwoHealth[i] -=8;
        score+=100;
        maverickFire2Arr[j].remove();
      }      
    }
  }
  //collision detection between mavPlasma and EnemyTwo - bounces and shrinks enemyTwo
  for(let i=0; i<enemyTwo.length; i++){
    for(let j=0; j<mavPlasmaArr.length; j++){
      if(mavPlasmaArr[j].displace(enemyTwo[i])) {
        enemyTwo[i].scale -= 0.05;
        enemyTwo[i].friction = 0.01;
        enemyTwoHealth[i] -=8;
        score+=30;
      }      
    }
  }
  //enemyTwo loses all health - enemyTwo explodes
  for(let i=0; i<enemyTwo.length; i++){
    if(enemyTwoHealth[i] <= 0) {
      enemyTwo[i].changeAnimation('explosion');
      enemyTwo[i].animation.looping = false;
    }
  }
  //remove enemyTwo from array after explosion animation
  for(let i=0; i<enemyTwo.length; i++) {
    if(enemyTwo[i].animation.looping == false && enemyTwo[i].animation.getFrame() == 4) {
      enemyTwo[i].remove();
    }
  }
  //added so that splice was not part of the collision loop
  for(let i=0; i<enemyTwo.length; i++) {
    if(enemyTwo[i].removed) {
      enemyTwo.splice(i, 1);
      enemyTwoHealth.splice(i, 1);
    }
  }
  //create enemyTwo fire
  if(enemyOne.length == 0 && enemyTwo.length != 0 && playTime % 20 == 0) {
    let enemy = floor(random(0, enemyTwo.length)); // random enemy still present in the array
    let enemyFire = createSprite(enemyTwo[enemy].position.x, enemyTwo[enemy].position.y, enemyFireTwoImg.width, enemyFireTwoImg.height);
    enemyFire.addAnimation('enemyfire', 'assets/enemyTwo/enemyFireTwo00.png', 'assets/enemyTwo/enemyFireTwo02.png');
    enemyFire.setVelocity(0, 14);
    enemyFireTwoArr.push(enemyFire);
    enemyOneFireSound.setVolume(0.1);
    enemyOneFireSound.play();
  }
    //collision detection between enemy fire and maverick - lose health
  for(let i=0; i<enemyFireTwoArr.length; i++){
    if(enemyFireTwoArr[i].overlap(maverick) && maverick.removed == false) {
      enemyFireTwoArr[i].remove();
      mavHitSound.play();
      maverickHealth -= 80;
      if(maverickHealth == 0 && maverick.removed == false) {
        playSong.stop();
        mavDeathSound.setVolume(0.3);
        mavDeathSound.play();
      }
    }      
  }
  //powerUp comes down after all enemyOne dies
  if(enemyOne.length == 0 && playTime % 800 == 0) {
    powerUp.setVelocity(0, 6);
  }
  //collision detection between powerUp and maverick, changes maverick fire mode
  if(maverick.overlap(powerUp)) {
    powerUpSound.play();
    powerUp.remove();
    powerUp = createSprite(random(0 + powerUpImg.width, width - powerUpImg.width), -500, powerUpImg.width, powerUpImg.height);
    powerUp.addAnimation('fly', 'assets/powerUp01.png', 'assets/powerUp02.png');
    mavFireMode = round(random(2,3));
  }
  //if powerup isn't collected
  if(enemyOne.length == 0 && powerUp.position.y > height*2) {
    powerUp.position.y = -height*2;
  }
  //maverick powerUp fire mode only lasts 5 seconds
  if(mavFireMode == 2 || mavFireMode == 3 && maverickHealth > 0) {
    maverick.changeAnimation('mavPowerUp');
    powerUpCounter++
    if(powerUpCounter == 300) {
      mavFireMode = 1;
      powerUpCounter = 0;
    }
  }
  //collision detection between maverick and Boss
  if(boss.displace(maverick)) {
    mavHitSound.play();
    maverickHealth -= 5;
    if(maverickHealth == 0 && maverick.removed == false) {
      playSong.stop();
      mavDeathSound.setVolume(0.3);
      mavDeathSound.play();
    }
  }
  //collision detection between mavFireOne and Boss
  for(let i=0; i<maverickFire1Arr.length; i++){
    if(maverickFire1Arr[i].overlap(boss)) {
      bossHealth -=1;
      score+=150;
      maverickFire1Arr[i].remove();
      // boss explodes
      if(bossHealth <= 0) {
        enemyDeathSound.setVolume(0.3);
        enemyDeathSound.play();
        boss.changeAnimation('explosion');
        boss.animation.looping = false;
      }
    }      
  }
  //collision detection between mavFireTwo and Boss
  for(let i=0; i<maverickFire2Arr.length; i++){
    if(maverickFire2Arr[i].overlap(boss)) {
      bossHealth -=2;
      score+=150;
      maverickFire2Arr[i].remove();
        // boss explodes
      if(bossHealth <= 0) {
        enemyDeathSound.setVolume(0.3);
        enemyDeathSound.play();
        boss.changeAnimation('explosion');
        boss.animation.looping = false;
      }
    }      
  }
  //collision detection between mavFirePlasma and Boss
  for(let i=0; i<mavPlasmaArr.length; i++){
    if(mavPlasmaArr[i].displace(boss)) {
      bossHealth -=5;
      score+=100;
      // boss explodes
      if(bossHealth <= 0) {
        enemyDeathSound.setVolume(0.3);
        enemyDeathSound.play();
        boss.changeAnimation('explosion');
        boss.animation.looping = false;
      }
    }      
  }
  //remove boss after explosion
  if(boss.animation.looping == false && boss.animation.getFrame() == 6) {
    boss.remove();
    playSong.stop();
    textAlign(CENTER, CENTER);
    textSize(60);
    fill('blue');
    text('MISSION ACCOMPLISHED', width/2, height/2);
    accomplishedCounter++;
  }
  if(accomplishedCounter == 1 && boss.animation.looping == false) {
    playSong2.jump(32,158);
  }
  if(accomplishedCounter == 300) {
    endGameButtonClicked();
  }
  //if all of enemyTwo die, the boss comes out
  if(enemyTwo.length == 0 && playTime > 10) {
    bossCounter++
  }
  //display boss health
  if(bossCounter > 0) {
    noFill();
    strokeWeight(3);
    stroke('white');
    rect(width/2 - 100, 30, 200, 20)
    fill(0,255,0);
    noStroke();
    bossHealth = constrain(bossHealth, 0, bossHealth);
    rect(width/2 - 100, 30, bossHealth, 20)
  }
  //boss first fly past
  if(bossCounter == 180 && boss.position.x < width - bossImg.width) {
    boss.setVelocity(13,0);
  }
  //boss first attack mode
  if(bossCounter > 500 && bossCounter < 30*60) {
    let x = cos(frameCount/50);          
    let y = cos(3*(frameCount/50)+PI/2);
    boss.position.x = map(x, -1,1, 0,width);
    boss.position.y = map(y, -1,1, 0, width);
  }
  //boss returns
  if(bossCounter == 30*60) {
    boss.position.x = width/2;
    boss.position.y = 200;
    boss.setVelocity(0,0);
  }
  //boss starts following maverick
  if(bossCounter > 31*60 && bossCounter < 50*60) { 
    if (boss.position.y < maverick.position.y) {
      boss.position.y+=5;
    }
    if (boss.position.y > maverick.position.y) {
        boss.position.y-=5;
    }
    if (boss.position.x < maverick.position.x) {
        boss.position.x+=5;
    }
    if (boss.position.x > maverick.position.x) {
        boss.position.x-=5;
    }
  }
  //boss returns to middle of screen
  if(bossCounter == 50*60) {
    boss.position.x = width/2;
    boss.position.y = 200;
    boss.setVelocity(0,0);
  }
  //boss does second attack mode
  if(bossCounter > 52*60) { 
    angleMode(DEGREES);
    let centreX = width / 2;
    let centreY = height / 2;
    let radius = 350;
    boss.position.x = (radius * cos(angle)) + centreX;
    boss.position.y = (radius * sin(angle)) + centreY;
    angle+=5;
  }
}

function drawTutorialScreen() {
  background('black');
  imageMode(CORNER);
  image(video, 0, 0,width,height);
  video.play();
}

function drawHighScoreScreen() {
  background('black');
  fill(255);
  textSize(30);
  textAlign(CENTER, CENTER);
  text('High Scores', width/2, 50);
  textAlign(LEFT);
  text("Name", width/4, height/6);
  text("Score", width*(2/3), height/6);
  //display scores from JSON
  for(let i=0; i<highscores.highscores.length; i++) {
    text(highscores.highscores[i].name, width/4, 200 + height/8 * i);
    text(highscores.highscores[i].score, width*(2/3), 200 + height/8 * i);
  }
}

function maverickShip() {
  if (keyIsDown(LEFT_ARROW)) {
    maverick.position.x -= 10;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    maverick.position.x += 10;
  }
  maverick.position.x = constrain(maverick.position.x, 0 + maverickImg.width, width - maverickImg.width);
  if (keyIsDown(UP_ARROW)) {
    maverick.position.y -= 10;
  }
  if (keyIsDown(DOWN_ARROW)) {
    maverick.position.y += 10;
  }
  maverick.position.y = constrain(maverick.position.y, 0 + maverickImg.height, height - maverickImg.height);
  //remove fire sprite from further memory use if off screen
  for(let i=0; i<maverickFire1Arr.length; i++) {
    if(maverickFire1Arr[i].position.y < 0) {
      maverickFire1Arr[i].remove();
    }
  }
  

}

function keyPressed() {
  if (key === ' ' && playTime > 0 && maverick.removed == false && mavFireMode == 1 && currentScreen != MAIN_MENU) {
    //space bar for shooting NORMAL fire
    mavFireSound.setVolume(0.2);
    mavFireSound.play();
    let fire = createSprite(maverick.position.x, maverick.position.y - maverickFire1Img.height - 40, maverickFire1Img.width, maverickFire1Img.height);
    fire.addAnimation('fire', 'assets/maverick/mavfireOne01.png', 'assets/maverick/mavfireOne04.png');
    fire.setVelocity(0, -10);
    maverickFire1Arr.push(fire);
  }
  if (key === ' ' && playTime > 0 && maverick.removed == false && mavFireMode == 2 && currentScreen != MAIN_MENU) {
    //space bar for shooting POWERUP fire
    mavFireTwoSound.setVolume(0.2);
    mavFireTwoSound.play();
    let fire1 = createSprite(maverick.position.x - 3, maverick.position.y - maverickFire1Img.height, maverickFire1Img.width, maverickFire1Img.height);
    fire1.addAnimation('fire', 'assets/maverick/mavfireTwo01.png', 'assets/maverick/mavfireTwo04.png');
    let fire2 = createSprite(maverick.position.x, maverick.position.y - maverickFire1Img.height - 20, maverickFire1Img.width, maverickFire1Img.height);
    fire2.addAnimation('fire', 'assets/maverick/mavfireTwo01.png', 'assets/maverick/mavfireTwo04.png');
    let fire3 = createSprite(maverick.position.x, maverick.position.y - maverickFire1Img.height - 20, maverickFire1Img.width, maverickFire1Img.height);
    fire3.addAnimation('fire', 'assets/maverick/mavfireTwo01.png', 'assets/maverick/mavfireTwo04.png');
    let fire4 = createSprite(maverick.position.x + 3, maverick.position.y - maverickFire1Img.height, maverickFire1Img.width, maverickFire1Img.height);
    fire4.addAnimation('fire', 'assets/maverick/mavfireTwo01.png', 'assets/maverick/mavfireTwo04.png');
    fire1.setVelocity(-5, -10);
    fire2.setVelocity(-1, -10);
    fire3.setVelocity(1, -10);
    fire4.setVelocity(5, -10);
    maverickFire2Arr.push(fire1);
    maverickFire2Arr.push(fire2);
    maverickFire2Arr.push(fire3);
    maverickFire2Arr.push(fire4);
  }
  if (key === ' ' && playTime > 0 && maverick.removed == false && mavFireMode == 3 && currentScreen != MAIN_MENU) {
    //space bar for shooting POWERUP fire
    mavPlasmaSound.setVolume(1);
    mavPlasmaSound.play();
    let fire = createSprite(maverick.position.x, maverick.position.y - maverickFire1Img.height-40, maverickFire1Img.width, maverickFire1Img.height);
    fire.addAnimation('fire', 'assets/maverick/mavPlasma00.png', 'assets/maverick/mavPlasma03.png');    
    fire.setVelocity(0, -20);
    mavPlasmaArr.push(fire);
  }
  return false;
}
