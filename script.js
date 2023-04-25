/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */

const gameBoard = (() => {
  // Initialize board with default empty values
  let board = ['', '', '', '', '', '', '', '', ''];

  const setMark = (index, mark) => {
    if (board[index] === '') {
      board[index] = mark;
      return true;
    }
    return false;
  };
  const reset = () => {
    board = ['', '', '', '', '', '', '', '', ''];
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

  const checkTie = () => gameBoard.getBoard().every((cell) => cell !== '');

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

  let isPCPlayer2 = false;

  const isPCPlayer2Active = () => isPCPlayer2;

  const generatePCMove = () => {
    const minimax = (board, depth, isMaximizing) => {
      const winner = checkWinnerForBoard(board);
      if (winner !== null) {
        return winner === player1.getSymbol() ? -1 : 1;
      }

      if (checkTieForBoard(board)) {
        return 0;
      }

      const currentPlayer = isMaximizing ? player2 : player1;
      let bestScore = isMaximizing ? -Infinity : Infinity;

      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          const newBoard = [...board];
          newBoard[i] = currentPlayer.getSymbol();
          const score = minimax(newBoard, depth + 1, !isMaximizing);

          if (isMaximizing) {
            bestScore = Math.max(bestScore, score);
          } else {
            bestScore = Math.min(bestScore, score);
          }
        }
      }

      return bestScore;
    };

    const checkWinnerForBoard = (board) => {
      const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
      ];

      for (const combo of winningCombinations) {
        if (
          board[combo[0]] !== ''
          && board[combo[0]] === board[combo[1]]
          && board[combo[0]] === board[combo[2]]
        ) {
          return board[combo[0]];
        }
      }

      return null;
    };

    const checkTieForBoard = (board) => board.every((cell) => cell !== '');

    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < gameBoard.getBoard().length; i++) {
      if (gameBoard.getBoard()[i] === '') {
        const newBoard = [...gameBoard.getBoard()];
        newBoard[i] = player2.getSymbol();
        const score = minimax(newBoard, 0, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const getCurrentPlayer = () => currentPlayer;

  const start = (player1Name, player2Name, pcPlayer2) => {
    player1 = playerFactory(player1Name, 'X');
    player2 = playerFactory(player2Name, 'O');
    currentPlayer = player1;
    gameBoard.reset();
    isPCPlayer2 = pcPlayer2;
  };

  return {
    playTurn, start, isPCPlayer2Active, generatePCMove, getCurrentPlayer,
  };
})();

const displayController = () => {
  const playerInfoDiv = document.querySelector('.player-info-div');
  const gameDisplayDiv = document.querySelector('.game-display-div');
  const gameResultDiv = document.querySelector('.game-result-div');
  const restartBtn = document.getElementById('restart-btn');
  const form = document.querySelector('form');
  const resultDisplay = document.getElementById('result');
  const player1Input = document.querySelector('#player1');
  const player2Input = document.querySelector('#player2');
  const ppcCheckbox = document.querySelector('#ppcChckbx');
  const ppcImg = document.getElementById('ppcImg');
  const result = document.getElementById('result');
  let player1Name = '';
  let player2Name = '';

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

    // Check the result and display the winner or the tie message
    if (result) {
      gameDisplayDiv.classList.add('fade-out');

      setTimeout(() => {
        gameDisplayDiv.classList.add('hidden');
        gameDisplayDiv.classList.remove('fade-out');

        // Show the gameResultDiv and add the fade-in class
        gameResultDiv.classList.remove('hidden');
        gameResultDiv.classList.add('fade-in');

        setTimeout(() => {
          // Remove the fade-in class after the animation is done
          gameResultDiv.classList.remove('fade-in');
        }, 500);
      }, 500);
      if (result.winner) {
        console.log(`Winner: ${result.winner}`);
        resultDisplay.textContent = `Winner: ${result.winner}`;
      } else if (result.tie) {
        console.log("It's a tie!");
        resultDisplay.textContent = "It's a tie!";
      }
      resultDisplay.classList.add('zoom-in');
      setTimeout(() => {
        resultDisplay.classList.remove('zoom-in');
      }, 1500);
    } else if (gameController.isPCPlayer2Active() && gameController.getCurrentPlayer().getName() === player2Name) {
      setTimeout(() => {
        const pcMoveIndex = gameController.generatePCMove();
        handleCellClick(pcMoveIndex);
      }, 500); // Add a delay before the PC makes a move
    }
  };

  const init = () => {
    // Listens to form submission
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      player1Name = player1Input.value;
      playerFactory(player1Name, 'X');
      player2Name = player2Input.value;
      playerFactory(player2Name, 'O');

      const ppc = ppcCheckbox.checked;

      console.log(player1Name, player2Name, ppc);

      // Start the game with the given player names and ppc value
      gameController.start(player1Name, player2Name, ppc);

      // Add the fade-out class to the player info div
      playerInfoDiv.classList.add('fade-out');

      // Wait for the fade-out animation to complete before showing the game display div
      setTimeout(() => {
        playerInfoDiv.classList.add('hidden');
        playerInfoDiv.classList.remove('fade-out');

        // Show the gameDisplayDiv and add the fade-in class
        gameDisplayDiv.classList.remove('hidden');
        gameDisplayDiv.classList.add('fade-in');

        setTimeout(() => {
          // Remove the fade-in class after the animation is done
          gameDisplayDiv.classList.remove('fade-in');
        }, 500);
      }, 500);
    });
    // Listens to PC toggle. Disable Player 2 name if Player 2 is pc
    ppcCheckbox.addEventListener('change', () => {
      if (ppcCheckbox.checked) {
        player2Input.value = 'PC';
        player2Input.disabled = true;
        ppcImg.classList.add('ppcOn');
      } else {
        player2Input.value = '';
        player2Input.disabled = false;
        ppcImg.classList.remove('ppcOn');
      }
    });
    let rotationDegree = 0;
    ppcImg.addEventListener('click', () => {
      rotationDegree += 720; // Increase the rotation degree by 360 each click
      ppcImg.style.transform = `rotate(${rotationDegree}deg)`; // Apply the rotation to the element

      // Optional: remove the rotation class after the animation is done
      setTimeout(() => {
        ppcImg.classList.remove('rotate');
      }, 500); // The duration of the animation (in this case, 0.5s or 500ms)
    });
    // Change back to player info screen after restart
    restartBtn.addEventListener('click', () => {
      gameResultDiv.classList.add('fade-out');
      setTimeout(() => {
        gameResultDiv.classList.add('hidden');
        gameResultDiv.classList.remove('fade-out');
        playerInfoDiv.classList.remove('hidden');
        playerInfoDiv.classList.add('fade-in');
        setTimeout(() => {
          playerInfoDiv.classList.remove('fade-in');
        }, 700);
      }, 700);
      gameBoard.reset();
      render();
    });
    // Add click event listeners to the cell elementsx
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        const index = parseInt(cell.getAttribute('data-index'), 10);
        handleCellClick(index);
      });
    });
  };

  return { init };
};

displayController().init();
