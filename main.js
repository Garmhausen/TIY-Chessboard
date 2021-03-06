var boardWrapper = document.getElementById('boardDisplay');
var pieces = {};
var boardMap = {};
var playLoop;

// board square locations by x and y coords.
boardMap.xa = '1.6vw';
boardMap.xb = '9.7vw';
boardMap.xc = '17.6vw';
boardMap.xd = '25.7vw';
boardMap.xe = '33.8vw';
boardMap.xf = '41.8vw';
boardMap.xg = '49.7vw';
boardMap.xh = '57.8vw';
boardMap.y8 = '1.6vw';
boardMap.y7 = '9.7vw';
boardMap.y6 = '17.6vw';
boardMap.y5 = '25.7vw';
boardMap.y4 = '33.8vw';
boardMap.y3 = '41.8vw';
boardMap.y2 = '49.7vw';
boardMap.y1 = '57.8vw';

// button controls
var rewind = document.getElementById('rewind');
rewind.onclick = doRewind;
var stepBack = document.getElementById('step-back');
stepBack.onclick = doStepBack;
var playPause = document.getElementById('play-pause');
playPause.onclick = doPlayPause;
var stepForward = document.getElementById('step-forward');
stepForward.onclick = doStepForward;
var fastForward = document.getElementById('fast-forward');
fastForward.onclick = doFastForward;
var paused = true; // initially, it's paused.

// 1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 Be7 5.Nf3
// the array is [id, startx, starty, endx, endy]

var sequence = [
  ['wdpawn', boardMap.xd, boardMap.y2, boardMap.xd, boardMap.y4, 'd2', 'd4'],
  ['bkknight', boardMap.xg, boardMap.y8, boardMap.xf, boardMap.y6, 'g8', 'f6'],
  ['wcpawn', boardMap.xc, boardMap.y2, boardMap.xc, boardMap.y4, 'c2', 'c4'],
  ['bepawn', boardMap.xe, boardMap.y7, boardMap.xe, boardMap.y6, 'e7', 'e6'],
  ['wgpawn', boardMap.xg, boardMap.y2, boardMap.xg, boardMap.y3, 'g2', 'g3'],
  ['bdpawn', boardMap.xd, boardMap.y7, boardMap.xd, boardMap.y5, 'd7', 'd5'],
  ['wkbishop', boardMap.xf, boardMap.y1, boardMap.xg, boardMap.y2, 'f1', 'g2'],
  ['bkbishop', boardMap.xf, boardMap.y8, boardMap.xe, boardMap.y7, 'f8', 'e7'],
  ['wkknight', boardMap.xg, boardMap.y1, boardMap.xf, boardMap.y3, 'g1', 'f3']
];

var sequenceTracker = 0;

function buildBoard() {
  let colArray = ['x', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'x'];
  let rowArray = ['x', 8, 7, 6, 5, 4, 3, 2, 1, 'x'];
  for (var i = 0; i < rowArray.length; i++) {
    let white = false;
    if (rowArray[i] % 2 === 0){
      white = true;
    }
    for (var j = 0; j < colArray.length; j++) {
      let build = document.createElement("div");
      if (colArray[i] === 'x' && rowArray[j] === 'x') {
        build.setAttribute("class", "corner");
      } else if (j === 0) {
        build.setAttribute("class", "left-number");
        build.innerText = rowArray[i];
      } else if (j === 9) {
        build.setAttribute("class", "right-number");
        build.innerText = rowArray[i];
      } else if (i === 0) {
        build.setAttribute("class", "top-letter");
        build.innerText = colArray[j];
      } else if (i === 9) {
        build.setAttribute("class", "bottom-letter");
        build.innerText = colArray[j];
      } else {
        if (white) {
          build.setAttribute("class", "wspace");
          white = false;
        } else {
          build.setAttribute("class", "bspace");
          white = true;
        }
        build.setAttribute("id", colArray[j] + rowArray[i]);
      }
      boardWrapper.appendChild(build);
    }
  }
}

function resetPieces() {

  document.getElementById('bqrook').style.transform = "translate(" + boardMap.xa + ", " + boardMap.y8 + ")";
  document.getElementById('bqknight').style.transform = "translate(" + boardMap.xb + ", " + boardMap.y8 + ")";
  document.getElementById('bqbishop').style.transform = "translate(" + boardMap.xc + ", " + boardMap.y8 + ")";
  document.getElementById('bqueen').style.transform = "translate(" + boardMap.xd + ", " + boardMap.y8 + ")";
  document.getElementById('bking').style.transform = "translate(" + boardMap.xe + ", " + boardMap.y8 + ")";
  document.getElementById('bkbishop').style.transform = "translate(" + boardMap.xf + ", " + boardMap.y8 + ")";
  document.getElementById('bkknight').style.transform = "translate(" + boardMap.xg + ", " + boardMap.y8 + ")";
  document.getElementById('bkrook').style.transform = "translate(" + boardMap.xh + ", " + boardMap.y8 + ")";

  document.getElementById('bapawn').style.transform = "translate(" + boardMap.xa + ", " + boardMap.y7 + ")";
  document.getElementById('bbpawn').style.transform = "translate(" + boardMap.xb + ", " + boardMap.y7 + ")";
  document.getElementById('bcpawn').style.transform = "translate(" + boardMap.xc + ", " + boardMap.y7 + ")";
  document.getElementById('bdpawn').style.transform = "translate(" + boardMap.xd + ", " + boardMap.y7 + ")";
  document.getElementById('bepawn').style.transform = "translate(" + boardMap.xe + ", " + boardMap.y7 + ")";
  document.getElementById('bfpawn').style.transform = "translate(" + boardMap.xf + ", " + boardMap.y7 + ")";
  document.getElementById('bgpawn').style.transform = "translate(" + boardMap.xg + ", " + boardMap.y7 + ")";
  document.getElementById('bhpawn').style.transform = "translate(" + boardMap.xh + ", " + boardMap.y7 + ")";


  document.getElementById('wapawn').style.transform = "translate(" + boardMap.xa + ", " + boardMap.y2 + ")";
  document.getElementById('wbpawn').style.transform = "translate(" + boardMap.xb + ", " + boardMap.y2 + ")";
  document.getElementById('wcpawn').style.transform = "translate(" + boardMap.xc + ", " + boardMap.y2 + ")";
  document.getElementById('wdpawn').style.transform = "translate(" + boardMap.xd + ", " + boardMap.y2 + ")";
  document.getElementById('wepawn').style.transform = "translate(" + boardMap.xe + ", " + boardMap.y2 + ")";
  document.getElementById('wfpawn').style.transform = "translate(" + boardMap.xf + ", " + boardMap.y2 + ")";
  document.getElementById('wgpawn').style.transform = "translate(" + boardMap.xg + ", " + boardMap.y2 + ")";
  document.getElementById('whpawn').style.transform = "translate(" + boardMap.xh + ", " + boardMap.y2 + ")";

  document.getElementById('wqrook').style.transform = "translate(" + boardMap.xa + ", " + boardMap.y1 + ")";
  document.getElementById('wqknight').style.transform = "translate(" + boardMap.xb + ", " + boardMap.y1 + ")";
  document.getElementById('wqbishop').style.transform = "translate(" + boardMap.xc + ", " + boardMap.y1 + ")";
  document.getElementById('wqueen').style.transform = "translate(" + boardMap.xd + ", " + boardMap.y1 + ")";
  document.getElementById('wking').style.transform = "translate(" + boardMap.xe + ", " + boardMap.y1 + ")";
  document.getElementById('wkbishop').style.transform = "translate(" + boardMap.xf + ", " + boardMap.y1 + ")";
  document.getElementById('wkknight').style.transform = "translate(" + boardMap.xg + ", " + boardMap.y1 + ")";
  document.getElementById('wkrook').style.transform = "translate(" + boardMap.xh + ", " + boardMap.y1 + ")";
}

function buildPieces() {

  pieces.nameArrayBlack = ['bqrook', 'bqknight', 'bqbishop', 'bqueen', 'bking', 'bkbishop', 'bkknight', 'bkrook', 'bapawn', 'bbpawn', 'bcpawn', 'bdpawn', 'bepawn', 'bfpawn', 'bgpawn', 'bhpawn'];
  pieces.nameArrayWhite = ['wapawn', 'wbpawn', 'wcpawn', 'wdpawn', 'wepawn', 'wfpawn', 'wgpawn', 'whpawn', 'wqrook', 'wqknight', 'wqbishop', 'wqueen', 'wking', 'wkbishop', 'wkknight', 'wkrook'];

  for (var i = 0; i < pieces.nameArrayBlack.length; i++) {
    // set attributes
    let build = document.createElement('img');
    build.setAttribute('class', 'piece');
    build.setAttribute('id', pieces.nameArrayBlack[i]);

    // find correct image based on name
    if (pieces.nameArrayBlack[i] === 'bqrook' || pieces.nameArrayBlack[i] === 'bkrook') {
      build.setAttribute('src', 'images/br.png');
    } else if (pieces.nameArrayBlack[i] === 'bqknight' || pieces.nameArrayBlack[i] === 'bkknight') {
      build.setAttribute('src', 'images/bn.png');
    } else if (pieces.nameArrayBlack[i] === 'bqbishop' || pieces.nameArrayBlack[i] === 'bkbishop') {
      build.setAttribute('src', 'images/bb.png');
    } else if (pieces.nameArrayBlack[i] === 'bqueen') {
      build.setAttribute('src', 'images/bq.png');
    } else if (pieces.nameArrayBlack[i] === 'bking') {
      build.setAttribute('src', 'images/bk.png');
    } else {
      build.setAttribute('src', 'images/bp.png');
    }

    boardWrapper.appendChild(build);
  }

  for (var i = 0; i < pieces.nameArrayWhite.length; i++) {
    // set attributes
    let build = document.createElement('img');
    build.setAttribute('class', 'piece');
    build.setAttribute('id', pieces.nameArrayWhite[i]);

    // find correct image based on name
    if (pieces.nameArrayWhite[i] === 'wqrook' || pieces.nameArrayWhite[i] === 'wkrook') {
      build.setAttribute('src', 'images/wr.png');
    } else if (pieces.nameArrayWhite[i] === 'wqknight' || pieces.nameArrayWhite[i] === 'wkknight') {
      build.setAttribute('src', 'images/wn.png');
    } else if (pieces.nameArrayWhite[i] === 'wqbishop' || pieces.nameArrayWhite[i] === 'wkbishop') {
      build.setAttribute('src', 'images/wb.png');
    } else if (pieces.nameArrayWhite[i] === 'wqueen') {
      build.setAttribute('src', 'images/wq.png');
    } else if (pieces.nameArrayWhite[i] === 'wking') {
      build.setAttribute('src', 'images/wk.png');
    } else {
      build.setAttribute('src', 'images/wp.png');
    }

    boardWrapper.appendChild(build);
  }
}

function animationForward(array) {
  console.log("animation call is successful using this array: " + array);
  let piece = document.getElementById(array[0]);
  let x = array[3];
  let y = array[4];
  // document.getElementById
  piece.style.transform = "translate(" + x + ", " + y + ")";

}

function animationBackward(array) {
  console.log("animation call is successful using this array: " + array);
  let piece = document.getElementById(array[0]);
  let x = array[1];
  let y = array[2];
  piece.style.transform = "translate(" + x + ", " + y + ")";
}

function doRewind(event) {
  console.log("rewind");
  sequenceTracker = 0;
  console.log("new sequence position: " + sequenceTracker);
  resetPieces();
}
function doStepBack(event) {
  console.log("step back");
  if (sequenceTracker > 0) {
    animationBackward(sequence[sequenceTracker - 1]);
    sequenceTracker--;
    console.log("new sequence position: " + sequenceTracker);
  }
}
function doPlayPause(event) {
  if (paused) {
    paused = false;
    console.log("playing");
    playPause.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';

    // BEGIN play animation
    playLoop = window.setInterval(doStepForward, 2000);

  } else {
    paused = true;
    console.log("paused");
    playPause.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';

    // END play animation
    clearInterval(playLoop);
  }
}
function doStepForward(event) {
  console.log("step forward");
  if (sequenceTracker < 9) {
    animationForward(sequence[sequenceTracker]);
    sequenceTracker++;
    console.log("new sequence position: " + sequenceTracker);
  }

}
function doFastForward(event) {
  console.log("fast forward");
  while (sequenceTracker < 9) {
    animationForward(sequence[sequenceTracker]);
    sequenceTracker++;
  }
  console.log("new sequence position: " + sequenceTracker);
}

buildBoard();   // build the game board DOM tree...
buildPieces();  // create the piece elements and append them to the wrapper...
resetPieces();  // get starting locations for the pieces
