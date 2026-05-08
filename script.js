const player = document.getElementById('player');
const spaceView = document.getElementById('space-view');
const surfaceView = document.getElementById('surface-view');
const contentContainer = document.getElementById('content-container');
const sky = document.getElementById('sky');
const ground = document.getElementById('ground');
const planets = document.querySelectorAll('.planet');

let currentState = 'SPACE';

let x = window.innerWidth / 2;
let y = window.innerHeight - 100; 
let vx = 0; let vy = 0;
const speed = 0.7; const friction = 0.93; 

let collisionImmunity = 120; 

const planetData = {
    'p-home': { ground: '#d35400', sky: 'linear-gradient(to bottom, #1a252c, #f1c40f)' },
    'p-bounty': { ground: '#641e16', sky: 'linear-gradient(to bottom, #111, #e74c3c)' },
    'p-medfo': { ground: '#0b5345', sky: 'linear-gradient(to bottom, #042e27, #2ecc71)' },
    'p-contact': { ground: '#873600', sky: 'linear-gradient(to bottom, #1a1a1a, #e67e22)' }
};

const keys = { w: false, a: false, s: false, d: false };

window.addEventListener('keydown', e => { 
    const key = e.key.toLowerCase();
    if(['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault(); 
    }
    if(keys.hasOwnProperty(key)) keys[key] = true; 
    
    if(e.key === 'Escape' && currentState === 'SURFACE') takeOffToSpace();
});

window.addEventListener('keyup', e => { 
    const key = e.key.toLowerCase();
    if(keys.hasOwnProperty(key)) keys[key] = false; 
});

function gameLoop() {
    if (keys.w || keys.arrowup) vy -= speed;
    if (keys.s || keys.arrowdown) vy += speed;
    if (keys.a || keys.arrowleft) vx -= speed;
    if (keys.d || keys.arrowright) vx += speed;

    vx *= friction; vy *= friction;
    
    x += vx; y += vy;

    if (x < 0) { x = 0; vx = 0; }
    if (x > window.innerWidth - 55) { x = window.innerWidth - 55; vx = 0; }
    if (y > window.innerHeight - 55) { y = window.innerHeight - 55; vy = 0; }
    
    if (currentState === 'SPACE') {
        if (y < 0) { y = 0; vy = 0; } 
    } else if (currentState === 'SURFACE') {
        if (y < 10) { 
            takeOffToSpace(); 
        }
    }

    let angle = Math.atan2(vy, vx) * (180 / Math.PI);
    player.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle + 90}deg)`;

    if (currentState === 'SPACE') {
        if (collisionImmunity > 0) {
            collisionImmunity--;
        } else {
            checkPlanetCollision();
        }
    }

    requestAnimationFrame(gameLoop);
}

function checkPlanetCollision() {
    const px = x + 27.5; const py = y + 27.5; 
    
    planets.forEach(planet => {
        const rect = planet.getBoundingClientRect();
        const cx = rect.left + (rect.width / 2);
        const cy = rect.top + (rect.height / 2);
        
        if (Math.hypot(cx - px, cy - py) < 65) {
            landOnPlanet(planet);
            
            vx = -vx * 2; vy = -vy * 2;
            x += vx * 6; y += vy * 6;
        }
    });
}

function landOnPlanet(planet) {
    currentState = 'SURFACE';
    
    contentContainer.innerHTML = document.getElementById(planet.getAttribute('data-id')).innerHTML;
    
    const env = planetData[planet.id];
    ground.style.background = env.ground;
    sky.style.background = env.sky;

    y = window.innerHeight - 150;
    vx = 0; vy = 0;

    spaceView.classList.remove('active');
    surfaceView.classList.add('active');
}

function takeOffToSpace() {
    currentState = 'SPACE';
    
    collisionImmunity = 60; 
    
    vx = 0; 
    vy = -6; 
    
    x = window.innerWidth / 2;
    y = window.innerHeight - 100;
    
    surfaceView.classList.remove('active');
    spaceView.classList.add('active');
}

gameLoop();
