document.addEventListener('DOMContentLoaded', function () {
	let optionsButton = document.getElementById("submit");

	// Capture input value to determine board size and set up the board
	optionsButton.addEventListener("click", function () {
		optionsButton.innerHTML = "Reset";

		// Remove fireworks
		let fireworks = document.getElementById("fireworks");
		while (fireworks.hasChildNodes()) {
			fireworks.removeChild(fireworks.lastChild);
		}

		function isEven(value) {
			if (value % 2 == 0) {
				return true;
			} else {
				return false;
			};
		};

		function isOdd(value) {
			if (value % 1 == 0) {
				return true;
			} else {
				return false;
			};
		};

		function allSame(array) {
			let first = array[0];
			if (array[0] == "") {
				return false;
			} else {
				return array.every(function (element) {
					return element == first;
				});
			};
		};

		let boardSize = parseInt(document.getElementById("boardsize_input").value);
		let gameBoard = [];
		let numSquares = (boardSize * boardSize);

		// Create gameboard array
		for (let i = 0; i < numSquares; i++) {
			gameBoard.push(i);
		};

		// Create div with id "board" inside of "game" div
		document.getElementById("game").innerHTML = '<div id="board"></div>';

		let board = document.getElementById("board");

		// Styling board
		board.style.margin = '0 auto';
		board.style.height = (100 * boardSize) + 'px';
		board.style.width = (100 * boardSize) + 'px';
		board.style.border = 'solid 1px black';

		// Iterate over gameboard
		for (let i = 0; i < numSquares; i++) {
			board.innerHTML += '<div class="square"></div>';
		};

		let squares = document.getElementsByClassName("square");

		for (let i = 0; i < numSquares; i++) {
			squares[i].style.height = '100px';
			squares[i].style.width = '100px';
			squares[i].style.float = "left";
			squares[i].style.lineHeight = "100px";
			squares[i].setAttribute("id", i.toString());
		};

		if (numSquares % 2 !== 0) {
			for (let i = 0; i < numSquares; i += 2) {
				squares[i].style.backgroundColor = "#c9fffa";
			};
		} else {
			for (i = 0; i < numSquares; i += 1) {
				if (isEven(i / boardSize)) {
					for (let squareNum = i; squareNum < (i + boardSize); squareNum += 2) {
						squares[squareNum].style.backgroundColor = "#c9fffa";
					};
				} else if (isOdd(i / boardSize)) {
					for (let squareNum = i + 1; squareNum < (i + boardSize); squareNum += 2) {
						squares[squareNum].style.backgroundColor = "#c9fffa";
					};
				}
			};
		};

		// Store turn indicator div in a variable for easy access
		let turnIndicator = document.getElementById("turnIndicator")

		// After board is made, indicate who goes first
		turnIndicator.style.color = "black";
		turnIndicator.innerHTML = "X's Turn";

		let boardClicks = 0;

		// If board is clicked, increment global click counter
		board.addEventListener("click", function () {
			if (getWinner()) {
				turnIndicator.style.color = "#19960b";
				turnIndicator.innerHTML = winningPlayer[0] + ' win!';
			} else if (isEven(boardClicks)) {
				turnIndicator.style.color = "#26b7a9";
				turnIndicator.innerHTML = "O's Turn";
			} else {
				turnIndicator.style.color = "black";
				turnIndicator.innerHTML = "X's Turn";
			};
			boardClicks++;
		});

		// Make an array to hold square click data
		let squareClicks = [];

		// Set squareclick data for each square to 0
		for (let i = 0; i < numSquares; i++) {
			squareClicks[i] = 0;
		};

		let winningPlayer;

		// Add function to determine winner based on clicks array
		let getWinner = function () {
			// Check for win by row
			for (i = 0; i < numSquares; i += 1) {
				if ((i % boardSize) == 0) {
					let rowCheck = [];
					for (let squareNum = i; squareNum < (i + boardSize); squareNum += 1) {
						rowCheck.push(squares[squareNum].innerHTML);
					};
					console.log('Row ' + i + ' is ' + rowCheck);
					console.log(allSame(rowCheck));

					if (allSame(rowCheck)) {
						winningPlayer = rowCheck;
						return true;
					};
				};
			};
			// Check for win by column
			for (i = 0; i < numSquares; i += 1) {
				if (i < boardSize) {
					let colCheck = [];
					for (let squareNum = i; squareNum < numSquares; squareNum += boardSize) {
						colCheck.push(squares[squareNum].innerHTML);
					};
					console.log('Column ' + i + 'is ' + colCheck);
					console.log(allSame(colCheck));

					if (allSame(colCheck)) {
						winningPlayer = colCheck;
						return true;
					};
				};
			};
			// Check for win by left diagonal
			let diag1Check = [];
			for (i = 0; i < numSquares; i += 1) {
				if ((i % (boardSize + 1)) == 0) {
					console.log(i)
					diag1Check.push(squares[i].innerHTML);
				};
			};
			console.log(diag1Check)
			console.log(allSame(diag1Check));
			if (allSame(diag1Check)) {
				winningPlayer = diag1Check;
				return true;
			};
			// Check for winner by right diagonal
			let diag2Check = [];
			for (i = (boardSize - 1); i < (numSquares - 1); i += 1) {
				if ((i % (boardSize - 1)) == 0) {
					console.log(i)
					diag2Check.push(squares[i].innerHTML);
				};
			};
			console.log(diag2Check)
			console.log(allSame(diag2Check));
			if (allSame(diag2Check)) {
				winningPlayer = diag2Check;
				return true;
			};
		};

		// Add function to count square clicks
		let countClicks = function () {
			let divID = this.getAttribute("id");
			squareClicks[divID] += 1;
			// If global click counter is odd and local click is == 1, change innerhtml of div to 'X' 
			if (isEven(boardClicks) && squareClicks[divID] == 1) {
				this.innerHTML = 'X';
			} else if (isOdd(boardClicks) && squareClicks[divID] == 1) {
				this.innerHTML = 'O';
				this.style.color = "#26b7a9";
			} else if (!getWinner()) {
				alert('You cannot move there. That space is taken.');
				boardClicks -= 1;
			}

			// Check the winner, if true, lock all local clicks
			if (getWinner()) {
				for (let i = 0; i < numSquares; i++) {
					squareClicks[i] = 2;
				};

				document.getElementById("submit").innerHTML = "Play again?"

				// Display fireworks
				let before = document.createElement("div");
				before.classList.add("before")
				let after = document.createElement("div");
				after.classList.add("after")
				let pyro = document.createElement("div");
				pyro.classList.add("pyro")
				pyro.appendChild(before)
				pyro.appendChild(after)
				document.getElementById("fireworks").appendChild(pyro)
			};
		};

		for (let i = 0; i < numSquares; i++) {
			squares[i].addEventListener("click", countClicks);
		};
	});
});