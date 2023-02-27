let background, border, paddle, ufo, ball; // images
let gameOverSound, shipCaughtSound, bounceSound; // sounds
let y1 = 0;
let y2 = 1777;
let paddleX = 250;
let paddleY = 470;
let ballSpeedX, ballSpeedY;
let ballX, ballY;
let r, g, b, t = 0;
let UfoX, UfoY;
let point = 0, bounce = 0;
let game = false;

function preload() {
  // images
  background = loadImage('assets/images/starfield.png');
  border = loadImage('assets/images/border.png');
  paddle = loadImage('assets/images/paddle.png');
  ufo = loadImage('assets/images/ufo.png');
  ball = loadImage('assets/images/ball.png');

  // sounds
  gameOverSound = loadSound('assets/sounds/game_over.wav');
  shipCaughtSound = loadSound('assets/sounds/ship_caught.wav');
  bounceSound = loadSound('assets/sounds/space_bounce.wav');
}

function setup() {
  // set the background size of our canvas
  createCanvas(500, 500);

  background.resize(500, 1777);
  ufo.resize(120, 120);
  border.resize(665, 610);
  paddle.resize(120, 35);
  ball.resize(30, 30);

  // set font size to 20
  textSize(20);

  // set UFO position
  UfoX = random(120,380);
  UfoY = random(120,230);
}

function draw() {
  // draw parallax scrolling background
  moveBackgrond();

  // draw paddle
  movePaddle();

  // move ball
  moveBall();

  // display UFo and check for hit
  checkUfoHit();

  // Display points
  displayPoint();

  // Display number of bounces
  displayBounce();

  image(border, -76, -58); // draw border (after border and ball drawn)
}

function displayBall() {
  r = 50*Math.sin(Math.PI + t)+200;
  g = 50*Math.sin(Math.PI + 1.5*t)+200;
  b = 50*Math.sin(Math.PI + 2*t)+200;
  t += 0.01;
  tint(r, g, b);
  image(ball, ballX, ballY);
  noTint();
}

function displayBounce() {
  if (game) {
    fill(188, 64, 248);
    textStyle(BOLDITALIC);

    text(bounce, paddleX-10, paddleY+7);
  }
}

function displayPoint() {
  if (game) {
    fill('#6495ED');
    textStyle(NORMAL);
    if (point < 10) {
      text(point, ballX-5, ballY+7);
    }
    else {
      text(point, ballX-11, ballY+7);
    }
  }
}

function checkUfoHit() {
  if (game) {
    imageMode(CENTER);
    image(ufo, UfoX, UfoY);

    if (dist(UfoX, UfoY, ballX, ballY) < 50 + 15) { // ball / 2
      point++;
      shipCaughtSound.play();
      UfoX = random(120,380);
      UfoY = random(120,230);
    }
    imageMode(CORNER);
  }
}

function constrainBallSpeed() {
  if (ballSpeedX > 0) ballSpeedX = constrain(ballSpeedX, 1.5, 3);
  else ballSpeedX = constrain(ballSpeedX, -1.5, -3);

}

function moveBall() {
  imageMode(CENTER);
  if (game) {
    displayBall();

    // move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // ball falls
    if (ballY >= 500 + 15) {
      game = false; // ball size / 2
      gameOverSound.play();
      UfoX = random(120,380);
      UfoY = random(120,230);
      point = 0;
      bounce = 0;
    }
    // left & right wall bounce
    if (ballX <= 15 + 10 || ballX >= 500 - 15 - 10) {
      ballSpeedX *= -1;
      bounce++;
      bounceSound.play();
    }
    // top wall bounce
    if (ballY <= 15 + 10) {
      ballSpeedY *= -1;
      bounce++;
      bounceSound.play();
    }
    // paddle bounce
    if (ballY >= 445 && ballY <= 448 && ballX >= paddleX-60 && ballX <= paddleX+60) {
      ballSpeedY *= -1;
      ballY -= 1;
      bounce++;
      bounceSound.play();

      if (ballX < paddleX) {
        ballSpeedX *= map(paddleX-ballX, 0, 60, 0.8, 1.8);
      }
      else {
        ballSpeedX *= map(ballX-paddleX, 0, 60, 0.8, 1.8);
      }
      constrainBallSpeed();
    }
  }
  else {
    ballX = 250;
    ballY = 250;
    displayBall();
  }
  imageMode(CORNER);
}

function mouseClicked() {
  if (game == false) {
    game = true;
    setBallSpeed();
  }
}

function setBallSpeed() {
  ballSpeedX = round(random(1.5, 2.5), 1) * (Math.round(Math.random()) * 2 - 1);
  if (ballSpeedX > 0) ballSpeedY = 4 - ballSpeedX;
  else ballSpeedY = 4 + ballSpeedX;
}

function movePaddle() {
  imageMode(CENTER);
  // draw paddle
  image(paddle, paddleX, paddleY);
  // paddle key input logic
  if (keyIsDown('65') && paddleX >= 60 + 10) { // (paddle size / 2) + border
    paddleX -= 2.2;
  }
  if (keyIsDown('68') && paddleX <= 500 - 60 - 10) { // (paddle size / 2) - border
    paddleX += 2.2;
  }
  imageMode(CORNER);
}

function moveBackgrond() {
  image(background, 0, y1);
  image(background, 0, y2);

  y1 += 1.3;
  y2 += 1.3;

  if (y1 >= 1777) {
    y1 = y2 - 1777;
  }
  if (y2 >= 1777) {
    y2 = y1 - 1777;
  }
}
