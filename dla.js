'use strict';
// function draw(ctx, seq, key){

// }

function drawLine(ctx, [startX, startY, endX, endY], color){
  console.log('hi', startX, startY, endX, endY)
  if (!color, color = 'blue');
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}



// generate endX and endY for a given colision direction and length
function genLine(oldX, oldY, nX, nY, lenMult){
  let eX = nX - (nX - oldX) * lenMult;
  let eY = nY - (nY - oldY) * lenMult;
  return [nX, nY, eX, eY];
}

function walk(ctx, oldPos, iteration, max){
  let newPos = movePos(oldPos);

  //get land pixel
  let color = ctx.getImageData(newPos[0], newPos[1], 1, 1).data.slice(0,3);
  //if not black

  if(color[0]!==0 || color[1]!==0 || color[2]!==0) {
    //draw growth
    drawLine(ctx, genLine(oldPos[0], oldPos[1], newPos[0], newPos[1], 3));
    newPos = [Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight) ]
    console.log('intersect', newPos)
  }
  // if(iteration<max) walk(ctx, newPos, iteration+1, max)
  // drawLine(ctx, [oldPos[0], oldPos[1], newPos[0], newPos[1]]);
  setTimeout(function(){

  if(iteration<max) walk(ctx, newPos, iteration+1, max)
  else console.log('done')
  }, .00001)
  //get color
  //if color not black or white, part of growth - draw
}

function movePos ([x,y]){
  let xChange = (Math.random()-.5)*5;
  let yChange = (Math.random()-.5)*5;
  // console.log(xChange, yChange)

  //bounce
  let newX = (x + xChange < 0 || x + xChange >= window.innerWidth) ? x - xChange : x + xChange;
  let newY = (y + yChange < 0 || y + yChange >= window.innerHeight) ? y - yChange : y + yChange;
  // let newX = (x + xChange < 0 || x + xChange >= window.innerWidth) ? Math.random()*getWidth() : x + xChange;
  // let newY = (y + yChange < 0 || y + yChange >= window.innerHeight) ? Math.random()*getHeight() : y + yChange;

  return [newX, newY];
}

// function moveLeft([x, y]){
//   let xChange = (Math.random()-.8)*2;
//   let yChange = (Math.random()-.5) * 2;
//   // console.log(xChange, yChange)

//   //bounce
//   let newX = (x + xChange < 0 || x + xChange >= window.innerWidth) ? x - xChange : x + xChange;
//   let newY = (y + yChange < 0 || y + yChange >= window.innerHeight) ? y - yChange : y + yChange;
  
//   return [newX, newY];
// }


function init (canvas, data){
  if(canvas){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let ctx = canvas.getContext("2d");
    ctx.lineWidth=3;

    return ctx;

  } else throw new Error('Could not get canvas');
}

function getWidth(){
  return window.innerWidth;
}
function getHeight(){
  return window.innerHeight;
}

let data = 22;

document.addEventListener("DOMContentLoaded", function(event) { 
  let canvas = document.getElementById('canvas');
  let ctx = init(canvas, data);

  // drawLine(ctx, [30, 40, 30, 90], 'red');
  // drawLine(ctx, genLine(100,100,20,20,1));


  ctx.beginPath();
  ctx.arc(getWidth()/2, getHeight()/2, 20, 0, 360);
  ctx.fillStyle = 'red'
  ctx.fill();
  // ctx.beginPath();
  // ctx.arc(100, 50, 20, 0, 360);
  // ctx.stroke();
  // ctx.beginPath();
  // ctx.arc(200, 100, 20, 0, 360);
  // ctx.stroke();
  // ctx.beginPath();
  // ctx.arc(200, 50, 20, 0, 360);
  // ctx.stroke();
  //   ctx.arc(200, 150, 20, 0, 360);
  // ctx.stroke();
  // ctx.beginPath();
  // ctx.arc(300, 50, 20, 0, 360);
  // ctx.stroke();

for (let i = 0; i<100; i++){
  for (let j = 0; j<4; j++){
    let [x,y] = calcDif(j, 50);
    walk(ctx, [getWidth()/2+x, getHeight()/2+y], 0, 10000000);
  }
}
function calcDif(n, dif){
  switch(n){
    case n===0:
      return [0-dif, 0-dif];
    case n===1:
      return [dif, 0-dif];
    case n===2:
      return [0-dif, dif];
    default:
      return [dif, dif];

  }
}

});

window.addEventListener('resize', function(e){
  let canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

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




