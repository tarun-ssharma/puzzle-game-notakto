
//import
import * as g from "./gameScreen.js"

//Get all the elements we need to attach listeners to..
const ai = document.querySelector('.ai');
const frnd = document.querySelector('.frnd');
const turnFirst = document.querySelector('.turnFirst');
const turnSecond = document.querySelector('.turnSecond');
const numBoardsOne = document.querySelector('.numBoardsOne');
const numBoardsTwo = document.querySelector('.numBoardsTwo');
const numBoardsThree = document.querySelector('.numBoardsThree');
const play = document.querySelector('.play');
const player1 = document.getElementById('player1');
let player2;

const opponentName = document.getElementById('opponentName');
let thecomp;

//local variables to store input information till before submission when we actually create game objects 
//let player;
let opponent = null;
let turn = null;
let boards = null;

//Add listeners
// ai -- opponent=0, bg=black, font=white, bg of frnd to white, font of frnd to black
// instead of applying each styles one by one, we can create two classes: selected deselected 
// and then attach the appropriate class to the element
ai.addEventListener('click', () => {
	opponent = 0;
	ai.classList.add('selected');
	frnd.classList.remove('selected');
	if(opponentName.innerHTML == "..."){
		opponentName.innerHTML = '<strong>Your opponent:</strong><input class="player" id="player2"><span id="thecomp"></span>'
		player2 = document.getElementById('player2');
		thecomp = document.getElementById('thecomp');
	}
	player2.style.display = 'none';
	thecomp.innerHTML = 'The Computer';
})

//frnd --opponent=1, bg=black, font=white, bg of frnd to white, font of frnd to black
frnd.addEventListener('click', () => {
	opponent = 1;
	frnd.classList.add('selected');
	ai.classList.remove('selected');
	if(opponentName.innerHTML == "..."){
		opponentName.innerHTML = '<strong>Your opponent:</strong><input class="player" id="player2"><span id="thecomp"></span>'
		player2 = document.getElementById('player2');
		thecomp = document.getElementById('thecomp');
	}
	player2.style.display = 'initial';
	thecomp.innerHTML = '';
})

//turnFirst -- set turn = 0,  bg=black, font=white, bg of turnSecond to white, font of turnSecond to black
turnFirst.addEventListener('click', () => {
	turn = 0;
	turnFirst.classList.add('selected');
	turnSecond.classList.remove('selected');
})

//turnSecond -- set turn = 1,  bg=black, font=white, bg of turnFirst to white, font of turnFirst to black
turnSecond.addEventListener('click', () => {
	turn = 1;
	turnSecond.classList.add('selected');
	turnFirst.classList.remove('selected');
})

//numBoardsOne -- set boards=1, add selected class, remove it from other two
numBoardsOne.addEventListener('click', ()=> {
	boards = 1;
	numBoardsOne.classList.add('selected');
	numBoardsTwo.classList.remove('selected');
	numBoardsThree.classList.remove('selected')
})
//numBoardsTwo -- set boards=2, same
numBoardsTwo.addEventListener('click', ()=> {
	boards = 2;
	numBoardsOne.classList.remove('selected');
	numBoardsTwo.classList.add('selected');
	numBoardsThree.classList.remove('selected')
})
//numBoardsThree -- set boards=2, same
numBoardsThree.addEventListener('click', ()=> {
	boards = 3;
	numBoardsOne.classList.remove('selected');
	numBoardsTwo.classList.remove('selected');
	numBoardsThree.classList.add('selected')
})

//play -- create both players, and the game object using gameScreen.js methods, hide the homeScreen, handover to gameScreen.js
play.addEventListener('click', () => {
	//check if all selected
	if(opponent === null || turn === null || boards === null || player1.value === '' || (opponent==1 && player2.value === '')){
		document.getElementById('error').innerHTML = "Please select: player name, opponent, turn and number of boards";
		return;
	}
	//TODO: how else to pass the game object across js modules?
	//console.log('play event listener triggered!')
	//this wasnt getting triggered due to default lower z-index
	window.game = new g.Game();
	document.querySelector('.homescreen').classList.add('hide'); // once its display is none, z-index wont be in the picture
	document.querySelector('canvas').classList.remove('hide');
	let player2_name = player2.style.display == 'none' ? thecomp.innerHTML: player2.value;
	window.game.createGame(opponent, turn, boards, player1.value, player2_name);
})

console.log('homeScreen.js is loaded!')