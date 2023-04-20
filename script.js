const playerInfoDiv = document.querySelector('.player-info-div');
const gameDisplayDiv = document.querySelector('.game-display-div');
const gameResultDiv = document.querySelector('.game-result-div');
const startBtn = document.getElementById('start-btn');
const resultBtn = document.getElementById('result-btn');
const restartBtn = document.getElementById('restart-btn');

// Change to game display screen after players start
startBtn.addEventListener('click', () => {
  playerInfoDiv.classList.add('hidden');
  gameDisplayDiv.classList.remove('hidden');
  console.log('Button clicked!');
});

// Change to results screen after a game has concluded
resultBtn.addEventListener('click', () => {
  gameDisplayDiv.classList.add('hidden');
  gameResultDiv.classList.remove('hidden');
  console.log('Button clicked!');
});

// Change back to player info screen after restart

restartBtn.addEventListener('click', () => {
  gameResultDiv.classList.add('hidden');
  playerInfoDiv.classList.remove('hidden');
  console.log('Button clicked!');
});
