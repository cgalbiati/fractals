'use strict';

let numHits = 0;
const WALKER_COLOR = 'rgb(30,30,30)';
const WALKER_COL_ARR = [20,30,40];
const BR_COLOR = [0,0,0];
let blobColor = [0,255,0];
const WALKER_WIDTH = 8;
let blobWidth = 1;
let blob_growth = .5;
const NUM_WALKERS = 5;
const MAX_ITERATIONS = 500000;
const MAX_HITS = 800;

//choose positions of seeds
function plantSeeds(ctx, data){
  let color = toRGB(blobColor);
  var seeds = genSeeds(data);
  seeds.forEach(function(seedPos){
    // console.log('seed', seedPos)
    ctx.beginPath();
    ctx.arc(seedPos[0], seedPos[1], 2, 0, 360);
    ctx.fillStyle = color
    ctx.fill();
  })
}

function genSeeds(data){
  return [[getWidth()/2, getHeight()/2]];
}

function resetState(){
  blobColor = [0,255,0];
  numHits = 0;
}

//determines if a point is inside the image bounds
function testBounds(){
 return true
}

//tests if each pixel is part of blob and returns pixel num || -1
function compColorArea(colorsArr, testingArr, errorMargin){
  // console.log('comparing', colorsArr, testingArr)
  for(let i = 0; i<testingArr.length; i+=4){
    for(let j = 0; j<colorsArr.length; j++){
      //if color at that spot is higher than walker color and not alpha value
      if(j !== 3 && testingArr[i+j] > colorsArr[j] + errorMargin) {
        //test to make sure alpha val is not skewing numbers
        // console.log('found intersect', i, j, testingArr[i+j], testingArr[j], testingArr[i+3], testingArr)
        let alpha = testingArr[i+3];
        //returns n where matching pixel is nth in testing arr
        if(alpha > 100) return Math.floor(i/4);
      }
    }
  }
  return -1;
}

function walkRecurse(ctx, oldPos, maxIterations, iteration, maxHits, runOpt){
  // console.log('old', oldPos)
  let newPos = movePos(oldPos);
  // console.log('newPos', newPos)
  //get land pixel
  let flooredPos = [Math.floor(newPos[0]), Math.floor(newPos[1])];
  let color = getColorArea(ctx, newPos, WALKER_WIDTH);
  // console.log('color', color, newPos)

  // reliably tests if point is on blob
  // if((color[0]>WALKER_COL_ARR[0]+20 || color[1]>WALKER_COL_ARR[1]+20 || color[2]>WALKER_COL_ARR[2]+20) && color[3]>50) {
  let collisionPixel = compColorArea(WALKER_COL_ARR, color, 20);
  if (collisionPixel>-1){
    //find position of colision pixel
    let pixelPos = [ Math.floor(newPos[0]-WALKER_WIDTH/2) + collisionPixel % WALKER_WIDTH, Math.floor(newPos[1]-WALKER_WIDTH/2) + Math.floor(collisionPixel / WALKER_WIDTH) ];

    //draw growth
    drawLine(ctx, genLine(oldPos[0], oldPos[1], pixelPos[0], pixelPos[1], blob_growth), toRGB(blobColor), blobWidth);
    numHits ++;
    changeColor();
    //corner respawn
    newPos = pickCorner(Math.floor(Math.random()*6), getWidth(), getHeight());
    // random respawn
    // newPos = [Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight) ]
    // console.log('intersect', numHits, newPos, color)
  } else {
    //draw walker (only if no colision to aviod drawing over)
    console.log(watchDraw)
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
  let xChange = (Math.random()-.5)*10;
  let yChange = (Math.random()-.5)*10;
  // console.log(xChange, yChange)

  //bounce
  let newX = (x + xChange < 0 || x + xChange >= window.innerWidth) ? x - xChange : x + xChange;
  let newY = (y + yChange < 0 || y + yChange >= window.innerHeight) ? y - yChange : y + yChange;
  // let newX = (x + xChange < 0 || x + xChange >= window.innerWidth) ? Math.random()*getWidth() : x + xChange;
  // let newY = (y + yChange < 0 || y + yChange >= window.innerHeight) ? Math.random()*getHeight() : y + yChange;

  return [newX, newY];
}



function drawDLA(ctx, data){
  resetState();
  plantSeeds(ctx, data);
  //start walkers
  // startWalkers(ctx, walkIt, 1, 1000)
  startWalkers(ctx, walkRecurse, NUM_WALKERS, MAX_ITERATIONS, MAX_HITS);

}

function startWalkers(ctx, walkFn, numWalkers, iterations, maxHits){
  for (let i = 0; i<numWalkers; i++){
    [0,1,2,3, 4, 5, 6, 7].forEach(function(j){
      let [x,y] = pickCorner(j, getWidth(), getHeight());
      // console.log('starting',j, x, y)
      walkFn(ctx, [x, y], iterations, 0, maxHits);
    })
  }
}

function pickCorner(n, difX, difY){
  // console.log(n)
  switch(n){
    case 0:
      return [0, 0];
    case 1:
      return [difX/2, 0];
    case 2:
      return [0, difY/2];
    case 3:
      return [difX, 0];
    case 4:
      return [0, difY];
    case 5:
      return [difX/2, difY];
    case 6:
      return [difX, difY/2];

    default:
      return [difX, difY];

  }
}


//start at edge - weight away from edge


//seed
//if intersect with seed's neighbor, draw line in neighbor direction
//stroke weight - get thinner
//stroke color **name values
//line length

//image generator - input image
//black values - where image is
//more likely to move back towards black area if farther away
//only draw if in black area

//Hyphal growth
//seeds
//grows in avg direction of all seeds near it
//random splits

//DLA 
//seed
//random walk (with something allpied (current))
// grows whenever random walk hits neightbor of seed

//L-systems 
//start
//input
//itererator
//rules
//rules(itterator(input))

//seed points
//transormation


// function walkIt(ctx, startPos, max){
//   let newPos = startPos;
//   console.log('newPos', newPos)
//   let oldPos, color;

//     window.requestAnimFrame(walkerStuff)
  

//   // for(let i = 0; i<max; i++){
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
//   let xChange = (Math.random()-.8)*2;
//   let yChange = (Math.random()-.5) * 2;
//   // console.log(xChange, yChange)

//   //bounce
//   let newX = (x + xChange < 0 || x + xChange >= window.innerWidth) ? x - xChange : x + xChange;
//   let newY = (y + yChange < 0 || y + yChange >= window.innerHeight) ? y - yChange : y + yChange;
  
//   return [newX, newY];
// }


// document.addEventListener("DOMContentLoaded", function(event) { 
//   let canvas = document.getElementById('canvas');
//   let ctx = init(canvas, data);

//   plantSeeds(ctx, data);

  
//   //start walkers
//   // startWalkers(ctx, walkIt, 1, 1000)
//   startWalkers(ctx, walkRecurse, NUM_WALKERS, MAX_ITERATIONS, MAX_HITS);


// });


