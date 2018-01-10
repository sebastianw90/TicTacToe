var fieldButsColl = document.getElementsByClassName('field');
var fieldButs = [];
for (var i = 0; i < fieldButsColl.length; i++) {
	fieldButs.push(fieldButsColl[i]);
}
var move = 1;
var board = document.getElementById('board');
var boardStart = board.innerHTML;
var lastInput = "";
var compClickFieldNr = "";
var usedButs = [];
var rowsColsDiags = ['row1', 'row2', 'row3', 'col1', 'col2', 'col3', 'diag1', 'diag2'];
var endOfGameStatus = false;
var playersSign = "";
var computersSign = "";
var modal = document.getElementById('chooseSign');
var oBut = document.getElementById('oBut');
var xBut = document.getElementById('xBut');
var modal2 = document.getElementById('chooseDiff');
var easyBut = document.getElementById('easy');
var hardBut = document.getElementById('hard');
var gameDiff = "";


window.onload = function() {
	modal.style.display = 'block';
}

function addEvLisField(item) {
	item.addEventListener('click', function() {
		if (move % 2 == 0) {
			if (playersSign == "O") {
				item.innerHTML = 'X';
			} else {
				item.innerHTML = 'O';
			}
		} else {
			if (playersSign == "O") {
				item.innerHTML = 'O';
			} else {
				item.innerHTML = 'X';
			}
		}
		move++;
		item.disabled = true;
		lastInput = item.innerHTML;
		usedButs.push(item.id)
		winCheck();
		if (move % 2 == 0 && endOfGameStatus == false) {
			computerMove();
		}
		if (move == 10) {
			setTimeout(reset, 1000);
		}
	})
}

function activFields() {
	fieldButs.forEach(addEvLisField);
}

activFields();

function reset() {
	board.innerHTML = boardStart;
	fieldButsColl = document.getElementsByClassName('field');
	fieldButs = [];
	for (var i = 0; i < fieldButsColl.length; i++) {
		fieldButs.push(fieldButsColl[i]);
	}
	activFields();
	move = 1;
	usedButs = [];
	endOfGameStatus = false;
}

function resetBut() {
	reset();
	modal = document.getElementById('chooseSign');
	oBut = document.getElementById('oBut');
	xBut = document.getElementById('xBut');
	modal2 = document.getElementById('chooseDiff');
	easyBut = document.getElementById('easy');
	hardBut = document.getElementById('hard');
	gameDiff = "";
	oBut.addEventListener('click', function() {
		modal.style.display = "none";
		modal2.style.display = 'block';
	    playersSign = "O";
	    computersSign = "X";
	})
	xBut.addEventListener('click', function() {
		modal.style.display = "none";
		modal2.style.display = 'block';
	    playersSign = "X";
	    computersSign = "O";
	})
	easyBut.addEventListener('click', function() {
	modal2.style.display = 'none';
	})
	hardBut.addEventListener('click', function() {
		modal2.style.display = 'none';
		gameDiff = 'hard';
	})
	modal.style.display = "block";
}

function computerMove() {
	if (endOfGameStatus == false && move < 10) {
		// preventing unwanted user input
		for (var i = 0; i < fieldButsColl.length; i++) {
			fieldButsColl[i].disabled = true;
		}
		setTimeout(function() {
			for (var j = 0; j < fieldButsColl.length; j++) {
				fieldButsColl[j].disabled = false;
			}
			for (var k = 0; k < usedButs.length; k++) {
				var butToAble = document.getElementById(usedButs[k]);
				butToAble.disabled = true;
			}
		// end of preventing unwanted user input

		// computers AI
			var butToClick = "";
			var arrOfContComp = [];
			var arrOfContPlayer = [];
			if (gameDiff == 'hard') {
				// computers first move
				if (move == 2) {
					var firstMove = document.getElementById(usedButs[0]);
					if ($(firstMove).hasClass('corner') == true) {
						butToClick = "5";
					} else if ($(firstMove).hasClass('center') == true) {
						var getCornerButs = document.getElementsByClassName('corner');
						var getCornerButsArr = [];
						for (var s = 0; s < getCornerButs.length; s++) {
							getCornerButsArr.push(getCornerButs[s].id);
						}
						var lotto = Math.floor(Math.random() * 4);
						butToClick = getCornerButsArr[lotto];
						butToClick = butToClick.toString();
					} else {
						butToClick = "5";
					}
				}
				if (butToClick == "") {
					// checking the board
					for (var l = 0; l < rowsColsDiags.length; l++) {
						var lineToCheck = document.getElementsByClassName(rowsColsDiags[l]);
						var arrOfCont = [];
						for (var m = 0; m < lineToCheck.length; m++) {
							if (lineToCheck[m].innerHTML == computersSign) {
								arrOfCont.push(lineToCheck[m].innerHTML);
							}
						}
						if (arrOfCont.length == 2) {
							arrOfContComp.push(rowsColsDiags[l]);
						}
						arrOfCont = [];
						for (var o = 0; o < lineToCheck.length; o++) {
							if (lineToCheck[o].innerHTML == playersSign) {
								arrOfCont.push(lineToCheck[o].innerHTML);
							}
						}
						if (arrOfCont.length == 2) {
							arrOfContPlayer.push(rowsColsDiags[l]);
						}
					}
					// finding the potential winning move for computer
					if (arrOfContComp.length > 0) {
						label1 : for (var q = 0; q < arrOfContComp.length; q++) {
							var lineToAttack = document.getElementsByClassName(arrOfContComp[q]);
							for (var n = 0; n < lineToAttack.length; n++) {
								if (lineToAttack[n].innerHTML == "") {
									if (usedButs.indexOf(lineToAttack[n].id) == -1) {
										butToClick = lineToAttack[n].id;
										break label1;
									}
								}
							}
						}
					}
					// finding the potential winning move for player
					if (arrOfContPlayer.length > 0 && butToClick == "") {
						label2 : for (var r = 0; r < arrOfContPlayer.length; r++) {
							var lineToBlock = document.getElementsByClassName(arrOfContPlayer[r]);
							for (var p = 0; p < lineToBlock.length; p++) {
								if (lineToBlock[p].innerHTML == "") {
									if (usedButs.indexOf(lineToBlock[p].id) == -1) {
										butToClick = lineToBlock[p].id;
										break label2;
									}
								}
							}
						}
					}
					// potential evasive maneuver after players second move
					if (butToClick == "") {
						if (move == 4) {
							var arrDiags = ['diag1', 'diag2'];
							var onDiagId = "";
							for (var t = 0; t < arrDiags.length; t++) {
								var getDiag = document.getElementsByClassName(arrDiags[t]);
								var diagContArr = [];
								for (var u = 0; u < getDiag.length; u++) {
									if (getDiag[u].innerHTML != "") {
										diagContArr.push(getDiag[u].innerHTML);
									}
								}
								if (diagContArr.length == 3) {
									for (var v = 0; v < getDiag.length; v++) {
										if (getDiag[v].innerHTML == computersSign) {
											onDiagId = getDiag[v].id;
										}
									}
								}
							}
							var onDiag = document.getElementById(onDiagId);
						}
						if (onDiag) {
							var onDiagClasses = onDiag.classList;
							var arrOfClasses = [onDiagClasses[1], onDiagClasses[2]];
							label3 : for (var w = 0; w < arrOfClasses.length; w++) {
								var lineToFind = document.getElementsByClassName(arrOfClasses[w]);
								for (var x = 0; x < lineToFind.length; x++) {
									if (lineToFind[x].innerHTML == "" && $(lineToFind[x]).hasClass('corner')) {
										butToClick = lineToFind[x].id;
										break label3;
									} 
								}
							}
							if (butToClick == "") {
								label4 : for (var y = 0; y < arrOfClasses.length; y++) {
									var lineToFind = document.getElementsByClassName(arrOfClasses[y]);
									for (var z = 0; z < lineToFind.length; z++) {
										if (lineToFind[z].innerHTML == "" && $(lineToFind[z]).hasClass('side')) {
											butToClick = lineToFind[z].id;
											break label4;
										}
									}
								}
							}
						} else {
							// forcing player to defense
							label5 : for (var a = 0; a < rowsColsDiags.length; a++) {
								var lineToCheck = document.getElementsByClassName(rowsColsDiags[a]);
								var arrOfCont = [];
								var lineToFind = "";
								for (var b = 0; b < lineToCheck.length; b++) {
									if (lineToCheck[b].innerHTML == computersSign || lineToCheck[b].innerHTML == "") {
										arrOfCont.push(lineToCheck[b].innerHTML);
									}
								}
								if (arrOfCont.length == 3) {
									if (a < 6) {
										if (arrOfCont.indexOf(computersSign) != -1) {
											lineToFind = document.getElementsByClassName(rowsColsDiags[a]);
											for (var c = 0; c < lineToFind.length; c++) {
												for (var d = 0; d < rowsColsDiags.length; d++) {
													var arrOfCont2 = [];
													lineToFind2 = document.getElementsByClassName(rowsColsDiags[d]);
													for (var e = 0; e < lineToFind2.length; e++) {
														if (lineToFind2[e].innerHTML == "") {
															arrOfCont2.push(lineToFind2[e].id);
														}
													}
													if (arrOfCont2.length == 3 && arrOfCont2.indexOf(lineToFind[c].id) != -1) {
														butToClick = lineToFind[c].id;
														console.log('success');
														break label5;
													}
												}
											}
										}
									} else {
										var getElementsOnDiag = document.getElementsByClassName(rowsColsDiags[a]);
										for (var f = 0; f < getElementsOnDiag.length; f++) {
											var classesOfEl = getElementsOnDiag[f].classList;
											var arrToSearch = [classesOfEl[1], classesOfEl[2]];
											var arrOfCont = [];
											var findEls1 = document.getElementsByClassName(arrToSearch[0]);
											var findEls2 = document.getElementsByClassName(arrToSearch[1]);
											for (var g = 0; g < arrToSearch.length; g++) {
												if (findEls1[g].innerHTML == playersSign) {
													arrOfCont.push(playersSign);
												}
												if (findEls2[g].innerHTML == playersSign) {
													arrOfCont.push(playersSign);
												}
											}
											if (arrOfCont.length == 2) {
												if (getElementsOnDiag[f].innerHTML == "") {
													butToClick = getElementsOnDiag[f].id;
													console.log('succ 2');
													break label5;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			do {
				compClickFieldNr = Math.floor(Math.random() * 9 + 1);
				compClickFieldNr = compClickFieldNr.toString();
			} while (usedButs.indexOf(compClickFieldNr) != -1);
			
			if (butToClick == "") {
				var compClickField = document.getElementById(compClickFieldNr);
				console.log('random')
				
			} else {
				var compClickField = document.getElementById(butToClick);
			}
			compClickField.click();
			butToClick = "";
		// end of computers AI
		}, 500)
	}
}

function winCheck() {
	for (var i = 0; i < rowsColsDiags.length; i++) {
		var lineToCheck = document.getElementsByClassName(rowsColsDiags[i]);
		var arrOfCont = [];
		for (var j = 0; j < lineToCheck.length; j++) {
			arrOfCont.push(lineToCheck[j].innerHTML);
		}
		var arrReduce = arrOfCont.reduce(function(a, b){ return (a === b) ? a : false; });
		if (arrReduce == "X" || arrReduce == "O") {
			endOfGameStatus = true;
			for (var k = 0; k < lineToCheck.length; k++) {
				lineToCheck[k].classList.add('winLine');
			}
			for (var l = 0; l < fieldButsColl.length; l++) {
				fieldButsColl[l].disabled = true;
			}
			setTimeout(reset, 1000);
			return;
		}
	}
}	

oBut.addEventListener('click', function() {
	modal.style.display = "none";
	modal2.style.display = 'block';
    playersSign = "O";
    computersSign = "X";
})

xBut.addEventListener('click', function() {
	modal.style.display = "none";
	modal2.style.display = 'block';
    playersSign = "X";
    computersSign = "O";
})

easyBut.addEventListener('click', function() {
	modal2.style.display = 'none';
})

hardBut.addEventListener('click', function() {
	modal2.style.display = 'none';
	gameDiff = 'hard';
})


