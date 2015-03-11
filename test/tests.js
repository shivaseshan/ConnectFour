QUnit.module( "Initialization test" , {
  beforeEach: function() {
    // prepare something for all following tests
    this.board = new GameModule.Board(6,7);
  }
});
QUnit.test( "board matrix created" , function (assert) {
	this.board.createBoard();
	this.board.setHeight();

	assert.equal( this.board.row, 6, "6 rows created in board matrix" );
	assert.equal( this.board.column, 7, "7 columns created in board matrix" );
	assert.equal( this.board.height.length, this.board.column, "array of heigth created with " + this.board.column + " elements" );
});

QUnit.module( "players selection of colors" );
QUnit.test( "both players don't select colors" , function (assert) {
	window.alert = function() {};
	assert.ok( !GameModule.validation() , "Both players not selected colors");
});
QUnit.test( "Player 1 didn't select color" , function( assert ) {
	document.getElementById("player1-color").value = "YELLOW";
	assert.ok( !GameModule.validation() , "Player2 selected color but not player 1");
});
QUnit.test( "player 2 didn't select color" , function (assert) {
	document.getElementById("player2-color").value = "GREEN";
	assert.ok( !GameModule.validation() , "Player1 selected color but not player 2");
}); 
QUnit.test( "color selected" , function( assert ) {
	document.getElementById("player1-color").value = "YELLOW";
	document.getElementById("player2-color").value = "GREEN";
	assert.ok( GameModule.validation() , "Both players selected colors");
});

QUnit.module( "no winning combinations" , {
	beforeEach: function() {
		// prepare something for all following tests
		this.game = new GameModule.Game(6,7);
	}
});
QUnit.test( "left bottom to right top diagonal" , function (assert) {
	// Setting combination
	this.game.board.matrix[1][1] = "YELLOW";
	this.game.board.matrix[0][2] = "YELLOW";
	assert.ok( !this.game.checkWinningCombination("YELLOW") , "no winning combination found - diagonal of 2");
	// Re-Setting combination
	this.game.board.matrix[1][1] = 0;
	this.game.board.matrix[0][2] = 0;

	// Setting combination
	this.game.board.matrix[0][2] = "YELLOW";
	this.game.board.matrix[1][1] = "YELLOW";
	this.game.board.matrix[2][0] = "YELLOW";
	assert.ok( !this.game.checkWinningCombination("YELLOW") , "no winning combination found - diagonal of 3");
	// Re-Setting combination
	this.game.board.matrix[0][2] = 0;
	this.game.board.matrix[1][1] = 0;
	this.game.board.matrix[2][0] = 0;
});
QUnit.test( "left top to right bottom diagonal" , function (assert) {
	// Setting combination
	this.game.board.matrix[1][6] = "YELLOW";
	this.game.board.matrix[0][5] = "YELLOW";
	assert.ok( !this.game.checkWinningCombination("YELLOW") , "no winning combination found - diagonal of 2");
	// Re-Setting combination
	this.game.board.matrix[1][6] = 0;
	this.game.board.matrix[0][5] = 0;

	// Setting combination
	this.game.board.matrix[0][4] = "YELLOW";
	this.game.board.matrix[1][5] = "YELLOW";
	this.game.board.matrix[2][6] = "YELLOW";
	assert.ok( !this.game.checkWinningCombination("YELLOW") , "no winning combination found - diagonal of 3");
	// Re-Setting combination
	this.game.board.matrix[0][4] = 0;
	this.game.board.matrix[1][5] = 0;
	this.game.board.matrix[2][6] = 0;
});
QUnit.test( "row" , function (assert) {
	// Setting combination
	this.game.board.matrix[0][6] = "YELLOW";
	this.game.board.matrix[0][5] = "YELLOW";
	assert.ok( !this.game.checkWinningCombination("YELLOW") , "no winning combination found - row of 2");
	// Re-Setting combination
	this.game.board.matrix[0][6] = 0;
	this.game.board.matrix[0][5] = 0;

	// Setting combination
	this.game.board.matrix[0][6] = "YELLOW";
	this.game.board.matrix[0][5] = "YELLOW";
	this.game.board.matrix[0][4] = "YELLOW";
	assert.ok( !this.game.checkWinningCombination("YELLOW") , "no winning combination found - row of 3");
	// Re-Setting combination
	this.game.board.matrix[0][6] = 0;
	this.game.board.matrix[0][5] = 0;
	this.game.board.matrix[0][4] = 0;
});
QUnit.test( "column" , function (assert) {
	// Setting combination
	this.game.board.matrix[5][0] = "YELLOW";
	this.game.board.matrix[4][0] = "YELLOW";
	assert.ok( !this.game.checkWinningCombination("YELLOW") , "no winning combination found - column of 2");
	// Re-Setting combination
	this.game.board.matrix[5][0] = 0;
	this.game.board.matrix[4][0] = 0;

	// Setting combination
	this.game.board.matrix[5][0] = "YELLOW";
	this.game.board.matrix[4][0] = "YELLOW";
	this.game.board.matrix[3][0] = "YELLOW";
	assert.ok( !this.game.checkWinningCombination("YELLOW") , "no winning combination found - column of 3");
	// Re-Setting combination
	this.game.board.matrix[5][0] = 0;
	this.game.board.matrix[4][0] = 0;
	this.game.board.matrix[3][0] = 0;
});
QUnit.test( "no winning combination" , function (assert) {
	assert.ok( !this.game.checkWinningCombination("YELLOW") , "no winning combination found - empty board");
});


QUnit.module( "winning combinations" , {
	beforeEach: function () {
		this.game = new GameModule.Game(6,7);
	}
});
QUnit.test( "winning combination - row" , function (assert) {
	var i,j;
	
	i = 0; 
	// Setting winning combination
	for(j = 0; j <= 3; j+=1) { 
			this.game.board.matrix[i][j] = "YELLOW";
	}
	assert.ok( this.game.checkWinningCombination("YELLOW") , "winning combination found in row " + i);
	// Re-Setting winning combination - subsequent tests get affected
	for(j = 0; j <= 3; j+=1) { 
			this.game.board.matrix[i][j] = 0;
	}
});
QUnit.test( "winning combination - column" , function (assert) {
	var i,j;

	j = 6;
	// Setting winning combination
	for(i = 0; i <= 3; i+=1) { 
			this.game.board.matrix[i][j] = "YELLOW";
	}
	assert.ok( this.game.checkWinningCombination("YELLOW") , "winning combination found in column " + j);
	// Re-Setting winning combination - subsequent tests get affected
	for(i = 0; i <= 3; i+=1) { 
			this.game.board.matrix[i][j] = 0;
	}
});
QUnit.test( "winning combination - diagonal : left top to right bottom" , function (assert) {
	var i,j;

	// Setting winning combination
	i = 1; j = 1;
	while( (i <= 4) && (j <= 4) ) { 
		this.game.board.matrix[i][j] = "YELLOW";
		i+=1;
		j+=1;
	}
	assert.ok( this.game.checkWinningCombination("YELLOW") , "winning combination found in diagonal : left top to right bottom");
	// Re-Setting winning combination - subsequent tests get affected
	i = 1; j = 1;
	while( (i <= 4) && (j <= 4) ) { 
		this.game.board.matrix[i][j] = 0;
		i+=1;
		j+=1;
	}
});
QUnit.test( "winning combination - diagonal : left bottom to top right" , function (assert) {
	var i,j;

	// Setting winning combination
	i = 5; j = 1;
	while( (i >= 2) && (j <= 4) ) { 
		this.game.board.matrix[i][j] = "YELLOW";
		i-=1;
		j+=1;
	}
	assert.ok( this.game.checkWinningCombination("YELLOW") , "winning combination found in diagonal : left bottom to top right");
	// Re-Setting winning combination - subsequent tests get affected
	i = 5; j = 1;
	while( (i <= 2) && (j <= 4) ) { 
		this.game.board.matrix[i][j] = 0;
		i+=1;
		j+=1;
	}
});

QUnit.module( "non winning combinations" , {
	beforeEach: function () {
		this.player = new GameModule.Player("NEWCOLOR", "player");
		this.game = new GameModule.Game(6,7);
	}
});
QUnit.test( "board is not full" , function (assert) { 
	var i,j;

	for(j = 1; j < this.game.board.column; j+=1 ) {
		for(i = 0; i < this.game.board.row; i+=1) {
			this.game.move(j, this.player.color);
		}	
	}

	assert.ok( !this.game.board.isBoardFull() , "Nothing happens and the next player can make his move");
});
QUnit.test( "board is full" , function (assert) { 
	var i,j;

	for(j = 0; j < this.game.board.column; j+=1 ) {
		for(i = 0; i < this.game.board.row; i+=1) {
			this.game.move(j, this.player.color);
		}	
	}

	assert.ok( this.game.board.isBoardFull() , "Board is full and the game is tie!");
});

QUnit.module( "invalid combinations" , {
	beforeEach: function() {
		// prepare something for all following tests
		this.game = new GameModule.Game(6,7);
		this.player = new GameModule.Player("NEWCOLOR", "player");
	}
} );
QUnit.test( "column is full" , function (assert) {
	var i,j;
	
	j = 1;
	for(i = 0; i < this.game.board.row; i+=1) {
		this.game.move(j, this.player.color);
	}

	assert.ok( !this.game.move(j, this.player.color) , "There is no space in column " + j);
});

QUnit.module( "reset" , {
	beforeEach: function() {
		// prepare something for all following tests
		this.game = new GameModule.Game(6,7);
	}
});
QUnit.test( "when game is not started" , function (assert) {
	this.gameStarted = false;
	this.gameOver = false;

	assert.ok( !GameModule.reset(this.game) , "Nothing happens when game is not started");
});
QUnit.test( "when game is started and not over - Cancel pressed" , function (assert) {
	this.game.gameStarted = true;
	this.game.gameOver = false;
	window.confirm = function(msg) {
    	return false;
	}

	assert.ok( !GameModule.reset(this.game) , "Nothing happens when cancel is pressed");
});
QUnit.test( "when game is started and not over - Ok pressed" , function (assert) {
	this.game.gameStarted = true;
	this.game.gameOver = false;
	window.confirm = function(msg) {
    	return true;
	}

	assert.ok( GameModule.reset(this.game) , "Resets Everything");
});
QUnit.test( "when game is started and over" , function (assert) {
	this.game.gameStarted = true;
	this.game.gameOver = true;
	
	assert.ok( GameModule.reset(this.game) , "Resets Everything");
});

