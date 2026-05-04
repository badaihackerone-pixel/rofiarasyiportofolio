document.addEventListener('DOMContentLoaded', () => {
  const boardElement = document.getElementById('rpg-board');
  const messageElement = document.getElementById('game-message');
  
  if (!boardElement) return; // Hanya eksekusi jika berada di halaman Contact

  const gridSize = 10;
  let playerPos = { x: 0, y: 0 }; // Kordinat awal (kiri atas)

  // Mapping objek eksplorasi (POI - Points of Interest)
  const items = [
    { id: 'linkedin', x: 2, y: 3, icon: '💼', name: 'LinkedIn', desc: 'Rofi Arasyi', url: 'https://www.linkedin.com/in/rofi-arasyi' },
    { id: 'instagram', x: 8, y: 1, icon: '📸', name: 'Instagram', desc: '@rofiarasyi', url: 'https://instagram.com/rofiarasyi' },
    { id: 'github', x: 1, y: 8, icon: '🐙', name: 'GitHub', desc: 'Repositories', url: 'https://github.com/badaihackerone-pixel' },
    { id: 'hmte', x: 7, y: 7, icon: '🎨', name: 'HMTE Works', desc: 'Design Portfolio', url: 'portfolio.html' },
    { id: 'bug', x: 5, y: 5, icon: '🐛', name: 'Bug Bounty', desc: 'Vulnerability Reports', url: 'portfolio.html' }
  ];

  function renderBoard() {
    boardElement.innerHTML = '';
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        // Cek apakah ada item di koordinat ini
        const item = items.find(i => i.x === x && i.y === y);
        if (item) {
          cell.textContent = item.icon;
        }

        // Cek apakah player di koordinat ini
        if (playerPos.x === x && playerPos.y === y) {
          const playerMarker = document.createElement('div');
          playerMarker.classList.add('player');
          cell.innerHTML = ''; // Timpa ikon item jika player menginjaknya
          cell.appendChild(playerMarker);
        }

        boardElement.appendChild(cell);
      }
    }
    checkCollision();
  }

  function checkCollision() {
    const item = items.find(i => i.x === playerPos.x && i.y === playerPos.y);
    if (item) {
      messageElement.innerHTML = `> Target Ditemukan: <strong>${item.name}</strong> (${item.desc}) <br> <a href="${item.url}" target="_blank">Akses Entitas [Klik Disini]</a>`;
    } else {
      messageElement.innerHTML = 'Gunakan <strong>W, A, S, D</strong> atau <strong>Arrow Keys</strong> untuk menjelajah grid.';
    }
  }

  // Event Listener Input Keyboard
  window.addEventListener('keydown', (e) => {
    // Mencegah default scrolling saat main game dengan arrow keys
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight", "w", "a", "s", "d"].indexOf(e.key) > -1) {
        e.preventDefault();
    }

    switch(e.key.toLowerCase()) {
      case 'arrowup': case 'w':
        if (playerPos.y > 0) playerPos.y--;
        break;
      case 'arrowdown': case 's':
        if (playerPos.y < gridSize - 1) playerPos.y++;
        break;
      case 'arrowleft': case 'a':
        if (playerPos.x > 0) playerPos.x--;
        break;
      case 'arrowright': case 'd':
        if (playerPos.x < gridSize - 1) playerPos.x++;
        break;
    }
    renderBoard();
  });

  // Render awal
  renderBoard();
});