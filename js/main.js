var GameModule = (function () {
	'use strict';

	// outer namespace
	var boardDOM, currentPlayer, blinkWinningCombination;
	boardDOM = document.getElementById("board");

	/******************* Objects defined as function constucors *******************/
	// Board object
	var Board = function(row, column) {
		this.matrix = [];		// the board matrix
		this.row = row;			// number of rows of board
		this.column = column;	// number of columns of matrix
		this.height = [];
	};

	// creates the board matrix with all zeros
	Board.prototype.createBoard = function() {
		var i,j;

		// creating and filling the board with zeros
		for(i = 0; i < this.row; i+=1) {
			this.matrix[i] = [];
			for(j = 0; j < this.column; j+=1) {
				this.matrix[i].push(0);
			}
		}
	};

	// appends divs to make the board in the HTML DOM
	Board.prototype.drawBoard = function() {
		var i,j;
		var rowDiv,rowDivs;
		var newRow,newCell,newPiece;

		// draw the rows
		for(i = 0; i <= this.row ; i+=1) {
			newRow = document.createElement("DIV");
			newRow.className = "row";
			newRow.setAttribute("row", i);
			boardDOM.appendChild(newRow);
		}

		// draw the columns
		rowDivs =  boardDOM.children;
		for(j = 0; j < rowDivs.length; j+=1) {
			rowDiv = rowDivs[j];
			for(i = 0; i < this.column; i+=1) {
				// new cell being created and added to the row
				newCell = document.createElement("DIV");
				newCell.className = "cell";
				newCell.setAttribute("column", i);
				rowDiv.appendChild(newCell);
				// new piece being created and added to the cell
				newPiece = document.createElement("DIV");
				newPiece.className = "piece";
				newCell.appendChild(newPiece);
			}	
		}
	};

	// sets up the height as an array with length as number of columns
	// height comes in handy to know till what height each is filled
	Board.prototype.setHeight = function() {
		var i,height = [];

		for(i = 0; i < this.column; i+=1) {
			height[i] = this.row-1;
		}
		
		this.height = height;
	};

	// checks whether is the board is full or not
	Board.prototype.isBoardFull = function() {
		var i,isBoardFull;

		for(i = 0; i < this.column; i+=1) {
			if (this.height[i] === -1) {
				isBoardFull = true;
			}
			else {
				isBoardFull = false;
				break;
			}		
		}

		if (isBoardFull) {
			window.alert("Board is full and the game is tie!");
		}

		return isBoardFull;
	};

	// Player object
	var Player = function(name, color) {
		this.color = color;
		this.name = name;
	};

	// Game object
	var Game = function (row, column) {
		this.gameStarted = false;
		this.gameOver = false;
		this.board = null;
		this.player1 = null;
		this.player2 = null;
		this.init(row, column);
	};

	// create the board matrix and draw the board
	Game.prototype.init = function (row, column) {
		this.board = new Board(row, column);
		this.board.createBoard();
		this.board.drawBoard();
		this.board.setHeight();
	};

	// start the game 
	Game.prototype.startGame = function(player1Color, player2Color) {
		this.gameStarted  = true;
		this.player1 = new Player("player1", player1Color);		
		this.player2 = new Player("player2", player2Color);	
		
		document.getElementById("player1-color").setAttribute("disabled","");
		document.getElementById("player2-color").setAttribute("disabled","");
		document.getElementById("player1").className = "active-player";
		document.getElementById("player2").className = "inactive-player";
		document.getElementById("start").setAttribute("disabled","");
	};

	// function used to reset the game
	Game.prototype.reset = function() {
		this.gameStarted = false;
		this.gameOver = false;
		this.resetDOM();
		this.init(6,7);
	};

	Game.prototype.resetDOM = function() {
		window.clearInterval(blinkWinningCombination);
		document.getElementById("start").removeAttribute("disabled");
		document.getElementById("player1-color").removeAttribute("disabled");
		document.getElementById("player2-color").removeAttribute("disabled");
		document.getElementById("player1-color").value = "";
		document.getElementById("player2-color").value = "";
		document.getElementById("player1").className = "reset-player";
		document.getElementById("player2").className = "reset-player";
		document.getElementById("player1-win").className = "hidden";
		document.getElementById("player2-win").className = "hidden";
		boardDOM.innerHTML = "";
	};

	// records the move in the board matrix & height
	Game.prototype.move = function(column, color) {
		var row, isMoveValid;

		row = this.board.height[column];
		if (row >= 0) {
			this.board.matrix[row][column] = color;
			this.board.height[column]-=1;
			isMoveValid = true;
		}

	    else {
	    	window.alert("Illegal move. There is no space in column " + (parseInt(column,10)+1));
	    	isMoveValid = false;	
	    }

	    return isMoveValid;
	};

	// draws the piece in its final position using height
	Game.prototype.drawPiece = function(column, color) {
		boardDOM.children[this.board.height[column]+2].childNodes[column].childNodes[0].style.backgroundColor = color;
	};

	// checks if the board has a winner with the given color
	Game.prototype.checkWinningCombination = function(color) {
		var row,col;

		// check rows [left to right]
	    for(row = 0; row < this.board.row; row+=1) {
			for(col = 0; col < this.board.column - 3; col+=1) {
				if (this.board.matrix[row][col] === color) {
					if (this.board.matrix[row][col+1] === color && this.board.matrix[row][col+2] === color && this.board.matrix[row][col+3] === color) {
						return {
							winnerColor: color,
							squares: [[row, col], [row, col+1], [row, col+2], [row, col+3]]
						};
					}	
				}
			}
	    }

	    // check columns [top to bottom]
	    for(row = this.board.row-1; row > 2; row-=1) {
			for(col = 0; col < this.board.column; col+=1) {
				if (this.board.matrix[row][col] === color) {
					if (this.board.matrix[row-1][col] === color && this.board.matrix[row-2][col] === color && this.board.matrix[row-3][col] === color) {
						return {
							winnerColor: color,
							squares: [[row, col], [row-1, col], [row-2, col], [row-3, col]]
						};
					}
				}	
			}
	    }

	    // check diagonal left top to right bottom
	    for(row = 0; row < this.board.row - 3; row+=1) {
			for(col = 0; col < this.board.column -3; col+=1) {
				if (this.board.matrix[row][col] === color) {
					if (this.board.matrix[row+1][col+1] === color && this.board.matrix[row+2][col+2] === color && this.board.matrix[row+3][col+3] === color) {
						return {
							winnerColor: color,
							squares: [[row, col], [row+1, col+1], [row+2, col+2], [row+3, col+3]]
						};	
					}
				}	
			}
	    }

	    // check diagonal left bottom to top right
	    for(row = this.board.row-1; row > 2; row-=1) {
			for(col = 0; col < this.board.column - 3; col+=1) {
				if (this.board.matrix[row][col] === color) {
					if (this.board.matrix[row-1][col+1] === color && this.board.matrix[row-2][col+2] === color && this.board.matrix[row-3][col+3] === color) {
						return {
							winnerColor: color,
							squares: [[row, col], [row-1, col+1], [row-2, col+2], [row-3, col+3]]
						};
					}
				}		
			}
	    }

	    return false;	// when no winning combination found
	};

	// call to start the setup (going with the popular dimension)
	var game = new Game(6,7);

	// validation function validates if both players have selected colors or not.
	var validation = function () {
		var player1ColorDOM = document.getElementById("player1-color");
		var player2ColorDOM = document.getElementById("player2-color");

		if (player1ColorDOM.value === '' ||   player2ColorDOM.value === '') {
			window.alert("Please select both player's color");
			return false;
		}	
		else {
			game.startGame(player1ColorDOM.value,player2ColorDOM.value);
			currentPlayer = game.player1;
			return true;
		}
	};	

	// on click of reset
	var reset = function () {
		var i;

		for(i = 0; i < arguments.length; i+=1) {
	    	if (arguments[i] instanceof GameModule.Game) {
	    		game = arguments[i];
	    	}
	  	}
		
		if(game.gameStarted) {
			if (!game.gameOver) {
				if (window.confirm("Are you sure you want to Quit ?")) {
					game.reset();
					return true;
				}
			}
			else {
				game.reset();
				return true;
			}
		}
		else {
			return false;
		}
	};

	/* clears the top row of any floating piece. 
	   no arg - clears the entire row
	   arg given - clear the entire row except that column */
	var clearPlayingPieces = function (column) {
		var i, localColumn;

		localColumn = column || -1;
		for(i = 0; i < game.board.column; i+=1) {
			if(!(i === parseInt(localColumn,10))) {
				boardDOM.children[0].childNodes[i].childNodes[0].style.backgroundColor = "";
				boardDOM.children[0].childNodes[i].childNodes[0].style.boxShadow = "";
			}	
		}
	};

	// the top row floating piece
	var playingPiece = function (event) {
		var column;

		if (game.gameStarted && !game.gameOver) {
			column = event.target.getAttribute("column") || event.target.parentNode.getAttribute("column");
			if (column) {
				boardDOM.children[0].childNodes[column].childNodes[0].style.backgroundColor = currentPlayer.color;
				boardDOM.children[0].childNodes[column].childNodes[0].style.boxShadow = "10px 10px 5px #888888";
				clearPlayingPieces(column);
			}
		}
	};

	// called on click of a piece within the board and manages players move 
	var move = function (event) {
		var i;
		var row,column,winner,oldPlayer;

		if (!game.gameOver && game.gameStarted) {
			column = event.target.getAttribute("column") || event.target.parentNode.getAttribute("column");
			if (column){
				if (game.move(column,currentPlayer.color)) {
					game.drawPiece(column,currentPlayer.color);	// draw the piece on the board with the current player's color
					if (game.board.isBoardFull()) {				// return by setting the current player inacitve
						document.getElementById(currentPlayer.name).className = "inactive-player";
						return;
					}
					winner = game.checkWinningCombination(currentPlayer.color);
					if(winner){
						clearPlayingPieces();			
						blinkWinningCombination = window.setInterval(function() {
							for (i = 0; i < winner.squares.length; i+=1) {
								row = winner.squares[i][0];
								column = winner.squares[i][1];
								boardDOM.children[row+1].childNodes[column].style.backgroundColor === "" ? 
								boardDOM.children[row+1].childNodes[column].style.backgroundColor = "aqua" : 
								boardDOM.children[row+1].childNodes[column].style.backgroundColor = "";
							} 
						}, 500);
						window.alert((winner.winnerColor === game.player1.color) ? "Player 1 wins" : "Player 2 wins");
						boardDOM.children[0].childNodes[column].childNodes[0].style.backgroundColor = "";
						boardDOM.children[0].childNodes[column].childNodes[0].style.boxShadow = "";
						document.getElementById(currentPlayer.name).className += " animation";
						document.getElementById(currentPlayer.name+"-win").className = "";
						game.gameOver = true;
						return;
					}
					oldPlayer = currentPlayer;
					currentPlayer = (currentPlayer === game.player1) ? game.player2 : game.player1;	
					boardDOM.children[0].childNodes[column].childNodes[0].style.backgroundColor = "";
					boardDOM.children[0].childNodes[column].childNodes[0].style.boxShadow = "";
					document.getElementById(oldPlayer.name).className = "inactive-player";
					document.getElementById(currentPlayer.name).className = "active-player";
				} 
				else {
					return;
				}		
			}
		}
	};

	// shim to make event handling work on till IE 8
	var addEvent = function(event, element, func) {
	   if(element) {
		   	if (element.addEventListener) {
		   		// W3C DOM
		     	element.addEventListener(event,func,false);
		    }  
		    else if (element.attachEvent) { 
		   		// IE DOM
		      	element.attachEvent("on"+event, func);
		   	}
	 	} 
	};

	// Event listeners
	addEvent("click", document.getElementById("start"), validation);
	addEvent("click", document.getElementById("reset"), reset);
	addEvent("click", document.getElementById("board"), move);
	addEvent("mouseover", document.getElementById("board"), playingPiece);
	addEvent("mouseout", document.getElementById("board"), clearPlayingPieces);

	return {
		validation: validation,
		Player: Player,
		Board: Board,
		Game: Game,
		reset: reset
	}

})();

