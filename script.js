/* eslint-disable max-len */

const gameBoard = (() => {
  // Initialize board with default empty values
  let board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

  const setMark = (index, mark) => {
    if (board[index] === null) {
      board[index] = mark;
      return true;
    }
    return false;
  };
  const reset = () => {
    board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
  };
  // gets the current state of the board
  const getBoard = () => board;

  return { setMark, reset, getBoard };
})();

const playerFactory = (name, symbol) => {
  const getName = () => name;
  const getSymbol = () => symbol;

  return { getName, getSymbol };
};

const gameController = (() => {
  let player1;
  let player2;
  let currentPlayer;

  const switchPlayer = () => {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
  };

  const checkWinner = () => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    const board = gameBoard.getBoard();
    return winningCombinations.some((combo) => combo.every((position) => board[position] === currentPlayer.getSymbol()));
  };

  const checkTie = () => {
    gameBoard.getBoard().every((cell) => cell !== null);
  };

  const playTurn = (index) => {
    if (gameBoard.setMark(index, currentPlayer.getSymbol())) {
      if (checkWinner()) {
        return { winner: currentPlayer.getName() };
      }
      if (checkTie()) {
        return { tie: true };
      }
      switchPlayer();
    }
    return null;
  };

  const start = (player1Name, player2Name) => {
    player1 = playerFactory(player1Name, 'X');
    player2 = playerFactory(player2Name, 'O');
    currentPlayer = player1;
    gameBoard.reset();
  };

  return { playTurn, start };
});

const displayController = (() => {
  const playerInfoDiv = document.querySelector('.player-info-div');
  const gameDisplayDiv = document.querySelector('.game-display-div');
  const gameResultDiv = document.querySelector('.game-result-div');
  const resultBtn = document.getElementById('result-btn');
  const restartBtn = document.getElementById('restart-btn');
  const form = document.querySelector('form');
  const gameBoardDiv = document.getElementById('game-board');
  const player1Input = document.querySelector('#player1');
  const player2Input = document.querySelector('#player2');
  const ppcCheckbox = document.querySelector('#ppc');
  let player1 = '';
  let player2 = 'PC';

  const render = () => {
    const board = gameBoard.getBoard();
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const handleCellClick = (index) => {
    // Call the playTurn function from the gameController module and update the game board
    const result = gameController.playTurn(index);
    render();
  };

  const init = () => {
    // Listens to form submission
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      player1 = player1Input.value;
      playerFactory(player1, 'X');
      player2 = player2Input.value;
      playerFactory(player2, 'O');

      const ppc = ppcCheckbox.checked;

      console.log(player1, player2, ppc);

      // Start the game with the given player names
      gameController.start(player1, player2);

      // Change to game display screen after players start
      playerInfoDiv.classList.add('hidden');
      gameDisplayDiv.classList.remove('hidden');
    });
    // Listens to PC toggle. Disable Player 2 name if Player 2 is pc
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
    // Add click event listeners to the cell elements
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        const index = parseInt(cell.getAttribute('data-index'), 10);
        handleCellClick(index);
      });
    });
  };

  return init;
});

displayController();
