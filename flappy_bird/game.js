localStorage.removeItem('flappyBirdHighScores');

const canvas = document.getElementById('canvas');
const bgImg = new Image();
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const GRAVITY = 0.4; // w dół
const JUMP_VELOCITY = -6; // skok
const SPEED = 2; // prędkość rur

// dźwięk
function loadAudio(path, loop = false, volume = 1){
  try {
    const a = new Audio(path);
    a.loop = loop;
    a.volume = volume;
    return a;
  } catch(e){
    return null;
  }
}

const sounds = {
  wing: loadAudio('assets/Sound_Effects/wing.wav', false, 0.9) || loadAudio('assets/Sound_Effects/wing.ogg'),
  point: loadAudio('assets/Sound_Effects/point.wav') || loadAudio('assets/Sound_Effects/point.ogg'),
  hit: loadAudio('assets/Sound_Effects/hit.wav') || loadAudio('assets/Sound_Effects/hit.ogg'),
  die: loadAudio('assets/Sound_Effects/die.wav') || loadAudio('assets/Sound_Effects/die.ogg'),
  swoosh: loadAudio('assets/Sound_Effects/swoosh.wav', false, 0.5) || loadAudio('assets/Sound_Effects/swoosh.ogg', false, 0.5)
};

let gameRunning = false;
let gameOver = false;
let score = 0;
let lastFrame = performance.now();
let dt = 16;

bgImg.src = "assets/Flappy_Bird/background-day.png";
const groundImg = new Image(); groundImg.src = 'assets/Flappy_Bird/base.png';
const pipeImg = new Image(); pipeImg.src = 'assets/Flappy_Bird/pipe-green.png';
const birdSprites = [new Image(), new Image(), new Image()];
birdSprites[0].src = 'assets/Flappy_Bird/yellowbird-upflap.png';
birdSprites[1].src = 'assets/Flappy_Bird/yellowbird-midflap.png';
birdSprites[2].src = 'assets/Flappy_Bird/yellowbird-downflap.png';
const pipeTopImg = new Image();
pipeTopImg.src = 'assets/Flappy_Bird/pipe-green.png';
const pipeBottomImg = new Image();
pipeBottomImg.src = 'assets/Flappy_Bird/pipe-green.png';

const BASE_HEIGHT = 112;
let baseX = 0;

let bird = {
    x: 50,
    y: HEIGHT / 2 - 12,
    width: 34,
    height: 24,
    velocity: -1,
    angle: 0,
    animationFrame: 0,
    frameTime: 0,
    currentSprite: birdSprites[0]
};

let pipes = [];

//ptak
function drawBird() {
    ctx.save();
    ctx.translate(bird.x + bird.width/2, bird.y + bird.height/2);
    ctx.rotate(bird.angle);
    ctx.drawImage(bird.currentSprite, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
    ctx.restore();
}

function updateBird() {
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;
    
    let maxAngle = Math.PI / 2; // pi/2 = 90
    let minAngle = -Math.PI / 2;

    bird.angle = Math.min(maxAngle, Math.max(minAngle, bird.velocity / 10)); /// czym szybciej na dół, tym wieksze

    bird.frameTime += dt;
    if (bird.frameTime > 100) {
        bird.animationFrame = (bird.animationFrame + 1) % birdSprites.length;
        bird.currentSprite = birdSprites[bird.animationFrame];
        bird.frameTime = 0;
    }
}

function jump() {
    if (gameOver) return;

    if (!gameRunning) {
        document.getElementById('welcome').classList.add('hidden');
        gameRunning = true;
        if (sounds.swoosh) sounds.swoosh.play();
        gameLoop();
    }
    bird.velocity = JUMP_VELOCITY;
    if (sounds.wing) sounds.wing.play();
}

document.addEventListener('keydown', (e) => {
    if (e.code == 'Space') {
        jump();
        e.preventDefault();
    }
});

//high scores
const HIGH_SCORES_KEY = 'flappyBirdHighScores';

function getHighScores() {
    const scores = JSON.parse(localStorage.getItem(HIGH_SCORES_KEY) || '[]');
    return scores.sort((a, b) => b - a); //
}

function updateHighScores(newScore) {
    let scores = getHighScores();
    scores.push(newScore);
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 5);
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
}

function loadHighScores() {
    console.log("Najlepsze wyniki: ", getHighScores());
}

//rury
const PIPE_WIDTH = 55;
const PIPE_GAP_SIZE = 100;
const PIPE_SPAWN_INTERVAL = 100;
let pipeSpawnCounter = PIPE_SPAWN_INTERVAL;

class Pipe {
    constructor(x) {
        this.x = x;
        this.width = PIPE_WIDTH;
        const minY = 50;
        const maxY = HEIGHT - BASE_HEIGHT - PIPE_GAP_SIZE - 50;
        this.heightTop = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        this.heightBottom = HEIGHT - BASE_HEIGHT - this.heightTop - PIPE_GAP_SIZE;
        this.passed = false;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.heightTop);
        ctx.rotate(Math.PI); 
        ctx.drawImage(pipeTopImg, -this.width / 2, 0, this.width, this.heightTop);
        ctx.restore();

        const yBottom = this.heightTop + PIPE_GAP_SIZE;
        ctx.drawImage(pipeBottomImg, this.x, yBottom, this.width, this.heightBottom);
    }

    update() {
        this.x -= SPEED;
    }
}

function updatePipes() {
    if (pipeSpawnCounter >= PIPE_SPAWN_INTERVAL) {
        pipes.push(new Pipe(WIDTH));
        pipeSpawnCounter = 0;
    }
    pipeSpawnCounter++;

    for (let i = 0; i < pipes.length; i++) {
        const p = pipes[i];
        p.update();
        p.draw();

        if (p.x + p.width < bird.x && !p.passed) {
            score++;
            p.passed = true;
            document.getElementById('score').innerText = score;
            if (sounds.point) sounds.point.play();
        }
    }

    pipes = pipes.filter(p => p.x + p.width > 0);
}

//kolicja i śmierć
function checkCollision() {
    if (bird.y + bird.height >= HEIGHT - BASE_HEIGHT || bird.y <= 0) { //sufit, ziemia
        return true;
    }

    for (let p of pipes) { //rury
        if (bird.x + bird.width > p.x && bird.x < p.x + p.width) {
            if (bird.y < p.heightTop) {
                return true;
            }
            const yBottom = p.heightTop + PIPE_GAP_SIZE;
            if (bird.y + bird.height > yBottom) {
                return true;
            }
        }
    }
    return false;
}

function death() {
    gameRunning = false;
    
    if (sounds.hit) sounds.hit.play();
    
    bird.velocity = 0;
    
    function fallLoop() {
        updateBird();
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        pipes.forEach(p => p.draw()); 
        drawBase(); 
        drawBird();
        
        if (bird.y + bird.height < HEIGHT - BASE_HEIGHT) {
            requestAnimationFrame(fallLoop);
        } else {
            if (sounds.die) sounds.die.play(); 
            bird.y = HEIGHT - BASE_HEIGHT - bird.height;
            drawBird(); 
            const bestBefore = getHighScores()[0] || 0;
            const isNewRecord = score > bestBefore;
            if (isNewRecord) {
                spinThenCongrats();
            } else {
                gameOver = true;
                endGameScreen();
            }
        }
    }
    
    fallLoop();
}

function spinThenCongrats() {
    bird.x = WIDTH / 2 - bird.width / 2;
    bird.y = HEIGHT / 2 - bird.height / 2;
    const start = performance.now();
    const duration = 3000; // 3s
    function spinLoop(ts) {
        const t = ts - start;
        bird.angle = (t / duration) * Math.PI * 4; // kilka obrotów
        ctx.clearRect(0,0,WIDTH,HEIGHT);
        pipes.forEach(p => p.draw());
        drawBase();
        drawBird();
        if (t < duration) requestAnimationFrame(spinLoop);
        else {
            // ekran gratulacyjny
            document.getElementById('congratsScore').innerText = `Twój wynik: ${score}`;
            document.getElementById('congrats').classList.remove('hidden');
            updateHighScores(score);
            setTimeout(()=>{
                document.getElementById('congrats').classList.add('hidden');
                gameOver = true;
                endGameScreen();
            }, 1200);
        }
    }
    requestAnimationFrame(spinLoop);
}

function endGameScreen() {
    document.getElementById('gameover').classList.remove('hidden');
    document.getElementById('finalScore').innerText = `Wynik: ${score}`;
    document.getElementById('bestScore').innerText = `Najlepszy wynik: ${getHighScores()[0] || 0}`;
    document.getElementById('playAgain').onclick = restarGame;
}

function restarGame() {
    score = 0;
    bird.y = HEIGHT / 2;
    bird.velocity = 0;
    bird.angle = 0;
    pipes = [];
    gameOver = false;
    gameRunning = false;
    pipeSpawnCounter = 0;
    document.getElementById('gameover').classList.add('hidden');
    document.getElementById('welcome').classList.remove('hidden');
    document.getElementById('score').innerText = '0';
}

function drawBase() {
    baseX -= SPEED;
    if (baseX <= -WIDTH) {
        baseX = 0;
    }
    
    ctx.drawImage(groundImg, baseX, HEIGHT - BASE_HEIGHT, WIDTH, BASE_HEIGHT);
    ctx.drawImage(groundImg, baseX + WIDTH, HEIGHT - BASE_HEIGHT, WIDTH, BASE_HEIGHT);
}

//gra
let lastTime = performance.now();
function gameLoop() {
    ctx.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);
    
    let now = performance.now();
    dt = now - lastFrame;
    lastFrame = now;

    if (gameOver) return;

    updateBird();

    if (gameRunning) {
        updatePipes();  
        if (checkCollision()) {
             death(); 
             return;
        }
    }

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if (gameRunning) {
        updatePipes();
    }
    drawBase();
    drawBird();

    requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', () => {
    loadHighScores();
    document.getElementById('welcome').classList.remove('hidden');
    document.getElementById('score').innerText = '0'; 
    try { if (sounds.swoosh) sounds.swoosh.play(); } catch(e) {}
});
