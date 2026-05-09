const player = document.getElementById('player');
const exhaust = document.getElementById('engine-exhaust');
const spaceView = document.getElementById('space-view');
const surfaceView = document.getElementById('surface-view');
const contentContainer = document.getElementById('content-container');
const sky = document.getElementById('sky');
const ground = document.getElementById('ground');
const planets = document.querySelectorAll('.planet');

const guideTop = document.getElementById('surface-guide-top');
const guideBottom = document.getElementById('surface-guide-bottom');

let currentState = 'SPACE';

let x = window.innerWidth / 2;
let y = window.innerHeight - 150; 
let vx = 0; let vy = 0;
const speed = 0.95; const friction = 0.92; 

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
    
    if(document.getElementById('key-' + key)) {
        document.getElementById('key-' + key).classList.add('active');
    }
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

    if(isMoving || Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) {
        exhaust.style.opacity = '1';
    } else {
        exhaust.style.opacity = '0';
    }

    if (x < 0) { x = 0; vx = 0; }
    if (x > window.innerWidth - 75) { x = window.innerWidth - 75; vx = 0; }
    
    if (currentState === 'SPACE') {
        if (y < 0) { y = 0; vy = 0; }
        if (y > window.innerHeight - 75) { y = window.innerHeight - 75; vy = 0; }
        
        guideTop.style.display = 'none';
        guideBottom.style.display = 'none';

        if (collisionImmunity > 0) {
            collisionImmunity--;
        } else {
            checkPlanetCollision();
        }

    } else if (currentState === 'SURFACE') {
        const scrollSpeedMultiplier = 2.5;

        const isAtTop = surfaceView.scrollTop === 0;
        const isAtBottom = surfaceView.scrollHeight - surfaceView.scrollTop <= surfaceView.clientHeight + 10;

        if (isAtTop) guideTop.style.display = 'block'; else guideTop.style.display = 'none';
        if (!isAtBottom) guideBottom.style.display = 'block'; else guideBottom.style.display = 'none';

        if (y > window.innerHeight - 120) { 
            y = window.innerHeight - 120;
            if (vy > 0) {
                surfaceView.scrollBy({ top: vy * scrollSpeedMultiplier, behavior: 'auto' });
            }
        }
        
        if (y < 100) {
            y = 100;
            if (vy < 0) {
                if (surfaceView.scrollTop > 0) {
                    surfaceView.scrollBy({ top: vy * scrollSpeedMultiplier, behavior: 'auto' });
                } else {
                    if (y <= 100 && vy < -1.5) {
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
    const px = x + 37.5; const py = y + 37.5; 
    
    planets.forEach(planet => {
        const rect = planet.getBoundingClientRect();
        const cx = rect.left + (rect.width / 2);
        const cy = rect.top + (rect.height / 2);
        
        if (Math.hypot(cx - px, cy - py) < 85) {
            landOnPlanet(planet);
            vx = -vx * 2; vy = -vy * 2;
            x += vx * 12; y += vy * 12;
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
    vy = -15; 
    
    x = window.innerWidth / 2;
    y = window.innerHeight - 150;
    
    surfaceView.classList.remove('active');
    spaceView.classList.add('active');
}

gameLoop();
