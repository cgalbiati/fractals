'use strict';

var numHits = 0;
// var WALKER_COLOR = 'rgb(30,30,30)';
var WALKER_COLOR = [20,20,20];
var BR_COLOR = [0,0,0];
// var blobColor = [0,255,0];
var blobColor = [0,0,0];
var WALKER_WIDTH = 4;
var blobWidth = 1;
var blob_growth = .5;
var NUM_WALKERS = 10;
var MAX_ITERATIONS = 500000;
var MAX_HITS = getWidth()*3;
var board = makeBoard(getWidth(), getHeight());

//choose positions of seeds
function plantSeeds(ctx, data){
  var color = toRGB(blobColor);
  var seeds = genSeeds(data);
  seeds.forEach(function(seedPos){
    if(drawType === 'canvas'){
      ctx.beginPath();
      ctx.arc(seedPos[0], seedPos[1], 1, 0, 360);
      ctx.fillStyle = color;
      ctx.fill();
    }
    else drawLineGL(null, [seedPos[0]+1, seedPos[1], seedPos[0], seedPos[1]], blobColor);
    board[seedPos[0]][seedPos[1]] = 1;
  });
}

function genSeeds(data){
  return [[getWidth()/2, getHeight()/2]];
}

function resetState(){
  board = makeBoard(getWidth(), getHeight());
  if (color === 'rainbow') blobColor = [0,255,0];
  numHits = 0;
}

//determines if a point is inside the image bounds
function testBounds(){
 return true
}

//tests if each pixel is part of blob and returns pixel num || -1
function compColorArea(colorsArr, testingArr, errorMargin){
  // console.log('comparing', colorsArr, testingArr)
  for(var i = 0; i<testingArr.length; i+=4){
    for(var j = 0; j<colorsArr.length; j++){
      //if color at that spot is higher than walker color and not alpha value
      if(j !== 3 && testingArr[i+j] > colorsArr[j] + errorMargin) {
        //test to make sure alpha val is not skewing numbers
        // console.log('found intersect', i, j, testingArr[i+j], testingArr[j], testingArr[i+3], testingArr)
        var alpha = testingArr[i+3];
        //returns n where matching pixel is nth in testing arr
        if(alpha > 100) return Math.floor(i/4);
      }
    }
  }
  return -1;
}
function walkRecurse(ctx, oldPos, maxIterations, iteration, maxHits, runOpt){
  //get land pixel
  var newPos = movePos(oldPos);
  // check for collisions
  var collisionPixel = findColision(newPos[0], newPos[1], WALKER_WIDTH/2);
  if (collisionPixel){
    //add pts to board
    var points = getPointsOnLine(collisionPixel[0], collisionPixel[1], oldPos[0], oldPos[1]);
    points.forEach(function(pt){
      board[pt[0]][pt[1]] = 1;
    })
    //draw growth
    drawLine(ctx, genLine(collisionPixel[0], collisionPixel[1], oldPos[0], oldPos[1], 1), blobColor, blobWidth);
    numHits ++;
    changeColor();
    //corner respawn
    newPos = pickCorner(Math.floor(Math.random()*6), getWidth()-1, getHeight()-1);
  } else {
    //draw walker (only if no colision to aviod drawing over)
    if (watchDraw) drawLine(ctx, [oldPos[0], oldPos[1], newPos[0], newPos[1]], WALKER_COLOR, WALKER_WIDTH);
  
  }
  
  if(runOpt === 'frame'){
    //runs only when visible
    if (iteration < maxIterations && numHits < maxHits && contDrawing) {
      window.requestAnimFrame(walkRecurse.bind(null, ctx, newPos, maxIterations, iteration+1, maxHits));
    } else console.log('done')
  }

  else if (iteration < maxIterations && numHits < maxHits && contDrawing) {
    //runs all the time
    setTimeout(function(){
      if (iteration < maxIterations && numHits < maxHits && contDrawing) { 
        walkRecurse(ctx, newPos, maxIterations, iteration+1, maxHits);
      } else console.log('done', maxHits, numHits, iteration)
    }, .000000000001);
  }

}

//returns intersection position within radius of x, y or null
function findColision(x, y, radius){
  if(!radius) radius = 1;
  var xMin = x - radius < 0 ? 0 : x - radius;
  var yMin = y - radius < 0 ? 0 : y - radius;
  var xMax = x + radius >= getWidth() ? getWidth() - 1 : x + radius;
  var yMax = y + radius >= getHeight() ? getHeight() - 1 : y + radius;

  for (var i = xMin; i <= xMax; i++){
    for (var j = yMin; j <= yMax; j++){
      if (board[i][j] !== 0) return [i, j];
    }
  }
  return null;
}

//queries image data
function walkRecurseSlow(ctx, oldPos, maxIterations, iteration, maxHits, runOpt){
  var newPos = movePos(oldPos);
  //get land pixel
  var color = getColorArea(ctx, newPos, WALKER_WIDTH);

  // reliably tests if point is on blob
  // if((color[0]>WALKER_COL_ARR[0]+20 || color[1]>WALKER_COL_ARR[1]+20 || color[2]>WALKER_COL_ARR[2]+20) && color[3]>50) {
  var collisionPixel = compColorArea(WALKER_COL_ARR, color, 20);
  if (collisionPixel>-1){
    //find position of colision pixel
    var pixelPos = [ Math.floor(newPos[0]-WALKER_WIDTH/2) + collisionPixel % WALKER_WIDTH, Math.floor(newPos[1]-WALKER_WIDTH/2) + Math.floor(collisionPixel / WALKER_WIDTH) ];

    //draw growth
    drawLine(ctx, genLine(oldPos[0], oldPos[1], pixelPos[0], pixelPos[1], blob_growth), toRGB(blobColor), blobWidth);
    numHits ++;
    changeColor();
    //corner respawn
    newPos = pickCorner(Math.floor(Math.random()*6), getWidth(), getHeight());
    // random respawn
    // newPos = [Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight) ]
  } else {
    //draw walker (only if no colision to aviod drawing over)
    if (watchDraw) drawLine(ctx, [oldPos[0], oldPos[1], newPos[0], newPos[1]], WALKER_COLOR, WALKER_WIDTH);
  
  }
  
  if(runOpt === 'frame'){
    //runs only when visible
    if (iteration < maxIterations && numHits < maxHits && contDrawing) {
      window.requestAnimFrame(walkRecurse.bind(null, ctx, newPos, maxIterations, iteration+1, maxHits));
    } else console.log('done')
  }

  else if (iteration < maxIterations && numHits < maxHits && contDrawing) {
    //runs all the time
    setTimeout(function(){
      if (iteration < maxIterations && numHits < maxHits && contDrawing) { 
        walkRecurse(ctx, newPos, maxIterations, iteration+1, maxHits);
      } else console.log('done', maxHits, numHits, iteration)
    }, .000000000001);
  }

}

function movePos ([x,y]){

  do {
    var xChange = Math.round((Math.random()-0.5)*6);
  } while (xChange === 0)
  do {
    var yChange = Math.round((Math.random()-0.5)*6);
  } while (yChange === 0)


  // if 0, pref move 1 towards center
  // if (xChange === 0) xChange = x < getWidth()/2 ? 1 : -1;
  // if (yChange === 0) yChange = y < getHeight()/2 ? 1 : -1;
  //bounce
  var newX = (x + xChange < 0 || x + xChange >= getWidth()) ? x - xChange : x + xChange;
  var newY = (y + yChange < 0 || y + yChange >= getHeight()) ? y - yChange : y + yChange;
  // var newX = (x + xChange < 0 || x + xChange >= window.innerWidth) ? Math.random()*getWidth() : x + xChange;
  // var newY = (y + yChange < 0 || y + yChange >= window.innerHeight) ? Math.random()*getHeight() : y + yChange;
  return [newX, newY];
}



function drawDLA(ctx, data){
  clearGL();
  resetState();
  plantSeeds(ctx, data);

  //start walkers
  // startWalkers(ctx, walkIt, 1, 1000)
  startWalkers(ctx, walkRecurse, NUM_WALKERS, MAX_ITERATIONS, MAX_HITS);

}

function startWalkers(ctx, walkFn, numWalkers, iterations, maxHits){
  for (var i = 0; i<numWalkers; i++){
    [0, 1, 2, 3, 4, 5, 6, 7].forEach(function(j){
      var [x,y] = pickCorner(j, getWidth()-1, getHeight()-1);
      // console.log('starting',j, x, y)
      walkFn(ctx, [x, y], iterations, 0, maxHits);
    });
  }
}

function pickCorner(n, difX, difY){
  // console.log(n)
  var halfX = Math.floor(difX/2);
  var halfY = Math.floor(difY/2);
  // console.log('starting walker', difY, difX)
  switch(n){
    case 0:
      return [0, 0];
    case 1:
      return [halfX, 0];
    case 2:
      return [0, halfY];
    case 3:
      return [difX, 0];
    case 4:
      return [0, difY];
    case 5:
      return [halfX, difY];
    case 6:
      return [difX, halfY];
    default:
      return [difX, difY];

  }
}

// makes 2-d array to hold blob data - inits all points as 0
function makeBoard(width, height){
  var dataArr = [];
  for (var i = 0; i < width; i++){
    dataArr.push([]);
    for (var j = 0; j < height; j++) {
      dataArr[i].push(0);
    }
  }
  return dataArr;
}


//start at edge - weight away from edge


// function walkIt(ctx, startPos, max){
//   var newPos = startPos;
//   console.log('newPos', newPos)
//   var oldPos, color;

//     window.requestAnimFrame(walkerStuff)
  

//   // for(var i = 0; i<max; i++){
//   //   oldPos = newPos.slice();
//   //   newPos = movePos(oldPos);
//   //   console.log('newPos', newPos)
//   //   color = ctx.getImageData(newPos[0], newPos[1], 1, 1).data.slice(0,3);
//   //   if(color[0]!==0 || color[1]!==0 || color[2]!==0) {
//   //     //draw growth
//   //     drawLine(ctx, genLine(oldPos[0], oldPos[1], newPos[0], newPos[1], 3));
//   //     newPos = [Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight) ]
//   //     console.log('intersect', newPos)
//   //   }

//   function walkerStuff(){
//     oldPos = newPos.slice();
//     newPos = movePos(oldPos);
//     console.log('newPos', newPos)
//     drawLine(ctx, [oldPos[0], oldPos[1], newPos[0], newPos[1]], "red")
//     color = ctx.getImageData(newPos[0], newPos[1], 1, 1).data.slice(0,3);
//     // if(color[0]!==0 || color[1]!==0 || color[2]!==0) {
//     //   //draw growth
//     //   drawLine(ctx, genLine(oldPos[0], oldPos[1], newPos[0], newPos[1], 3));
//     //   newPos = [Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight) ]
//     //   console.log('intersect', newPos)
//     // }
//   }
// }

// function moveLeft([x, y]){
//   var xChange = (Math.random()-.8)*2;
//   var yChange = (Math.random()-.5) * 2;
//   // console.log(xChange, yChange)

//   //bounce
//   var newX = (x + xChange < 0 || x + xChange >= window.innerWidth) ? x - xChange : x + xChange;
//   var newY = (y + yChange < 0 || y + yChange >= window.innerHeight) ? y - yChange : y + yChange;
  
//   return [newX, newY];
// }


// document.addEventListener("DOMContentLoaded", function(event) { 
//   var canvas = document.getElementById('canvas');
//   var ctx = init(canvas, data);

//   plantSeeds(ctx, data);

  
//   //start walkers
//   // startWalkers(ctx, walkIt, 1, 1000)
//   startWalkers(ctx, walkRecurse, NUM_WALKERS, MAX_ITERATIONS, MAX_HITS);


// });


