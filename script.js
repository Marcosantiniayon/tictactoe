const playerInfoDiv = document.querySelector('.player-info-div');
const gameDisplayDiv = document.querySelector('.game-display-div');
const gameResultDiv = document.querySelector('.game-result-div');
const resultBtn = document.getElementById('result-btn');
const restartBtn = document.getElementById('restart-btn');
const form = document.querySelector('form');
const player1Input = document.querySelector('#player1');
const player2Input = document.querySelector('#player2');
const ppcCheckbox = document.querySelector('#ppc');
let player1 = '';
let player2 = 'PC';

// Change to game display screen after players start
form.addEventListener('submit', (event) => {
  event.preventDefault();
  player1 = player1Input.value;
  player2 = player2Input.value;
  const ppc = ppcCheckbox.checked;
  console.log(player1, player2, ppc);
  playerInfoDiv.classList.add('hidden');
  gameDisplayDiv.classList.remove('hidden');
});
// Disable Player 2 name if Player 2 is pc
ppcCheckbox.addEventListener('change', () => {
  if (ppcCheckbox.checked) {
    player2Input.value = 'PC';
    player2Input.disabled = true;
  } else {
    player2Input.disabled = false;
  }
});
// Change to results screen after a game has concluded
resultBtn.addEventListener('click', () => {
  gameDisplayDiv.classList.add('hidden');
  gameResultDiv.classList.remove('hidden');
});
// Change back to player info screen after restart
restartBtn.addEventListener('click', () => {
  gameResultDiv.classList.add('hidden');
  playerInfoDiv.classList.remove('hidden');
});

const Gameboard = (() => {
  // Initialize board with default empty values
  let board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

  const placeMark = (mark, index) => {
    board[index] = mark;
  };
  const clearBoard = () => {
    board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
  };
  // gets the current state of the board
  const getBoard = () => board;

  return { placeMark, clearBoard, getBoard };
})();

const Players = () => {

};

const game = (() => {

  // checkForWinnerFunction

  // checkForTie Function

});

const displayController = (() => {

});
