const player = document.getElementById('player');
const spaceView = document.getElementById('space-view');
const surfaceView = document.getElementById('surface-view');
const contentContainer = document.getElementById('content-container');
const sky = document.getElementById('sky');
const ground = document.getElementById('ground');
const planets = document.querySelectorAll('.planet');

let currentState = 'SPACE';

let x = window.innerWidth / 2;
let y = window.innerHeight - 120; 
let vx = 0; let vy = 0;
const speed = 0.8; const friction = 0.92; 

let collisionImmunity = 120;

const planetData = {
    'p-home': { ground: '#a04000', sky: 'linear-gradient(to bottom, #152238, #d35400, #f1c40f)' },
    'p-bounty': { ground: '#4a2311', sky: 'linear-gradient(to bottom, #0a0a0a, #7b241c, #c0392b)' },
    'p-medfo': { ground: '#0b5345', sky: 'linear-gradient(to bottom, #021a12, #145a32, #2ecc71)' },
    'p-contact': { ground: '#6e2c00', sky: 'linear-gradient(to bottom, #1a1005, #a04000, #e67e22)' }
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
    if (x > window.innerWidth - 60) { x = window.innerWidth - 60; vx = 0; }
    if (y > window.innerHeight - 60) { y = window.innerHeight - 60; vy = 0; }
    
    if (currentState === 'SPACE') {
        if (y < 0) { y = 0; vy = 0; } 
    } else if (currentState === 'SURFACE') {
        if (y < 15) { 
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
    const px = x + 30; const py = y + 30; 
    
    planets.forEach(planet => {
        const rect = planet.getBoundingClientRect();
        const cx = rect.left + (rect.width / 2);
        const cy = rect.top + (rect.height / 2);
        
        if (Math.hypot(cx - px, cy - py) < 80) {
            landOnPlanet(planet);
            
            vx = -vx * 2; vy = -vy * 2;
            x += vx * 8; y += vy * 8;
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
    vy = -8; 
    
    x = window.innerWidth / 2;
    y = window.innerHeight - 150;
    
    surfaceView.classList.remove('active');
    spaceView.classList.add('active');
}

gameLoop();
