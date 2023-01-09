
const canvas = document.getElementById('game');
canvas.addEventListener('click', (e) => {
	canvasClickedEvent = e;
});
const ctx = canvas.getContext('2d');
let canvasClickedEvent = null;
let won=null
// console.log(ctx);

// Local game variables
//let playerId = 0;

//Constructors for game objects
//Player
function Player(man=true, name="The Computer"){
	this.turn = 0; // indicates it goes first, 1 indicates second
	this.won = false;
	this.type = man ? 0 : 1; // 0 -- manual, 1 -- ai
	this.name = name;
	// this.id = playerId;
	// playerId++;
	//this.name;
	//maybe name, age, etc.
}

//Board Cell
function BoardCell(topx, topy, height, width, text){
	this.topx = topx;
	this.topy = topy;
	this.height = height;
	this.width = width;
	this.text = text;
}

//Board
function Board(width, height, top, left, cellWidth, cellHeight){
	this.width = width;
	this.height = height;
	this.state = [];
	this.top = top;
	this.left = left;
	this.cellWidth = cellWidth;
	this.cellHeight = cellHeight;
	this.matched = null;
	// this.html = '<table class="board one" style="\n    z-index: 100;\n" id="1">' + 
	// 			'\n\t\t\t\t\t<tbody>\n\t\t\t\t\t\t'+
	// 			'<tr>\n\t\t\t\t\t\t\t<td>x</td>\n\t\t\t\t\t\t\t<td>x</td>\n\t\t\t\t\t\t\t<td>x</td>\n\t\t\t\t\t\t</tr>' +
	// 			'\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td>a</td>\n\t\t\t\t\t\t\t<td>a</td>\n\t\t\t\t\t\t\t<td>a</td>\n\t\t\t\t\t\t</tr>' + 
	// 			'\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td>a</td>\n\t\t\t\t\t\t\t<td>a</td>\n\t\t\t\t\t\t\t<td>a</td>\n\t\t\t\t\t\t</tr>' + 
	// 			'\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>'
	this.init = () => {
		let x = this.left, y = this.top;
		for(let r=0; r<this.height; r++){
			let arr = []
			for(let c=0; c<this.width; c++){
				arr.push(new BoardCell(x+c*this.cellWidth, y+r*this.cellHeight,this.cellWidth,this.cellHeight, ' '));
			}
			this.state.push(arr)
		}
	}
	this.checkMatched = () => {
		let cell;
		//check all rows
		for(let r=0; r<this.height; r++){
			let rowMatched = true;
			for(let c=0; c<this.width; c++){
				rowMatched = rowMatched && (this.state[r][c].text  == 'X');
			}
			if(rowMatched){
				this.matched = [this.state[r][0], this.state[r][this.width-1]];//store cells of row start and row end
				return;
			}
		}

		//check all columns
		for(let c=0; c<this.width; c++) {
			let colMatched = true;
			for(let r=0; r<this.height; r++){
				colMatched = colMatched && (this.state[r][c].text == 'X');
			}
			if(colMatched){
				this.matched = [this.state[0][c], this.state[this.height-1][c]];//store cells of col start and col end
				return;
			}
		}

		//TODO: check all diagonals
	}

	this.draw = () => {
		let cell;
		let alpha = this.matched ? 0.5 : 1;
		for(let r=0; r<this.height; r++){
			for(let c=0; c<this.width; c++){
				cell = this.state[r][c]
				ctx.beginPath();
				ctx.fillStyle = `rgba(255,0,0, ${alpha})`
				ctx.lineWidth = 3;
				ctx.fillRect(cell.topx,cell.topy,cell.width, cell.height);
				ctx.closePath();

				cell = this.state[r][c]
				ctx.beginPath();
				ctx.strokeStyle = `rgba(255,255,255, ${alpha})`
				ctx.lineWidth = 3;
				ctx.strokeRect(cell.topx,cell.topy,cell.width, cell.height);
				ctx.closePath();

				ctx.font = `${this.cellWidth/2}px Arial`
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				//since textAlign=center (horizontal) and baseline=middle (vertical),
				// fillText accepts coordinates of center of the text, not left corner
				ctx.fillStyle = `rgba(255,255,255, ${alpha})`
				ctx.fillText(cell.text, cell.topx + cell.width/2, cell.topy + cell.height/2, cell.width/2);
			}
		}

		//draw a line if matched
		if(this.matched){
			let startCell = this.matched[0];
			let endCell = this.matched[1];
			ctx.beginPath();
			ctx.moveTo(startCell.topx+startCell.width/2, startCell.topy+startCell.height/2);
			ctx.lineTo(endCell.topx+endCell.width/2, endCell.topy+endCell.height/2);
			ctx.stroke();
		}
	}
}

//Game
export function Game(){
	this.over = false;
	this.players = [];
	this.nextTurn =  -1;//index of player whose turn is next
	this.boards = [];

	this.createGame = (opponent, turn, boards, pl1name, pl2name) => {
		let pl1 = new Player(true,name=pl1name);
		let pl2 = new Player(opponent == 0 ? false : true, name=pl2name);
		this.players.push(pl1);
		this.players.push(pl2);
		let cellHeight = 50;
		let cellWidth = 50;
		let topMargin = (600-boards*3*cellHeight)/(boards+1);
		let leftMargin = (600-boards*3*cellWidth)/(boards+1);
		for(let n=0; n<boards; n++){
			let b = new Board(3, 3, n*(3*50)+(n+1)*topMargin,n*(3*50)+(n+1)*leftMargin, cellWidth, cellHeight);
			b.init();
			this.boards.push(b);
		}
		if(turn==0) this.nextTurn = 0;
		else this.nextTurn = 1;
		this.gameLoop();
	}

	this.gameLoop = () => {
		//clear the canvas
		ctx.clearRect(0, 0, 0, canvas.height);
		var grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
		for(let i=0; i<=0.98;i+=0.03){
			grd.addColorStop(i, "white");
			grd.addColorStop(i+0.02, "red");
		}
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.clearRect(canvas.width/32, canvas.height/32, 15*canvas.width/16, 15*canvas.height/16);
		ctx.strokeStyle = 'black';
		ctx.strokeRect(canvas.width/32, canvas.height/32, 15*canvas.width/16, 15*canvas.height/16)
		//check for user interaction
		if((this.nextTurn == 0 && canvasClickedEvent && this.players[1].type == 1) || 
			(canvasClickedEvent && this.players[1].type == 0)) {
			let clickedOnDeadCell = decideCell(canvasClickedEvent);
			if(!clickedOnDeadCell){
				this.nextTurn = (this.nextTurn+1)%2;
			}	
			canvasClickedEvent = null;
		} else if(this.nextTurn==1 && this.players[1].type == 1){
			//Turn for the AI to play
			let notPlayed = true;
			while(notPlayed){
				let pickBoard = Math.floor(Math.random() * this.boards.length);
				let pickRow = Math.floor(Math.random() * this.boards[pickBoard].height);
				let pickColumn = Math.floor(Math.random() * this.boards[pickBoard].width);
				if(!this.boards[pickBoard].matched && this.boards[pickBoard].state[pickRow][pickColumn].text == ' '){
					notPlayed = false;
					console.log('AI Played!')
					this.boards[pickBoard].state[pickRow][pickColumn].text = 'X'
				}
			}
			this.nextTurn = 0;
		}
		//internal logic: check for a row of Xs formed
		for(let i=0; i<this.boards.length; i++){
			this.boards[i].checkMatched();
		}
		//draw new scene
		for(let i=0; i<this.boards.length; i++){
			let b = this.boards[i];
			ctx.clearRect(b.left, b.top, b.width*b.cellWidth, b.height*b.cellHeight);
			b.draw();
		}
		//internal logic: check if game over
		if(this.isGameOver()){
			if(this.nextTurn == 1){
				won = false;
				console.log(`${this.players[1].name} won!`)
			} else {
				won = true;
				console.log(`${this.players[0].name} won!`)
			}
			document.getElementById('gameover').style.display = "block";
			document.getElementById('gameover').style.width = "610px"; //including border size
			document.getElementById('gameover').style.height = "610px"; //including border size
			document.getElementById('restart').style.display = "block";
			document.getElementById('youwon').style.display = "block";
			document.getElementById('whoWon').style.display = "block";
			if(won){
				document.getElementById('whoWon').innerText  =`${this.players[0].name} won!`
			} else {
				document.getElementById('whoWon').innerText  =`${this.players[1].name} won!`
			}
		}
		if(!this.isGameOver()) requestAnimationFrame(this.gameLoop);
	}

	this.isGameOver = () => {
		//display the gameover screen
		let gameOver = true;
		for(let i=0; i<this.boards.length; i++){
			let b = this.boards[i];
			gameOver = gameOver && b.matched;
		}
		return gameOver;
	}
}

console.log('gameScreen.js is loaded!')

function decideCell(e){
	const coords = {
		x: e.clientX - canvas.getBoundingClientRect().left,
		y: e.clientY - canvas.getBoundingClientRect().top
	};

	let boards = window.game.boards;
	for(let i=0; i<boards.length; i++){
		let b  = boards[i];
		//dont listen on boards already matched
		if(b.top <= coords.y && b.top + b.height*b.cellHeight >= coords.y && b.left <= coords.x && b.left + b.width*b.cellWidth >= coords.x){
			if(b.matched){
				return true;
			}
			//check all cells
			for(let r=0; r<b.height; r++){
				for(let c=0; c<b.width; c++){
					let cell = b.state[r][c]
					if(cell.topx<= coords.x && cell.topy <= coords.y 
						&& cell.topx + cell.width >= coords.x && cell.topy + cell.height >= coords.y){
						//this cell is activated;
						if(cell.text == " "){
							cell.text = 'X';
							return false;
						}
					}
				}
			}
		}
	}
	return true;
}

/*Each module has its own scope. They are not sharing the global scope like "normal" scripts do. That means hello is only accessible inside the main.js module/file itself.

If you explicitly want to create a global variable, you can achieve that by creating a property on the global object, window*/
window.restartGame = function(){
  window.location.reload();
}