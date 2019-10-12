/*Galaga - Assignment 2 - 1701ICT Creative Coding - Due 29 Sep 2019 - 32%
By Sean Bourchier - s5150522 */

//SCREEN STATES
const LOADING = 0,
      MAIN_MENU = 1,
      GAME_PLAY = 2,
      HIGH_SCORE = 3,
      TUTORIAL = 4;
let currentScreen = LOADING;
const LOADING_TIME = 240; // time before switching to MAIN MENU
let loadingCount = 0;
let video; // TUTORIAL video
//GENERIC GAME SETTINGS
let galagaTitleImg; // picture on main menu page
let playSong;
let playSong2;
let playTime = 0; // counter for general play events
let accomplishedCounter = 0; // counter for after finishing game or dying
const AFTER_FINISH_WAIT_TIME = 300; // period of time before automatically switching to HIGH SCORE screen
//HIGH SCOREBOARD AND SCORES SETTINGS
let highscores; // json
let score = 0;
let hitCounter = 0; // used to calculate accuracy
let player; // player object for keeping score
let personToBeat; // used to find which score to place the new score above in json
//BACKGROUND
let starArr = new Array(80);
let comet; // comet sprite
let cometImg;
//MAVERICK - HERO
let maverick; // main hero sprite
let maverickImg;
const MAVERICK_SPEED = 10;
let mavFireMode = 1;
const MAV_FIREONE_SPEED = 12;
let maverickFire1Arr = []; // normal ship fire array of sprites
let maverickFire1Img;
const MAV_FIRETWO_SPEED = 14;
let maverickFire2Arr = []; // spread fire array of sprites
let maverickFire2Img;
const MAV_PLASMA_SPEED = 20;
let mavPlasmaArr = []; // plasma fire array of sprites
let mavPlasmaImg;
let maverickHealth = 200;
let mavFireSound;
let mavFireTwoSound;
let mavPlasmaSound;
let mavHitSound;
let mavDeathSound;
//ENEMYONE
let enemyOne = []; // enemyOne sprites
let enemyOneImg;
let enemyFireOneArr = []; // enemyOne bullets array of sprites
let enemyOneFireSound;
let enemyDeathSound;
//ENEMY TWO
let enemyTwo = []; // enemyTwo sprites
let enemyTwoImg;
let enemyFireTwoArr = []; // enemyTwo bullets array of sprites
let enemyTwoHealthArr = [];
let enemyTwoCounter = 0; // counter for enemyTwo events
//BOSS
let boss; // boss sprite
let bossImg;
let bossCounter = 0; // counter for boss events
let angle = 0; // used for boss movements
//POWERUP
let powerUp; // powerUp sprite
let powerUpSound;
let powerUpCounter = 0;
//BUTTONS
let easyModeButton;
let highScoreButton;
let endGameButton;
let mainMenuButton;
let hardModeButton;
let tutorialButton;

easyModeSettings(); // initial game settings - changed in HARD MODE

function preload() {
  //OUTSIDE GAMEPLAY
  galagaTitleImg = loadImage('assets/galagaTitle.png');
  gameFont = loadFont('assets/Bahamas_Light_Regular.ttf');
  highscores = loadJSON('assets/highscores.json');
  //INSIDE GAMEPLAY
  playSong = loadSound('assets/sound/MachinimaSound.com_-_Escape_from_the_Temple.mp3'); //Escape from the Temple (Royalty Free Music) [CC-BY]
  playSong2 = loadSound('assets/sound/MachinimaSound.com_-_Queen_of_the_Night.mp3'); //Queen of the Night (Royalty Free Music) [CC-BY]
  maverickImg = loadImage('assets/maverick/maverick00.png');
  maverickFire1Img= loadImage('assets/maverick/mavfireOne01.png');
  mavFireSound = loadSound('assets/sound/mavFire.mp3');
  maverickFire2Img = loadImage('assets/maverick/mavfireTwo01.png');
  mavFireTwoSound = loadSound('assets/sound/mavFireTwo.wav');
  mavPlasmaImg = loadImage('assets/maverick/mavPlasma01.png');
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
}

function setup() {
  createCanvas(1000,700);
  imageMode(CENTER);
  stroke('red');
  textFont(gameFont);
  //TUTORIAL VIDEO
  video = createVideo('assets/galagafirstVideoEdit.mp4');
  video.addCue(14.8, videoEnded);
  video.hide();
  video.noLoop();
  //MAIN MENU BUTTONS POSITIONING AND SIZE SETTINGS
  const MAIN_MENU_BUTTONS_X = width/2 - 125;
  const EASY_MODE_BUTTON_Y = 400;
  const MAIN_MENU_BUTTONS_SEPARATION = 65;
  const MAIN_MENU_BUTTONS_W = 250;
  const MAIN_MENU_BUTTONS_H = 50;
  easyModeButton = createButton('Easy Mode');
  easyModeButton.style('font-size', '2em');
  easyModeButton.style("font-family",'Bahamas_Light_Regular');
  easyModeButton.style("background-color", "#003648");
	easyModeButton.style("color", "#00b5e2");
  easyModeButton.position(MAIN_MENU_BUTTONS_X, EASY_MODE_BUTTON_Y);
  easyModeButton.size(MAIN_MENU_BUTTONS_W, MAIN_MENU_BUTTONS_H);
  easyModeButton.mouseClicked(easyModeButtonClicked);
  easyModeButton.hide();
  hardModeButton = createButton('Hard Mode');
  hardModeButton.style('font-size', '2em');
  hardModeButton.style("font-family",'Bahamas_Light_Regular');
  hardModeButton.style("background-color", "#003648");
	hardModeButton.style("color", "#00b5e2");
  hardModeButton.position(MAIN_MENU_BUTTONS_X, EASY_MODE_BUTTON_Y + MAIN_MENU_BUTTONS_SEPARATION);
  hardModeButton.size(MAIN_MENU_BUTTONS_W, MAIN_MENU_BUTTONS_H);
  hardModeButton.mouseClicked(hardModeButtonClicked);
  hardModeButton.hide();
  highScoreButton = createButton('High Scores');
  highScoreButton.style('font-size', '2em');
  highScoreButton.style("font-family",'Bahamas_Light_Regular');
  highScoreButton.style("background-color", "#003648");
	highScoreButton.style("color", "#00b5e2");
  highScoreButton.position(MAIN_MENU_BUTTONS_X, EASY_MODE_BUTTON_Y + MAIN_MENU_BUTTONS_SEPARATION*2);
  highScoreButton.size(MAIN_MENU_BUTTONS_W, MAIN_MENU_BUTTONS_H);
  highScoreButton.mouseClicked(highScoreButtonClicked);
  highScoreButton.hide();
  tutorialButton = createButton('View Tutorial');
  tutorialButton.style('font-size', '2em');
  tutorialButton.style("font-family",'Bahamas_Light_Regular');
  tutorialButton.style("background-color", "#003648");
	tutorialButton.style("color", "#00b5e2");
  tutorialButton.position(MAIN_MENU_BUTTONS_X, EASY_MODE_BUTTON_Y + MAIN_MENU_BUTTONS_SEPARATION*3);
  tutorialButton.size(MAIN_MENU_BUTTONS_W, MAIN_MENU_BUTTONS_H);
  tutorialButton.mouseClicked(tutorialButtonClicked);
  tutorialButton.hide();
  //GAME PLAY BUTTON TO END GAME AND GO TO HIGH SCORE SCREEN
  endGameButton = createButton('End Game');
  endGameButton.style("font-family",'Bahamas_Light_Regular');
  endGameButton.style("background-color", "#003648");
	endGameButton.style("color", "#00b5e2");
  endGameButton.position(width - endGameButton.size().width - 5, 5);
  endGameButton.mouseClicked(endGameButtonClicked);
  endGameButton.hide();
  //HIGH SCORES BUTTON TO RETURN TO MAIN MENU SCREEN
  mainMenuButton = createButton('Back to Main Menu');
  mainMenuButton.style("font-family",'Bahamas_Light_Regular');
  mainMenuButton.style("background-color", "#003648");
	mainMenuButton.style("color", "#00b5e2");
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
    case GAME_PLAY:
      drawGamePlayScreen();
      break;
    case HIGH_SCORE:
      drawHighScoreScreen();
      break;
    case TUTORIAL:
      drawTutorialScreen();
      break;
  }
  if(frameCount == LOADING_TIME) {
    currentScreen = MAIN_MENU;
  }
}

function videoEnded() { //used to change to MAIN MENU screen after video plays
  currentScreen=MAIN_MENU;
  video.stop();
}

function easyModeButtonClicked() { //initiates EASY mode game
  easyModeSettings(); // EASY mode settings are applied
  currentScreen = GAME_PLAY;
  easyModeButton.hide();
  highScoreButton.hide();
  hardModeButton.hide();
  tutorialButton.hide();
  endGameButton.show();
  //start music
  playSong.jump(128, 115);
  playSong.loop();
  //create main ship
  let maverickStartX = width / 2;
  let maverickStartY = height - maverickImg.height - 20;
  maverick = createSprite(maverickStartX, maverickStartY, maverickImg.width, maverickImg.height);
  maverick.addAnimation('mavNormal', 'assets/maverick/maverick00.png', 'assets/maverick/maverick04.png');
  maverick.addAnimation('mavPowerUp', 'assets/maverick/maverickPowerUp00.png', 'assets/maverick/maverickPowerUp04.png');
  maverick.addAnimation('explosion', 'assets/explosion01.png', 'assets/explosion05.png');
  //load background stars
  for(let i=0; i<starArr.length; i++){
    starArr[i] = {
      x : random(0, width),
      y : random(0, height),
      d : random(1,4),
      velY : random(1,4),
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
  //load comet
  let cometStartX = -800;
  let cometStartY = random(height/2, height);
  comet = createSprite(cometStartX, cometStartY, cometImg.width, cometImg.height);
  comet.addAnimation('fly', 'assets/comet00.png', 'assets/comet04.png');
  //load enemyOne sprites
  let enemyOneXOffset = 220;
  let enemyOneXSpacing = 70;
  let enemyOneYStart = 500;
  for(i=0; i<numberOfEnemyOne; i++) {
  enemyOne[i] = createSprite(enemyOneXOffset + i * enemyOneXSpacing, enemyOneYStart, enemyOneImg.width, enemyOneImg.height);
  enemyOne[i].addAnimation('fly', 'assets/enemyOne/enemyOne01.png', 'assets/enemyOne/enemyone02.png');
  enemyOne[i].addAnimation('attract', 'assets/enemyOne/enemyOneAttract01.png', 'assets/enemyOne/enemyoneAttract02.png');
  enemyOne[i].addAnimation('explosion', 'assets/explosion01.png', 'assets/explosion05.png');
  }
  //load enemyTwo sprites
  let enemyTwoXOffset = width + 100;
  let enemyTwoXSpacing = 150;
  let enemyTwoYStart = 200;
  let enemyTwoMass = 100;
  for(i=0; i<numberOfEnemyTwo; i++) {
    enemyTwo[i] = createSprite(enemyTwoXOffset + i * enemyTwoXSpacing, enemyTwoYStart, enemyTwoImg.width, enemyTwoImg.height);
    enemyTwo[i].addAnimation('fly', 'assets/enemyTwo/enemyTwo01.png', 'assets/enemyTwo/enemyTwo02.png');
    enemyTwo[i].addAnimation('explosion', 'assets/explosion01.png', 'assets/explosion05.png');
    enemyTwo[i].mass = enemyTwoMass;
    enemyTwoHealthArr[i] = enemyTwoHealth;
  }
  //load powerUp
  let powerUpStartX = random(0 + powerUpImg.width, width - powerUpImg.width);
  let powerUpStartY = -500;
  powerUp = createSprite(powerUpStartX, powerUpStartY, powerUpImg.width, powerUpImg.height);
  powerUp.addAnimation('fly', 'assets/powerUp01.png', 'assets/powerUp02.png');
  //load boss
  let bossStartX = -1000;
  let bossStartY = random(0 + bossImg.height, height - bossImg.height);
  boss = createSprite(bossStartX, bossStartY, bossImg.width, bossImg.height);
  boss.addAnimation('fly', 'assets/boss/boss00.png', 'assets/boss/boss09.png');
  boss.addAnimation('explosion', 'assets/boss/bossExplosion00.png', 'assets/boss/bossExplosion06.png');
}

function hardModeButtonClicked() { //initiates HARD mode game
  hardModeSettings(); // HARD mode settings are applied
  currentScreen = GAME_PLAY;
  easyModeButton.hide();
  highScoreButton.hide();
  hardModeButton.hide();
  tutorialButton.hide();
  endGameButton.show();
  //start music
  playSong.jump(128, 115);
  playSong.loop();
  //create main ship
  let maverickStartX = width / 2;
  let maverickStartY = height - maverickImg.height - 20;
  maverick = createSprite(maverickStartX, maverickStartY, maverickImg.width, maverickImg.height);
  maverick.addAnimation('mavNormal', 'assets/maverick/maverick00.png', 'assets/maverick/maverick04.png');
  maverick.addAnimation('mavPowerUp', 'assets/maverick/maverickPowerUp00.png', 'assets/maverick/maverickPowerUp04.png');
  maverick.addAnimation('explosion', 'assets/explosion01.png', 'assets/explosion05.png');
  //load background stars
  for(let i=0; i<starArr.length; i++){
    starArr[i] = {
      x : random(0, width),
      y : random(0, height),
      d : random(1,4),
      velY : random(1,7),
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
  //load comet
  let cometStartX = -800;
  let cometStartY = random(height/2, height);
  comet = createSprite(cometStartX, cometStartY, cometImg.width, cometImg.height);
  comet.addAnimation('fly', 'assets/comet00.png', 'assets/comet04.png');
  //load enemyOne sprites
  let enemyOneXOffset = 220;
  let enemyOneXSpacing = 70;
  let enemyOneYStart = 500;
  for(i=0; i<numberOfEnemyOne; i++) {
  enemyOne[i] = createSprite(enemyOneXOffset + i * enemyOneXSpacing, enemyOneYStart, enemyOneImg.width, enemyOneImg.height);
  enemyOne[i].addAnimation('fly', 'assets/enemyOne/enemyOne01.png', 'assets/enemyOne/enemyone02.png');
  enemyOne[i].addAnimation('attract', 'assets/enemyOne/enemyOneAttract01.png', 'assets/enemyOne/enemyoneAttract02.png');
  enemyOne[i].addAnimation('explosion', 'assets/explosion01.png', 'assets/explosion05.png');
  }
  //load enemyTwo sprites
  let numberOfEnemyTwo = 9;
  let enemyTwoXOffset = width + 100;
  let enemyTwoXSpacing = 150;
  let enemyTwoYStart = 200;
  let enemyTwoMass = 100;
  let enemyTwoHealth = 100;
  for(i=0; i<numberOfEnemyTwo; i++) {
    enemyTwo[i] = createSprite(enemyTwoXOffset + i * enemyTwoXSpacing, enemyTwoYStart, enemyTwoImg.width, enemyTwoImg.height);
    enemyTwo[i].addAnimation('fly', 'assets/enemyTwo/enemyTwo01.png', 'assets/enemyTwo/enemyTwo02.png');
    enemyTwo[i].addAnimation('explosion', 'assets/explosion01.png', 'assets/explosion05.png');
    enemyTwo[i].mass = enemyTwoMass;
    enemyTwoHealthArr[i] = enemyTwoHealth;
  }
  //load powerUp
  let powerUpStartX = random(0 + powerUpImg.width, width - powerUpImg.width);
  let powerUpStartY = -500;
  powerUp = createSprite(powerUpStartX, powerUpStartY, powerUpImg.width, powerUpImg.height);
  powerUp.addAnimation('fly', 'assets/powerUp01.png', 'assets/powerUp02.png');
  //load boss
  let bossStartX = -1000;
  let bossStartY = random(0 + bossImg.height, height - bossImg.height);;
  boss = createSprite(bossStartX, bossStartY, bossImg.width, bossImg.height);
  boss.addAnimation('fly', 'assets/boss/boss00.png', 'assets/boss/boss09.png');
  boss.addAnimation('explosion', 'assets/boss/bossExplosion00.png', 'assets/boss/bossExplosion06.png');
}

function highScoreButtonClicked() { //changes to HIGH SCORE screen which displays data from JSON
  currentScreen = HIGH_SCORE;
  highScoreButton.hide();
  easyModeButton.hide();
  hardModeButton.hide();
  tutorialButton.hide();
  mainMenuButton.show();
}

function tutorialButtonClicked() { //changes to TUTORIAL screen which displays the video
  currentScreen = TUTORIAL;
  tutorialButton.hide();
  highScoreButton.hide();
  easyModeButton.hide();
  hardModeButton.hide();
}

function endGameButtonClicked() { //writes score and accuracy to JSON from game, then resets game values
  currentScreen = HIGH_SCORE;
  endGameButton.hide();
  mainMenuButton.show();
  playSong.stop();
  //update player scores and write new score to JSON in correct position in array
  player = {  
    "name": "Maverick",
    "score": 000,
    "accuracy": 0
  }
  player.score = score;
  player.accuracy = round((hitCounter/(maverickFire1Arr.length + maverickFire2Arr.length + mavPlasmaArr.length))*100);
  personToBeat = 5;
  for(let i=highscores.highscores.length - 1; i>-1; i--) { //if score is higher than any score in JSON, it returns the position of the score it beats
    if(player.score > highscores.highscores[i].score) {
      personToBeat = i;
    }
  }
  if(personToBeat < 5) { // inserts new score into JSON array in position above score beaten, removes the last position in JSON array
    highscores.highscores.splice(personToBeat, 0, player);
    highscores.highscores.splice(5, 1);
  }
  //reset values
  playTime = 0;
  mavFireMode = 1;
  maverickHealth = 200;
  enemyTwoCounter = 0;
  enemyTwoHealthArr = [];
  bossHealth = 200;
  bossCounter = 0;
  angle = 0;
  powerUpCounter = 0;
  accomplishedCounter = 0;
  //remove all sprites
  maverick.remove();
  comet.remove();
  powerUp.remove();
  boss.remove();
  for(let i=0; i<maverickFire1Arr.length; i++) {
    maverickFire1Arr[i].remove();
  }
  for(let i=0; i<maverickFire2Arr.length; i++) {
    maverickFire2Arr[i].remove();
  }
  for(let i=0; i<mavPlasmaArr.length; i++) {
    mavPlasmaArr[i].remove();
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
}

function mainMenuButtonClicked() { //go back to MAIN MENU, then resets score
  currentScreen = MAIN_MENU;
  mainMenuButton.hide();
  easyModeButton.show();
  playSong2.stop();
  score = 0;
}

function drawLoadingScreen() { //displays LOADING screen only when page first loaded
  background(0);
  //display main GALAGA image
  const GALAGA_TITLE_X = width/2;
  const GALAGA_TITLE_Y = 150;
  image(galagaTitleImg, GALAGA_TITLE_X, GALAGA_TITLE_Y);
  //display LOADING text
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER)
  text('Loading...', width/2, height/2);
  //display LOADING bar
  const LOADING_X = width/2 - LOADING_TIME/2;
  const LOADING_Y = height - 100;
  const LOADING_W = LOADING_TIME;
  const LOADING_H = 20;
  noFill();
  strokeWeight(3);
  stroke('white');
  rect(LOADING_X, LOADING_Y, LOADING_W, LOADING_H)
  fill('red');
  noStroke();
  rect(LOADING_X, LOADING_Y, frameCount, LOADING_H)
}

function drawMainMenuScreen() { //displays MAIN MENU
  video.stop();
  easyModeButton.show();
  highScoreButton.show();
  hardModeButton.show();
  tutorialButton.show();
  background('black');
  //display main GALAGA image
  const GALAGA_TITLE_X = width/2;
  const GALAGA_TITLE_Y = 150;
  image(galagaTitleImg, GALAGA_TITLE_X, GALAGA_TITLE_Y);
  //display MAIN MENU text
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  const TITLE_HEIGHT = height*(4/9);
  text('MAIN MENU', GALAGA_TITLE_X, TITLE_HEIGHT);
}

function drawGamePlayScreen () { //displays GAME PLAY screen
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
  //initiate comet movement
  comet.position.x += cometSpeed;
  //comet flys past at certain interval
  const COMET_X_RESET = -500;
  let comet_y_reset = random(height*(2/3), height-cometImg.height);
  if(playTime % cometInterval == 0) {
    comet.position.x = COMET_X_RESET;
    comet.position.y = comet_y_reset;
  }
  //collision detection between maverick and comet
  if(comet.displace(maverick)) {
    mavHitSound.play();
    maverickHealth -= cometDamage_toMav;
    if(maverickHealth == 0 && maverick.removed == false) {
      playSong.stop();
      mavDeathSound.setVolume(0.3);
      mavDeathSound.play();
    }
  }
  //display maverick health bar
  const HEALTH_X = width/2 - 100;
  const HEALTH_Y = height - 30;
  const HEALTH_W = 200;
  const HEALTH_H = 20;
  noFill();
  strokeWeight(3);
  stroke('white');
  rect(HEALTH_X, HEALTH_Y, HEALTH_W, HEALTH_H)
  fill('aqua');
  noStroke();
  maverickHealth = constrain(maverickHealth, 0, maverickHealth);
  rect(HEALTH_X, HEALTH_Y, maverickHealth, HEALTH_H)
  //display maverick score
  textSize(30);
  text("Score: " + score, 50,50);
  //function for maverick movements
  maverickShip();
  //function for removing offscreen bullet sprites
  removeOffscreenBullets();
  //enemyOne starts at bottom and moves up
  const ENEMYONE_STOP_POSITION_Y = 100;
  const ENEMYONE_SPEED = 2;
  let enemyOneMovement = sin(playTime / 25) * 5;
  for(let i=0; i<enemyOne.length; i++) {
    if(enemyOne[i].position.y > ENEMYONE_STOP_POSITION_Y) {
      enemyOne[i].position.y -= ENEMYONE_SPEED;
      enemyOne[i].position.x +=  enemyOneMovement;
    }
  }
  //collision detection between maverick and enemyOne
  for(let i=0; i<enemyOne.length; i++) {
    if(maverick.displace(enemyOne[i])) {
      mavHitSound.play();
      maverickHealth -= enemyOneDamage_toMav;
      if(maverickHealth == 0 && maverick.removed == false) {
        playSong.stop();
        mavDeathSound.setVolume(0.3);
        mavDeathSound.play();
      }
    }
  }
  //collision detection between enemyOne and other enemyOne
  for(let i=0; i<enemyOne.length; i++) {
    for(j=0; j<enemyOne.length; j++) {
      enemyOne[i].displace(enemyOne[j]);
    }
  }
  //collision detection between mavfireOne and enemyOne - kills enemyOne
  for(let i=0; i<enemyOne.length; i++){
    for(let j=0; j<maverickFire1Arr.length; j++){
      if(maverickFire1Arr[j].overlap(enemyOne[i])) {
        maverickFire1Arr[j].remove();
        score += scoreEnemyOneKill;
        enemyDeathSound.setVolume(0.3);
        enemyDeathSound.play();
        enemyOne[i].changeAnimation('explosion');
        enemyOne[i].animation.looping = false;
        hitCounter++
        // enemyOne.splice(i, 1) removed because causing Error: Overlap can only be checked between Sprites or groups
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
  //create random enemyOne fire
  if(enemyOne.length != 0 && playTime > enemyOne_StartFire_WaitTime && playTime % enemyOne_Fire_Interval == 0) {
    let enemy = floor(random(0, enemyOne.length));
    let enemyFire = createSprite(enemyOne[enemy].position.x, enemyOne[enemy].position.y, enemyFireOneImg.width, enemyFireOneImg.height);
    enemyFire.addAnimation('enemyfire', 'assets/enemyOne/enemyFireOne00.png', 'assets/enemyOne/enemyFireOne02.png');
    enemyFire.setVelocity(0, enemyOne_Bullet_Speed);
    enemyFireOneArr.push(enemyFire);
    enemyOneFireSound.setVolume(0.2);
    enemyOneFireSound.play();
  }
  //enemyOne starts to fly at Maverick
  if(enemyOne.length != 0 && playTime > enemyOne_StartAttract_WaitTime && playTime % enemyOne_Attract_Interval == 0) {
    let enemy = floor(random(0, enemyOne.length));
    enemyOne[enemy].changeAnimation('attract');
    enemyOne[enemy].attractionPoint(enemyOne_AttractionLevel, maverick.position.x, maverick.position.y);
    enemyOne[enemy].maxSpeed = enemyOne_MaxAttractionSpeed;
    if(enemyOne[enemy].position.y > height) {
      enemyOne[enemy].position.y = 0;
    }
    enemyOne[enemy].position.x = constrain(enemyOne[enemy].position.x, 0, width);
  }
  //collision detection between enemyOne fire and maverick - lose health
  for(let i=0; i<enemyFireOneArr.length; i++){
    if(enemyFireOneArr[i].overlap(maverick)) {
      enemyFireOneArr[i].remove();
      mavHitSound.play();
      maverickHealth -= enemyOne_Fire_Damage_toMav;
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
    bossHealth = 200; //added to avoid maverick and boss dying at the same time
  }
  //if maverick blown up, game over
  if(maverick.animation.looping == false && maverick.animation.getFrame() == 4) {
    maverick.remove();
    textAlign(CENTER, CENTER);
    textSize(60);
    fill('red');
    text('GAME OVER', width/2, height/2);
    text('Maverick, your score is ' + score, width/2, height/3);
    accomplishedCounter++;
  }
  //enemyTwo show up when enemyOne dies, moves left then right based on time
  if(enemyOne.length == 0) {
    enemyTwoCounter++;
    let enemyTwoSpeed = 5;
    const ENEMYTWO_COUNTER_RESET_TIME = 800;
    const ENEMYTWO_REVERSE_DIRECTION_TIME = 400;
    if(enemyTwoCounter > ENEMYTWO_COUNTER_RESET_TIME) {
      enemyTwoCounter = 0;
    }
    if(enemyTwoCounter > ENEMYTWO_REVERSE_DIRECTION_TIME) {
      enemyTwoSpeed = -enemyTwoSpeed;
    }
    for(i=0; i<enemyTwo.length; i++) {
      enemyTwo[i].position.x -= enemyTwoSpeed;
    }
  }
  //collision detection between maverick and enemyTwo
  for(let i=0; i<enemyTwo.length; i++) {
    if(maverick.displace(enemyTwo[i])) {
      mavHitSound.play();
      maverickHealth -= enemyTwoDamage_toMav;
      if(maverickHealth == 0 && maverick.removed == false) {
        playSong.stop();
        mavDeathSound.setVolume(0.3);
        mavDeathSound.play();
      }
    }
  }
  //collision detection between enemyOne and other enemyOne
  for(let i=0; i<enemyTwo.length; i++) {
    for(j=0; j<enemyTwo.length; j++) {
      enemyTwo[i].displace(enemyTwo[j]);
    }
  }
  //collision detection between mavFireOne and EnemyTwo - bounces and shrinks enemyTwo, enemyTwo loses health
  const ENEMYTWO_FRICTION = 0.01;
  for(let i=0; i<enemyTwo.length; i++){
    for(let j=0; j<maverickFire1Arr.length; j++){
      if(maverickFire1Arr[j].bounce(enemyTwo[i])) {
        enemyTwo[i].position.y = constrain(enemyTwo[i].position.y, 20, height);
        enemyTwo[i].scale -= enemyTwo_ShrinkRate;
        enemyTwo[i].friction = ENEMYTWO_FRICTION;
        enemyTwoHealthArr[i] -= mavFireOneDamage_toEnemyTwo;
        score += scoreEnemyTwoHit;
        maverickFire1Arr[j].remove();
        hitCounter++
      }      
    }
  }
  //collision detection between mavFireTwo and EnemyTwo - bounces and shrinks enemyTwo, enemyTwo loses health
  for(let i=0; i<enemyTwo.length; i++){
    for(let j=0; j<maverickFire2Arr.length; j++){
      if(maverickFire2Arr[j].bounce(enemyTwo[i])) {
        enemyTwo[i].position.y = constrain(enemyTwo[i].position.y, 20, height);
        enemyTwo[i].scale -= enemyTwo_ShrinkRate;
        enemyTwo[i].friction = ENEMYTWO_FRICTION;
        enemyTwoHealthArr[i] -= mavFireTwoDamage_toEnemyTwo;
        score += scoreEnemyTwoHit;
        maverickFire2Arr[j].remove();
        hitCounter++
      }      
    }
  }
  //collision detection between mavPlasma and EnemyTwo - displaces and shrinks enemyTwo, enemyTwo loses health
  for(let i=0; i<enemyTwo.length; i++){
    for(let j=0; j<mavPlasmaArr.length; j++){
      if(mavPlasmaArr[j].displace(enemyTwo[i])) {
        enemyTwo[i].position.y = constrain(enemyTwo[i].position.y, 20, height);
        enemyTwo[i].scale -= enemyTwo_ShrinkRate;
        enemyTwo[i].friction = ENEMYTWO_FRICTION;
        enemyTwoHealthArr[i] -= mavPlasmaDamage_toEnemyTwo;
        score += scoreEnemyTwoHit;
      }      
    }
  }
  //enemyTwo loses all health - enemyTwo explodes
  for(let i=0; i<enemyTwo.length; i++){
    if(enemyTwoHealthArr[i] <= 0) {
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
      enemyTwoHealthArr.splice(i, 1);
    }
  }
  //create enemyTwo fire
  if(enemyOne.length == 0 && enemyTwo.length != 0 && playTime % enemyTwo_Fire_Interval == 0) {
    let enemy = floor(random(0, enemyTwo.length)); // random enemy still present in the array
    let enemyFire = createSprite(enemyTwo[enemy].position.x, enemyTwo[enemy].position.y, enemyFireTwoImg.width, enemyFireTwoImg.height);
    enemyFire.addAnimation('enemyfire', 'assets/enemyTwo/enemyFireTwo00.png', 'assets/enemyTwo/enemyFireTwo02.png');
    enemyFire.setVelocity(0, enemyTwo_Bullet_Speed);
    enemyFireTwoArr.push(enemyFire);
    enemyOneFireSound.setVolume(0.1);
    enemyOneFireSound.play();
  }
  //collision detection between enemyTwo fire and maverick - lose health
  for(let i=0; i<enemyFireTwoArr.length; i++){
    if(enemyFireTwoArr[i].overlap(maverick) && maverick.removed == false) {
      enemyFireTwoArr[i].remove();
      mavHitSound.play();
      maverickHealth -= enemyTwo_Fire_Damage_toMav;
      if(maverickHealth == 0 && maverick.removed == false) {
        playSong.stop();
        mavDeathSound.setVolume(0.3);
        mavDeathSound.play();
      }
    }      
  }
  //powerUp comes down after all enemyOne dies
  const POWERUP_SPEED = 6;
  if(enemyOne.length == 0 && playTime % powerUp_drop_interval == 0) {
    powerUp.setVelocity(0, POWERUP_SPEED);
  }
  //collision detection between powerUp and maverick, changes maverick fire mode
  let powerUpStartX = random(0 + powerUpImg.width, width - powerUpImg.width);
  let powerUpStartY = -500;
  if(maverick.overlap(powerUp)) {
    powerUpSound.play();
    powerUp.remove();
    powerUp = createSprite(powerUpStartX, powerUpStartY, powerUpImg.width, powerUpImg.height);
    powerUp.addAnimation('fly', 'assets/powerUp01.png', 'assets/powerUp02.png');
    mavFireMode = round(random(2,3));
  }
  //if powerup isn't collected, time out of screen extended
  if(enemyOne.length == 0 && powerUp.position.y > height) {
    powerUp.position.y = powerUpStartY*powerUp_miss_penalty;
    powerUp.position.x = powerUpStartX;
  }
  //maverick powerUp fire mode only lasts for a limited amount of time  
  if(mavFireMode == 2 || mavFireMode == 3 && maverickHealth > 0) {
    maverick.changeAnimation('mavPowerUp');
    powerUpCounter++
    if(powerUpCounter == powerUpDuration) {
      mavFireMode = 1;
      powerUpCounter = 0;
    }
  }
  //to return mav to normal after powerUp finishes
  if(mavFireMode == 1 && maverickHealth > 0) {
    maverick.changeAnimation('mavNormal');
  }
  //collision detection between maverick and Boss
  if(boss.displace(maverick)) {
    mavHitSound.play();
    maverickHealth -= bossDamage_toMav;
    if(maverickHealth == 0 && maverick.removed == false) {
      playSong.stop();
      mavDeathSound.setVolume(0.3);
      mavDeathSound.play();
    }
  }
  //collision detection between mavFireOne and Boss
  for(let i=0; i<maverickFire1Arr.length; i++){
    if(maverickFire1Arr[i].overlap(boss)) {
      bossHealth -= mavFireOneDamage_toBoss;
      score += scoreBossHit_mavFireOne;
      maverickFire1Arr[i].remove();
      hitCounter++
      // boss explodes
      if(bossHealth <= 0) {
        enemyDeathSound.setVolume(0.3);
        enemyDeathSound.play();
      }
    }      
  }
  //if boss loses all health, blowup animation
  if(bossHealth <= 0) {
    boss.changeAnimation('explosion');
    boss.animation.looping = false;
    maverickHealth = 200;
  }
  //collision detection between mavFireTwo and Boss
  for(let i=0; i<maverickFire2Arr.length; i++){
    if(maverickFire2Arr[i].overlap(boss)) {
      bossHealth -= bossDamage_mavFireTwo;
      score += scoreBossHit_mavFireTwo;
      maverickFire2Arr[i].remove();
      hitCounter++
        //boss explodes
      if(bossHealth <= 0) {
        enemyDeathSound.setVolume(0.3);
        enemyDeathSound.play();
      }
    }      
  }
  //collision detection between mavFirePlasma and Boss
  for(let i=0; i<mavPlasmaArr.length; i++){
    if(mavPlasmaArr[i].displace(boss)) {
      bossHealth -= bossDamage_mavFirePlasma;
      score += scoreBossHit_mavFirePlasma;
      // boss explodes
      if(bossHealth <= 0) {
        enemyDeathSound.setVolume(0.3);
        enemyDeathSound.play();
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
    text('Maverick, your score is ' + score, width/2, height/3);
    accomplishedCounter++;
  }
  //so playSong stop and playSong2 start don't conflict
  if(accomplishedCounter == 1 && boss.animation.looping == false) {
    playSong2.jump(32,158);
  }
  //after a certain time the screen automatically changes to the HIGH SCORE screen
  if(accomplishedCounter == AFTER_FINISH_WAIT_TIME) {
    endGameButtonClicked();
  }
  //if all of enemyTwo die, the boss comes out
  if(enemyTwo.length == 0 && playTime > 10) {
    bossCounter++
  }
  //display boss health
  if(bossCounter > 0) {
    const BOSSHEALTH_Y = 30;
    noFill();
    strokeWeight(3);
    stroke('white');
    rect(HEALTH_X, BOSSHEALTH_Y, 200, HEALTH_H)
    fill(0,255,0);
    noStroke();
    bossHealth = constrain(bossHealth, 0, bossHealth);
    rect(HEALTH_X, BOSSHEALTH_Y, bossHealth, HEALTH_H)
  }
  //boss first fly past
  if(bossCounter == bossStartTime && boss.position.x < width - bossImg.width) {
    boss.setVelocity(bossInitialSpeed, 0);
  }
  //boss first attack mode
  if(bossCounter > bossFirstAttackStart && bossCounter < bossFirstAttackStop) {
    let x = cos(frameCount/50);          
    let y = cos(3*(frameCount/50)+PI/2);
    boss.position.x = map(x, -1,1, 0,width);
    boss.position.y = map(y, -1,1, 0, width);
  }
  //boss returns to middle
  if(bossCounter == bossFirstAttackStop) {
    boss.position.x = width/2;
    boss.position.y = 200;
    boss.setVelocity(0,0);
  }
  //boss starts following maverick
  if(bossCounter > bossFollowStart && bossCounter < bossFollowStop) { 
    if (boss.position.y < maverick.position.y) {
      boss.position.y += bossFollowSpeed;
    }
    if (boss.position.y > maverick.position.y) {
        boss.position.y -= bossFollowSpeed;
    }
    if (boss.position.x < maverick.position.x) {
        boss.position.x += bossFollowSpeed;
    }
    if (boss.position.x > maverick.position.x) {
        boss.position.x -= bossFollowSpeed;
    }
  }
  //boss returns to middle of screen
  if(bossCounter == bossFollowStop) {
    boss.position.x = width/2;
    boss.position.y = 200;
    boss.setVelocity(0,0);
  }
  //boss does final attack mode
  if(bossCounter > bossFinalAttackStart) { 
    angleMode(DEGREES);
    let centreX = width / 2;
    let centreY = height / 2;
    let radius = 350;
    boss.position.x = (radius * cos(angle)) + centreX;
    boss.position.y = (radius * sin(angle)) + centreY;
    angle += bossFinalAttackMode_speed;
  }
}

function drawTutorialScreen() { //displays TUTORIAL video
  background('black');
  imageMode(CORNER);
  image(video, 0, 0, width, height);
  video.play();
}

function drawHighScoreScreen() { //displays HIGH SCORE screen
  //used for positioning of JSON data
  const LEFT_COLUMN = width/4;
  const MIDDLE_COLUMN = width/2;
  const RIGHT_COLUMN = width*(3/4);
  const HEADINGS_HEIGHT = height/6;
  const SCORE_HEIGHT_OFFSET = 200;
  const SCORE_SPACING = height/8;
  //HIGH SCORES screen title
  background('black');
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text('HIGH SCORES', MIDDLE_COLUMN, 50);
  //Headings for JSON Data
  textSize(40);
  textAlign(CENTER, CENTER);
  text("NAME", LEFT_COLUMN, HEADINGS_HEIGHT);
  text("SCORE", MIDDLE_COLUMN, HEADINGS_HEIGHT);
  text("ACCURACY", RIGHT_COLUMN, HEADINGS_HEIGHT);
  textSize(35);
  //display scores from JSON in order from highest score to lowest score, including any recent scores added to the scoreboard
  for(let i=0; i<highscores.highscores.length; i++) {
    text(highscores.highscores[i].name, LEFT_COLUMN, SCORE_HEIGHT_OFFSET + SCORE_SPACING * i);
    text(highscores.highscores[i].score, MIDDLE_COLUMN, SCORE_HEIGHT_OFFSET + SCORE_SPACING * i);
    text(highscores.highscores[i].accuracy + ' %', RIGHT_COLUMN, SCORE_HEIGHT_OFFSET + SCORE_SPACING * i);
  }
  //highlight last score to make scoreboard in blue
  if(personToBeat < 5) {
    stroke('blue');
    text(highscores.highscores[personToBeat].name, LEFT_COLUMN, SCORE_HEIGHT_OFFSET + SCORE_SPACING * personToBeat);
    text(highscores.highscores[personToBeat].score, MIDDLE_COLUMN, SCORE_HEIGHT_OFFSET + SCORE_SPACING * personToBeat);
    text(highscores.highscores[personToBeat].accuracy + ' %', RIGHT_COLUMN, SCORE_HEIGHT_OFFSET + SCORE_SPACING * personToBeat);
  }
}

function maverickShip() { //maverick movement controls
  //X POSITION MOVEMENT AND CONSTRAIN TO CANVAS ONLY
  if (keyIsDown(LEFT_ARROW)) {
    maverick.position.x -= MAVERICK_SPEED;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    maverick.position.x += MAVERICK_SPEED;
  }
  maverick.position.x = constrain(maverick.position.x, 0 + maverickImg.width, width - maverickImg.width);
  //Y POSITION MOVEMENT AND CONSTRAIN TO CANVAS ONLY
  if (keyIsDown(UP_ARROW)) {
    maverick.position.y -= MAVERICK_SPEED;
  }
  if (keyIsDown(DOWN_ARROW)) {
    maverick.position.y += MAVERICK_SPEED;
  }
  maverick.position.y = constrain(maverick.position.y, 0 + maverickImg.height, height - maverickImg.height);
}

function removeOffscreenBullets() {  //remove all off-screen bullet sprites so no longer updated in memory
  //remove maverick Fire One
  for(let i=0; i<maverickFire1Arr.length; i++) {
    if(maverickFire1Arr[i].position.y < 0) {
      maverickFire1Arr[i].remove();
    }
  }
  //remove maverick Fire Two
  for(let i=0; i<maverickFire2Arr.length; i++) {
    if(maverickFire2Arr[i].position.y < 0) {
      maverickFire2Arr[i].remove();
    }
  }
  //remove maverick Fire Plasma
  for(let i=0; i<mavPlasmaArr.length; i++) {
    if(mavPlasmaArr[i].position.y < 0) {
      mavPlasmaArr[i].remove();
    }
  }
  //remove enemyOne fire
  for(let i=0; i<enemyFireOneArr.length; i++) {
    if(enemyFireOneArr[i].position.y > height) {
      enemyFireOneArr[i].remove();
    }
  }
  //remove enemyTwo fire
  for(let i=0; i<enemyFireTwoArr.length; i++) {
    if(enemyFireTwoArr[i].position.y > height) {
      enemyFireTwoArr[i].remove();
    }
  }
}

function keyPressed() { //maverick shooting from space bar
  //SPACE BAR SHOOTING FOR MAV FIRE ONE
  if (key === ' ' && playTime > 0 && maverick.removed == false && mavFireMode == 1 && currentScreen != MAIN_MENU) {
    mavFireSound.setVolume(0.2);
    mavFireSound.play();
    let fire = createSprite(maverick.position.x, maverick.position.y - maverickFire1Img.height - 40, maverickFire1Img.width, maverickFire1Img.height);
    fire.addAnimation('fire', 'assets/maverick/mavfireOne01.png', 'assets/maverick/mavfireOne04.png');
    fire.setVelocity(0, -MAV_FIREONE_SPEED);
    maverickFire1Arr.push(fire);
  }
  //SPACE BAR SHOOTING FOR MAV FIRE TWO
  if (key === ' ' && playTime > 0 && maverick.removed == false && mavFireMode == 2 && currentScreen != MAIN_MENU) {
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
    fire1.setVelocity(-5, -MAV_FIRETWO_SPEED);
    fire2.setVelocity(-1, -MAV_FIRETWO_SPEED);
    fire3.setVelocity(1, -MAV_FIRETWO_SPEED);
    fire4.setVelocity(5, -MAV_FIRETWO_SPEED);
    maverickFire2Arr.push(fire1);
    maverickFire2Arr.push(fire2);
    maverickFire2Arr.push(fire3);
    maverickFire2Arr.push(fire4);
  }
  //SPACE BAR SHOOTING FOR MAV FIRE THREE (PLASMA)
  if (key === ' ' && playTime > 0 && maverick.removed == false && mavFireMode == 3 && currentScreen != MAIN_MENU) {
    mavPlasmaSound.setVolume(1);
    mavPlasmaSound.play();
    let fire = createSprite(maverick.position.x, maverick.position.y - maverickFire1Img.height-40, maverickFire1Img.width, maverickFire1Img.height);
    fire.addAnimation('fire', 'assets/maverick/mavPlasma01.png', 'assets/maverick/mavPlasma03.png');    
    fire.setVelocity(0, -MAV_PLASMA_SPEED);
    mavPlasmaArr.push(fire);
    hitCounter++
  }
  return false;
}

function easyModeSettings() {  //EASY mode game settings
//COMET
cometSpeed = 8;
cometInterval = 600;
cometDamage_toMav = 1;
//ENEMY ONE
numberOfEnemyOne = 8;
scoreEnemyOneKill = 5;
enemyOne_StartFire_WaitTime = 120;
enemyOne_Fire_Interval = 45;
enemyOne_StartAttract_WaitTime = 120;
enemyOne_Attract_Interval = 90;
enemyOne_AttractionLevel = 3;
enemyOne_MaxAttractionSpeed = 5;
enemyOne_Bullet_Speed = 8;
enemyOneDamage_toMav = 30;
enemyOne_Fire_Damage_toMav = 20;
//ENEMY TWO
numberOfEnemyTwo = 9;
enemyTwoHealth = 100;
enemyTwo_ShrinkRate = 0.1;
scoreEnemyTwoHit = 5;
mavFireOneDamage_toEnemyTwo = 20;
mavFireTwoDamage_toEnemyTwo = 20;
mavPlasmaDamage_toEnemyTwo = 10;
enemyTwo_Fire_Interval = 30;
enemyTwo_Bullet_Speed = 12;
enemyTwoDamage_toMav = 40;
enemyTwo_Fire_Damage_toMav = 40;
//POWERUP
powerUp_drop_interval = 600;
powerUp_miss_penalty = 5;
powerUpDuration = 300;
//BOSS
bossHealth = 200;
bossDamage_toMav = 3;
mavFireOneDamage_toBoss = 4;
scoreBossHit_mavFireOne = 10;
bossDamage_mavFireTwo = 8;
scoreBossHit_mavFireTwo = 15;
bossDamage_mavFirePlasma = 4;
scoreBossHit_mavFirePlasma = 10;
bossStartTime = 180;
bossInitialSpeed = 13;
bossFirstAttackStart = 500;
bossFirstAttackStop = 30*60;
bossFollowStart = 31*60;
bossFollowStop = 50*60;
bossFollowSpeed = 3;
bossFinalAttackStart = 55*60;
bossFinalAttackMode_speed = 2;
}

function hardModeSettings() { //HARD mode game settings
//COMET
cometSpeed = 15;
cometInterval = 500;
cometDamage_toMav = 2;
//ENEMY ONE
numberOfEnemyOne = 9;
scoreEnemyOneKill = 5;
enemyOne_StartFire_WaitTime = 60;
enemyOne_Fire_Interval = 25;
enemyOne_StartAttract_WaitTime = 120;
enemyOne_Attract_Interval = 45;
enemyOne_AttractionLevel = 5;
enemyOne_MaxAttractionSpeed = 5;
enemyOne_Bullet_Speed = 9;
enemyOneDamage_toMav = 50;
enemyOne_Fire_Damage_toMav = 30;
//ENEMY TWO
numberOfEnemyTwo = 10;
enemyTwoHealth = 100;
enemyTwo_ShrinkRate = 0.02;
scoreEnemyTwoHit = 10;
mavFireOneDamage_toEnemyTwo = 5;
mavFireTwoDamage_toEnemyTwo = 8;
mavPlasmaDamage_toEnemyTwo = 8;
enemyTwo_Fire_Interval = 30;
enemyTwo_Bullet_Speed = 14;
enemyTwoDamage_toMav = 70;
enemyTwo_Fire_Damage_toMav = 50;
//POWERUP
powerUp_drop_interval = 600;
powerUp_miss_penalty = 5;
powerUpDuration = 300;
//BOSS
bossHealth = 200;
bossDamage_toMav = 6;
mavFireOneDamage_toBoss = 2;
scoreBossHit_mavFireOne = 15;
bossDamage_mavFireTwo = 4;
scoreBossHit_mavFireTwo = 20;
bossDamage_mavFirePlasma = 4;
scoreBossHit_mavFirePlasma = 15;
bossStartTime = 180;
bossInitialSpeed = 20;
bossFirstAttackStart = 500;
bossFirstAttackStop = 30*60;
bossFollowStart = 31*60;
bossFollowStop = 50*60;
bossFollowSpeed = 6;
bossFinalAttackStart = 55*60;
bossFinalAttackMode_speed = 5;
}