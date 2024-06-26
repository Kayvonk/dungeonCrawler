let mainEl = document.getElementsByTagName("main")[0];
let startBtn = document.getElementById("start");
let startingPosition = "r6-c6";
let playerPosition = startingPosition;
let enemyPositions = [];
let boulderPositions = [];
let attackingEnemyIndex;
let gameOver = false;
let exitTilePosition;
let exitDirection;
let round = 0;
let possibleEnemyPositions = [];
let seconds = 0;
let gameStarted = false;
let canMove = true;
startBtn.addEventListener("click", startGame);
let highScore = parseFloat(localStorage.getItem("highscore")) || 0;
let boulderTimer;
let secondsTimer;
function limitMovement() {
  canMove = false;
  setTimeout(() => {
    canMove = true;
  }, 100);
}

function dropBoulder(enemyIndex) {
  let selectedPosition = playerPosition;
  boulderPositions.push(selectedPosition);
  let selectedTile = document.querySelector("." + selectedPosition);

  let boulderShadow = document.createElement("div");
  boulderShadow.className = "boulderShadow boulderShadow-" + playerPosition;

  let boulder = document.createElement("img");
  boulder.className = "boulder boulder-" + playerPosition;
  boulder.src = "./image/boulder.png";

  selectedTile.append(boulderShadow);
  selectedTile.append(boulder);
  setTimeout(() => {
    if (selectedPosition === playerPosition) {
      return loseGame(enemyIndex);
    }
  }, 1000);
}

function startGame() {
  const currentRound = round;

  gameStarted = true;
  startBtn.style.display = "none";
  boulderTimer = setInterval(() => {
    // if (gameOver || (currentRound !== round)) {
    if (gameOver) {
      clearInterval(boulderTimer);
      return;
    }
    if (gameStarted && !gameOver) {
      dropBoulder(-1);
    }
  }, 3000);

  secondsTimer = setInterval(() => {
    if (gameOver) {
      clearInterval(secondsTimer);
      return calculateScore();
    }
    seconds++;
  }, 1000);
  displayRound();
  let newEnemyPosition =
    possibleEnemyPositions[
      Math.floor(Math.random() * possibleEnemyPositions.length)
    ];
  enemyPositions.push(newEnemyPosition);
  possibleEnemyPositions = possibleEnemyPositions.filter(
    (position) => position !== newEnemyPosition
  );
  placeEnemy(0);

  let exitTile = document.getElementById("exitTile");
  exitTile.classList.add("exitDoor");
}

function restartGame() {
  playerPosition = startingPosition;
  gameStarted = true;

  clearInterval(boulderTimer);
  clearInterval(secondsTimer);
  
  boulderTimer = setInterval(() => {
    if (gameOver) {
      clearInterval(boulderTimer);
      return;
    }
    if (gameStarted && !gameOver) {
      dropBoulder(-1);
    }
  }, 3000);

  seconds = 0;
  secondsTimer = setInterval(() => {
    if (gameOver) {
      clearInterval(secondsTimer);
      return calculateScore();
    }
    seconds++;
  }, 1000);

  let scoreDiv = document.getElementById("results");
  scoreDiv.style.display = "none";
  attackingEnemyIndex = null;
  round = -1;
  gameOver = false;
  endRound();
  let exitTile = document.getElementById("exitTile");
  exitTile.classList.add("exitDoor");
}

function calculateScore() {
  let baseScore = (round + 1) * 1000;

  let timeScore = Math.ceil((1 / seconds) * 10000) + 100;

  let finalScore = baseScore + timeScore;
  if (isFinite(finalScore) && finalScore > highScore) {
    highScore = finalScore;
    localStorage.setItem("highscore", finalScore);
  }

  let scoreDiv = document.getElementById("results");
  scoreDiv.style.display = "flex";
  scoreDiv.style.fontFamily = "Arial";
  scoreDiv.innerHTML = `
  <h2>${typeof attackingEnemyIndex === "number" ? "You lose" : "You win"} </h2>
  <p>High Score: ${highScore}</p>
  <p>Score: ${finalScore}</p>
  <p>Time: ${seconds} seconds</p>
`;

  let restartBtn = document.createElement("button");
  restartBtn.setAttribute("id", "restart");
  restartBtn.textContent = "Try Again";
  scoreDiv.append(restartBtn);
  restartBtn.addEventListener("click", restartGame);
}

function loseGame(enemyIndex) {
  attackingEnemyIndex = enemyIndex;
  gameOver = true;
}

function winGame() {
  gameOver = true;
}

function displayRound() {
  if (document.getElementById("roundCounter")) {
    document.getElementById("roundCounter").textContent =
      "Round : " + (round + 1);
  } else {
    let headerEl = document.getElementsByTagName("footer")[0];
    let roundDiv = document.createElement("p");
    roundDiv.setAttribute("id", "roundCounter");
    roundDiv.textContent = "Round : " + (round + 1);
    roundDiv.style.display = "flex";
    headerEl.append(roundDiv);
  }
}

function endRound() {
  if (round + 1 === 10) {
    return winGame();
  }
  mainEl.innerHTML = "";
  enemyPositions = [];
  boulderPositions = [];
  round++;
  createTiles();
  placePlayer1();
  displayRound();
  for (let i = 0; i < round + 1; i++) {
    let newEnemyPosition =
      possibleEnemyPositions[
        Math.floor(Math.random() * possibleEnemyPositions.length)
      ];
    enemyPositions.push(newEnemyPosition);
    possibleEnemyPositions = possibleEnemyPositions.filter(
      (position) => position !== newEnemyPosition
    );
    placeEnemy(i);
  }
}

function createTiles() {
  let exitGroup = ["r1", "c1", "c12"];
  let selectedExit;
  let exitClass;
  possibleEnemyPositions = [];
  let exitGroupSelection = exitGroup[Math.floor(Math.random() * 3)];
  if (exitGroupSelection === "r1") {
    let possiblePositions = [
      "r1-c1",
      "r1-c2",
      "r1-c3",
      "r1-c4",
      "r1-c5",
      "r1-c6",
      "r1-c7",
      "r1-c8",
      "r1-c9",
      "r1-c10",
      "r1-c11",
      "r1-c12",
    ];
    selectedExit =
      possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    exitClass = "exitTop";
  }
  if (exitGroupSelection === "c1") {
    let possiblePositions = ["r4-c1", "r3-c1", "r2-c1", "r1-c1"];
    selectedExit =
      possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    exitClass = "exitLeft";
  }
  if (exitGroupSelection === "c12") {
    let possiblePositions = ["r4-c12", "r3-c12", "r2-c12", "r1-c12"];
    selectedExit =
      possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    exitClass = "exitRight";
  }
  for (let index = 1; index <= 72; index++) {
    let tile = document.createElement("div");

    if (index <= 12) {
      tile.className = "tile r1-c" + index;
    } else if (index <= 24) {
      tile.className = "tile r2-c" + (index - 12);
    } else if (index <= 36) {
      tile.className = "tile r3-c" + (index - 24);
    } else if (index <= 48) {
      tile.className = "tile r4-c" + (index - 36);
    } else if (index <= 60) {
      tile.className = "tile r5-c" + (index - 48);
    } else if (index <= 72) {
      tile.className = "tile r6-c" + (index - 60);
    }
    let tilePosition = tile.classList[1];
    let row = tilePosition.split("-")[0].substring(1);
    let column = tilePosition.split("-")[1].substring(1);
    if (row < 5) {
      possibleEnemyPositions.push(tilePosition);
    }

    if (row === "1") {
      let wall = document.createElement("div");
      wall.className = "wall wallTop";
      tile.append(wall);
    }
    if (row === "6") {
      let wall = document.createElement("div");
      wall.className = "wall wallBottom";
      tile.append(wall);
    }
    if (column === "1") {
      let wall = document.createElement("div");
      wall.className = "wall wallLeft";
      tile.append(wall);
    }
    if (column === "12") {
      let wall = document.createElement("div");
      wall.className = "wall wallRight";
      tile.append(wall);
    }
    if (tilePosition === selectedExit) {
      exitTilePosition = tilePosition;
      exitDirection = exitClass;
      let exitTile = document.createElement("div");
      exitTile.className = round === 0 ? exitClass : "exitDoor " + exitClass;
      exitTile.setAttribute("id", "exitTile");
      tile.append(exitTile);
      tile.setAttribute("id", "exit");
    }

    mainEl.append(tile);
  }
}

createTiles();

function placePlayer1() {
  let startingTile = document.querySelector("." + startingPosition);
  let catImg = document.createElement("img");
  catImg.className = "catImg " + startingPosition;
  catImg.src = "./image/cat.png";
  startingTile.append(catImg);
}

placePlayer1();

function placeEnemy(index) {
  let startingTile = document.querySelector("." + enemyPositions[index]);
  let dogImg = document.createElement("img");
  dogImg.className = "dogImg" + index + " " + enemyPositions[index];
  dogImg.src = "./image/doge.png";
  startingTile.append(dogImg);
  startEnemyMovement(".dogImg" + index, "./image/doge.png", index);
}

function fireEnemyBeam(enemyImg, enemyIndex) {
  const currentRound = round;
  let enemyBeamTimer = setTimeout(() => {
    let possibleDirections = [];
    let enemyPosition = enemyImg.classList[1];

    let fireDown =
      parseInt(enemyPosition.charAt(1)) < parseInt(playerPosition.charAt(1));
    let fireUp =
      parseInt(enemyPosition.charAt(1)) > parseInt(playerPosition.charAt(1));
    let fireRight =
      parseInt(enemyPosition.substring(4)) <
      parseInt(playerPosition.substring(4));
    let fireLeft =
      parseInt(enemyPosition.substring(4)) >
      parseInt(playerPosition.substring(4));

    if (fireDown) {
      possibleDirections.push("fireDown");
    } else if (fireUp) {
      possibleDirections.push("fireUp");
    }
    if (fireRight) {
      possibleDirections.push("fireRight");
    } else if (fireLeft) {
      possibleDirections.push("fireLeft");
    }
    let directionSelected =
      possibleDirections[Math.floor(Math.random() * possibleDirections.length)];

    let affectedTiles = [];

    if (directionSelected === "fireDown") {
      let startRow = parseInt(enemyPosition.charAt(1));
      let endRow = parseInt(playerPosition.charAt(1));
      let column = parseInt(enemyPosition.substring(4));

      for (let i = startRow; i <= endRow; i++) {
        affectedTiles.push("r" + i + "-c" + column);
      }
    } else if (directionSelected === "fireUp") {
      let startRow = parseInt(enemyPosition.charAt(1));
      let endRow = parseInt(playerPosition.charAt(1));
      let column = parseInt(enemyPosition.substring(4));
      for (let i = startRow; i >= endRow; i--) {
        affectedTiles.push("r" + i + "-c" + column);
      }
    } else if (directionSelected === "fireLeft") {
      let row = parseInt(enemyPosition.charAt(1));
      let startColumn = parseInt(enemyPosition.substring(4));
      let endColumn = parseInt(playerPosition.substring(4));
      for (let i = startColumn; i >= endColumn; i--) {
        affectedTiles.push("r" + row + "-c" + i);
      }
    } else if (directionSelected === "fireRight") {
      let row = parseInt(enemyPosition.charAt(1));
      let startColumn = parseInt(enemyPosition.substring(4));
      let endColumn = parseInt(playerPosition.substring(4));
      for (let i = startColumn; i <= endColumn; i++) {
        affectedTiles.push("r" + row + "-c" + i);
      }
    }
    for (let j = 0; j < affectedTiles.length; j++) {
      setTimeout(() => {
        if (currentRound !== round) {
          clearTimeout(enemyBeamTimer);
          return;
        }
        let damageTile = document.querySelector("." + affectedTiles[j]);
        let originalColor = window.getComputedStyle(damageTile).backgroundColor; // Get original background color

        damageTile.style.backgroundColor = "lightsalmon";

        setTimeout(() => {
          damageTile.style.backgroundColor = originalColor; // Revert back to original color

          if (affectedTiles[j] === playerPosition) {
            loseGame(enemyIndex);
          }
        }, 500); // Revert back to original color after 500ms
      }, j * 500); // Delay each iteration by 500ms
    }
  }, 1000); // Initial delay of 1000ms before executing the code
}
function startEnemyMovement(enemyClass, enemyImgPath, enemyIndex) {
  const currentRound = round;
  let enemyTimer = setTimeout(() => {
    if (currentRound !== round) {
      clearTimeout(enemyTimer);
      return;
    }
    let isAttacking = Math.random() < 0.2;
    let enemyImg = document.querySelector(enemyClass);
    if (isAttacking) {
      enemyImg.src = "./image/dogeRedEyes.png";
      fireEnemyBeam(enemyImg, enemyIndex);
    } else {
      let directions = ["up", "down", "left", "right"];
      let directionSelected = directions[Math.floor(Math.random() * 4)];
      if (gameOver) {
        return;
      }
      if (directionSelected === "up") {
        enemyMoveUp(enemyClass, enemyImgPath, enemyIndex);
      } else if (directionSelected === "down") {
        enemyMoveDown(enemyClass, enemyImgPath, enemyIndex);
      } else if (directionSelected === "left") {
        enemyMoveLeft(enemyClass, enemyImgPath, enemyIndex);
      } else if (directionSelected === "right") {
        enemyMoveRight(enemyClass, enemyImgPath, enemyIndex);
      }
    }
    if (gameOver) {
      return;
    }
    startEnemyMovement(enemyClass, enemyImgPath, enemyIndex);
  }, 1000 / ((round + 1) * 0.5));
}

window.addEventListener("keydown", checkKeyPressed);

function checkKeyPressed(evt) {
  if (!gameStarted && evt.keyCode === 32) {
    startGame();
  } else if (gameStarted && gameOver && evt.keyCode === 32) {
    restartGame();
  }
  if (gameOver) {
    return;
  }
  if (canMove && evt.keyCode === 38) {
    if (exitDirection === "exitTop" && playerPosition === exitTilePosition) {
      endRound();
    }
    moveUp();
    limitMovement();
  } else if (canMove && evt.keyCode === 40) {
    if (exitDirection === "exitBottom" && playerPosition === exitTilePosition) {
      endRound();
    }
    moveDown();
    limitMovement();
  } else if (canMove && evt.keyCode === 37) {
    if (exitDirection === "exitLeft" && playerPosition === exitTilePosition) {
      endRound();
    }
    moveLeft();
    limitMovement();
  } else if (canMove && evt.keyCode === 39) {
    if (exitDirection === "exitRight" && playerPosition === exitTilePosition) {
      endRound();
    }
    moveRight();
    limitMovement();
  }
}

function enemyMoveUp(enemyClass, enemyImgPath, enemyIndex) {
  let enemyImg = document.querySelector(enemyClass);
  let enemyPosition = enemyImg.classList[1];
  let row = enemyPosition.split("-")[0].substring(1);
  let column = enemyPosition.split("-")[1].substring(1);
  if (row > 1) {
    let newPosition = "r" + (parseInt(row) - 1) + "-c" + column;
    enemyPositions[enemyIndex] = newPosition;
    if (playerPosition === newPosition) {
      loseGame(enemyIndex);
    }
    enemyImg.classList.add("moveUp");
    let newEnemyImg = document.createElement("img");
    newEnemyImg.className = enemyClass.substring(1) + " " + newPosition;
    newEnemyImg.src =
      attackingEnemyIndex === enemyIndex
        ? "./image/dogeAttack.png"
        : enemyImgPath;
    let nextTile = document.querySelector("." + newPosition);
    setTimeout(() => {
      enemyImg.remove();
      nextTile.append(newEnemyImg);
    }, 100);
  }
}

function enemyMoveDown(enemyClass, enemyImgPath, enemyIndex) {
  let enemyImg = document.querySelector(enemyClass);
  let enemyPosition = enemyImg.classList[1];
  let row = enemyPosition.split("-")[0].substring(1);
  let column = enemyPosition.split("-")[1].substring(1);
  if (row < 6) {
    let newPosition = "r" + (parseInt(row) + 1) + "-c" + column;
    enemyPositions[enemyIndex] = newPosition;
    if (playerPosition === newPosition) {
      loseGame(enemyIndex);
    }
    enemyImg.classList.add("moveDown");

    let newEnemyImg = document.createElement("img");
    newEnemyImg.className = enemyClass.substring(1) + " " + newPosition;
    newEnemyImg.src =
      attackingEnemyIndex === enemyIndex
        ? "./image/dogeAttack.png"
        : enemyImgPath;
    let nextTile = document.querySelector("." + newPosition);
    setTimeout(() => {
      enemyImg.remove();
      nextTile.append(newEnemyImg);
    }, 100);
  }
}

function enemyMoveLeft(enemyClass, enemyImgPath, enemyIndex) {
  let enemyImg = document.querySelector(enemyClass);
  let enemyPosition = enemyImg.classList[1];
  let row = enemyPosition.split("-")[0].substring(1);
  let column = enemyPosition.split("-")[1].substring(1);
  if (column > 1) {
    let newPosition = "r" + row + "-c" + (parseInt(column) - 1);
    enemyPositions[enemyIndex] = newPosition;
    if (playerPosition === newPosition) {
      loseGame(enemyIndex);
    }
    enemyImg.classList.add("moveLeft");

    let newEnemyImg = document.createElement("img");
    newEnemyImg.className = enemyClass.substring(1) + " " + newPosition;
    newEnemyImg.src =
      attackingEnemyIndex === enemyIndex
        ? "./image/dogeAttack.png"
        : enemyImgPath;
    let nextTile = document.querySelector("." + newPosition);
    setTimeout(() => {
      enemyImg.remove();
      nextTile.append(newEnemyImg);
    }, 100);
  }
}

function enemyMoveRight(enemyClass, enemyImgPath, enemyIndex) {
  let enemyImg = document.querySelector(enemyClass);
  let enemyPosition = enemyImg.classList[1];
  let row = enemyPosition.split("-")[0].substring(1);
  let column = enemyPosition.split("-")[1].substring(1);
  if (column < 12) {
    let newPosition = "r" + row + "-c" + (parseInt(column) + 1);
    enemyPositions[enemyIndex] = newPosition;
    if (playerPosition === newPosition) {
      loseGame(enemyIndex);
    }
    enemyImg.classList.add("moveRight");

    let newEnemyImg = document.createElement("img");
    newEnemyImg.className = enemyClass.substring(1) + " " + newPosition;
    newEnemyImg.src =
      attackingEnemyIndex === enemyIndex
        ? "./image/dogeAttack.png"
        : enemyImgPath;
    let nextTile = document.querySelector("." + newPosition);
    setTimeout(() => {
      enemyImg.remove();
      nextTile.append(newEnemyImg);
    }, 100);
  }
}

function moveUp() {
  let catImg = document.querySelector(".catImg");
  let catPosition = catImg.classList[1];
  let row = catPosition.split("-")[0].substring(1);
  let column = catPosition.split("-")[1].substring(1);
  if (row > 1) {
    let newPosition = "r" + (parseInt(row) - 1) + "-c" + column;
    if (
      enemyPositions.includes(newPosition) ||
      boulderPositions.includes(newPosition)
    ) {
      return;
    }
    catImg.classList.add("moveUp");
    playerPosition = newPosition;
    let newCatImg = document.createElement("img");
    newCatImg.className = "catImg " + newPosition;
    newCatImg.src = "./image/cat.png";
    let nextTile = document.querySelector("." + newPosition);
    setTimeout(() => {
      catImg.remove();
      nextTile.append(newCatImg);
    }, 100);
  }
}

function moveDown() {
  let catImg = document.querySelector(".catImg");
  let catPosition = catImg.classList[1];
  let row = catPosition.split("-")[0].substring(1);
  let column = catPosition.split("-")[1].substring(1);
  if (row < 6) {
    let newPosition = "r" + (parseInt(row) + 1) + "-c" + column;
    if (
      enemyPositions.includes(newPosition) ||
      boulderPositions.includes(newPosition)
    ) {
      return;
    }
    catImg.classList.add("moveDown");
    playerPosition = newPosition;
    let newCatImg = document.createElement("img");
    newCatImg.className = "catImg " + newPosition;
    newCatImg.src = "./image/cat.png";
    let nextTile = document.querySelector("." + newPosition);
    setTimeout(() => {
      catImg.remove();
      nextTile.append(newCatImg);
    }, 100);
  }
}
function moveLeft() {
  let catImg = document.querySelector(".catImg");
  let catPosition = catImg.classList[1];
  let row = catPosition.split("-")[0].substring(1);
  let column = catPosition.split("-")[1].substring(1);
  if (column > 1) {
    let newPosition = "r" + row + "-c" + (parseInt(column) - 1);
    if (
      enemyPositions.includes(newPosition) ||
      boulderPositions.includes(newPosition)
    ) {
      return;
    }
    catImg.classList.add("moveLeft");
    playerPosition = newPosition;
    let newCatImg = document.createElement("img");
    newCatImg.className = "catImg " + newPosition;
    newCatImg.src = "./image/cat.png";
    let nextTile = document.querySelector("." + newPosition);
    setTimeout(() => {
      catImg.remove();
      nextTile.append(newCatImg);
    }, 100);
  }
}

function moveRight() {
  let catImg = document.querySelector(".catImg");
  let catPosition = catImg.classList[1];
  let row = catPosition.split("-")[0].substring(1);
  let column = catPosition.split("-")[1].substring(1);
  if (column < 12) {
    let newPosition = "r" + row + "-c" + (parseInt(column) + 1);
    if (
      enemyPositions.includes(newPosition) ||
      boulderPositions.includes(newPosition)
    ) {
      return;
    }
    catImg.classList.add("moveRight");
    playerPosition = newPosition;
    let newCatImg = document.createElement("img");
    newCatImg.className = "catImg " + newPosition;
    newCatImg.src = "./image/cat.png";
    let nextTile = document.querySelector("." + newPosition);
    setTimeout(() => {
      catImg.remove();
      nextTile.append(newCatImg);
    }, 100);
  }
}
