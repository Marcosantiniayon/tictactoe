const gameBoard = (() => {
  let board = new Array(9).fill(null); // Sets initial board values. 'null' represents empty cells

  const getBoard = () => board; // gets and returns the current state of the board

  const setMark = (index, mark) => {
    if (board[index] === null) {
      board[index] = mark;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = new Array(9).fill(null); // sets the current state of board back to empty
  };

  return { getBoard, setMark, reset };
})();

const playerFactory = (name, symbol) => {
  const getName = () => name; // Provides read-only access to the player's name
  const getSymbol = () => symbol; // Provides read-only access to the player's symbol

  return { getName, getSymbol };
};

// Create players calling the factory function
const player1 = playerFactory('Alice', 'X');
const player2 = playerFactory('Bob', 'O');

const game = (() => {
  let currentPlayer;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWinner = () => {
    const winningPositions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    const board = gameBoard.getBoard(); // get the current state of the board
    // eslint-disable-next-line max-len
    return winningPositions.some((positions) => positions.every((position) => board[position] === currentPlayer.getSymbol()));
    //
  };
})();
