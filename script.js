const player = document.getElementById('player');
const exhaust = document.getElementById('engine-exhaust');
const spaceView = document.getElementById('space-view');
const surfaceView = document.getElementById('surface-view');
const contentContainer = document.getElementById('content-container');
const sky = document.getElementById('sky');
const ground = document.getElementById('ground');
const planets = document.querySelectorAll('.planet');
const flightInstructions = document.getElementById('flight-instructions');

let currentState = 'SPACE';

let x = window.innerWidth / 2;
let y = window.innerHeight - 150; 
let vx = 0; let vy = 0;
const speed = 0.9; const friction = 0.92; 

let collisionImmunity = 60;

const planetData = {
    'p-home': { ground: '#a04000', sky: 'linear-gradient(to bottom, #0f1c2e, #d35400, #f1c40f)' },
    'p-bounty': { ground: '#3a1301', sky: 'linear-gradient(to bottom, #050505, #7b241c, #c0392b)' },
    'p-medfo': { ground: '#084035', sky: 'linear-gradient(to bottom, #01120c, #145a32, #2ecc71)' },
    'p-contact': { ground: '#5e2500', sky: 'linear-gradient(to bottom, #120a03, #a04000, #e67e22)' }
};

const keys = { w: false, a: false, s: false, d: false, arrowup: false, arrowdown: false, arrowleft: false, arrowright: false };

window.addEventListener('keydown', e => { 
    const key = e.key.toLowerCase();
    if(keys.hasOwnProperty(key)) {
        keys[key] = true;
        if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
            e.preventDefault(); 
        }
    }
    
    // UI Guide Highlights
    if(document.getElementById('key-' + key)) {
        document.getElementById('key-' + key).classList.add('active');
    }

    if(e.key === 'Escape' && currentState === 'SURFACE') takeOffToSpace();
});

window.addEventListener('keyup', e => { 
    const key = e.key.toLowerCase();
    if(keys.hasOwnProperty(key)) keys[key] = false; 
    
    if(document.getElementById('key-' + key)) {
        document.getElementById('key-' + key).classList.remove('active');
    }
});

function gameLoop() {
    let isMoving = false;
    
    if (keys.w || keys.arrowup) { vy -= speed; isMoving = true; }
    if (keys.s || keys.arrowdown) { vy += speed; isMoving = true; }
    if (keys.a || keys.arrowleft) { vx -= speed; isMoving = true; }
    if (keys.d || keys.arrowright) { vx += speed; isMoving = true; }

    vx *= friction; vy *= friction;
    x += vx; y += vy;

    if(isMoving) exhaust.style.opacity = '1';
    else exhaust.style.opacity = '0';

    if (x < 0) { x = 0; vx = 0; }
    if (x > window.innerWidth - 65) { x = window.innerWidth - 65; vx = 0; }
    
    if (currentState === 'SPACE') {
        if (y < 0) { y = 0; vy = 0; }
        if (y > window.innerHeight - 65) { y = window.innerHeight - 65; vy = 0; }
        flightInstructions.style.display = 'none';

        if (collisionImmunity > 0) {
            collisionImmunity--;
        } else {
            checkPlanetCollision();
        }

    } else if (currentState === 'SURFACE') {
        flightInstructions.style.display = 'block';
        
        const scrollSpeedMultiplier = 2.0;

        if (y > window.innerHeight - 100) { 
            y = window.innerHeight - 100;
            if (vy > 0) {
                surfaceView.scrollBy({ top: vy * scrollSpeedMultiplier, behavior: 'auto' });
            }
        }
        
        if (y < 80) {
            y = 80;
            if (vy < 0) {
                if (surfaceView.scrollTop > 0) {
                    surfaceView.scrollBy({ top: vy * scrollSpeedMultiplier, behavior: 'auto' });
                } else {
                    if (y <= 80 && vy < -1.5) {
                        takeOffToSpace();
                    }
                }
            }
        }
    }

    let angle = Math.atan2(vy, vx) * (180 / Math.PI);
    player.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle + 90}deg)`;

    requestAnimationFrame(gameLoop);
}

function checkPlanetCollision() {
    const px = x + 32.5; const py = y + 32.5; 
    
    planets.forEach(planet => {
        const rect = planet.getBoundingClientRect();
        const cx = rect.left + (rect.width / 2);
        const cy = rect.top + (rect.height / 2);
        
        if (Math.hypot(cx - px, cy - py) < 80) {
            landOnPlanet(planet);
            vx = -vx * 2; vy = -vy * 2;
            x += vx * 10; y += vy * 10;
        }
    });
}

function landOnPlanet(planet) {
    currentState = 'SURFACE';
    surfaceView.scrollTop = 0;
    
    contentContainer.innerHTML = document.getElementById(planet.getAttribute('data-id')).innerHTML;
    
    const env = planetData[planet.id];
    ground.style.background = env.ground;
    sky.style.background = env.sky;

    x = window.innerWidth / 2;
    y = window.innerHeight / 2;
    vx = 0; vy = 0;

    spaceView.classList.remove('active');
    surfaceView.classList.add('active');
}

function takeOffToSpace() {
    currentState = 'SPACE';
    collisionImmunity = 60; 
    
    vx = 0; 
    vy = -12; 
    
    x = window.innerWidth / 2;
    y = window.innerHeight - 150;
    
    surfaceView.classList.remove('active');
    spaceView.classList.add('active');
}

gameLoop();
