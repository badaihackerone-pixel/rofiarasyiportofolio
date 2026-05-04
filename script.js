document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('game-board');
  if (!gameBoard) return; // Hanya berjalan di halaman contact/game

  const scoreDisplay = document.getElementById('score');
  const timeDisplay = document.getElementById('time');
  const startBtn = document.getElementById('start-btn');
  
  let score = 0;
  let timeLeft = 20; // Waktu permainan 20 detik
  let gameInterval;
  let bugInterval;
  let isPlaying = false;

  startBtn.addEventListener('click', startGame);

  function startGame() {
    if (isPlaying) return;
    isPlaying = true;
    score = 0;
    timeLeft = 20;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    gameBoard.innerHTML = '';
    startBtn.style.display = 'none';

    gameInterval = setInterval(updateTime, 1000);
    spawnBug(); // Mulai memunculkan bug
  }

  function updateTime() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }

  function spawnBug() {
    if (!isPlaying) return;

    const bug = document.createElement('div');
    bug.classList.add('bug');
    bug.textContent = '🐛'; // Ikon bug

    // Hitung posisi acak di dalam game-board
    const maxX = gameBoard.clientWidth - 40;
    const maxY = gameBoard.clientHeight - 40;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    bug.style.left = `${randomX}px`;
    bug.style.top = `${randomY}px`;

    // Event listener untuk menangkap bug
    bug.addEventListener('mousedown', function() {
      score++;
      scoreDisplay.textContent = score;
      this.remove();
    });

    gameBoard.appendChild(bug);

    // Bug menghilang sendiri setelah 800ms jika tidak diklik
    setTimeout(() => {
      if (gameBoard.contains(bug)) {
        bug.remove();
      }
    }, 800);

    // Waktu acak untuk kemunculan bug berikutnya (300ms - 800ms)
    const nextSpawn = Math.floor(Math.random() * 500) + 300;
    bugInterval = setTimeout(spawnBug, nextSpawn);
  }

  function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearTimeout(bugInterval);
    gameBoard.innerHTML = `<div style="display:flex; height:100%; align-items:center; justify-content:center; flex-direction:column;">
      <h2 style="margin:0;">Time's Up!</h2>
      <p style="margin:5px 0;">Bugs Caught: ${score}</p>
    </div>`;
    startBtn.textContent = 'Play Again';
    startBtn.style.display = 'inline-block';
  }
});