'use strict'

var canvasHeight = 400;
var canvasWidth = 500;
var contDrawing = true;
var watchDraw = false;
var canvas;
var ctx;
var drawType;


function getWidth(){
  return canvasWidth ? canvasWidth : window.innerWidth;
}
function getHeight(){
  return canvasHeight ? canvasHeight : window.innerHeight;
}

function getColor(ctx, pos){
  var flooredPos = [Math.floor(pos[0]), Math.floor(pos[1])];
  return ctx.getImageData(flooredPos[0], flooredPos[1], 1, 1).data.slice(0,4);
}

function getColorArea(ctx, pos, size){
  var flooredCorner = [Math.floor(pos[0]-size/2), Math.floor(pos[1]-size/2)];
  return ctx.getImageData(flooredCorner[0], flooredCorner[1], size, size).data;
}

//transforms color arr to rgb/rgba str
function toRGB(colorArr){
  //color is rgb val
  var startStr = 'rgb(';
  if(colorArr.length === 4) startStr = 'rgba(';
  var colorStr = colorArr.reduce(function(built, cur) {
      return built + cur.toString() + ',';
    }, startStr);
  colorStr = colorStr.slice(0, colorStr.length-1) + ')';
  return colorStr;
}

// generate endX and endY for a given colision direction and length
function genLine(oldX, oldY, nX, nY, lenMult){
  if (!lenMult) lenMult = 1;
  var eX = nX - (nX - oldX) * lenMult;
  var eY = nY - (nY - oldY) * lenMult;
  return [nX, nY, eX, eY];
}

//returns start and end pts for draw
function genLineFromAngle(curX, curY, dirAngle, dist){
    // console.log('lala', curX, curY, dirAngle, dist)

  //(x+c)2 + (y2 + dirAngle*c)2 = dist2
  var rad = dirAngle * Math.PI/180;
  var newX = curX + Math.cos(rad) * dist;
  var newY = curY + Math.sin(rad) * dist;
  // console.log('generated', rad, newX, newY)
  return [newX, newY];
}

function changeColor(){
  //incr blue if red is 0 and blue is less than max
  if(blobColor[2] < 254 && blobColor[0] === 0) blobColor[2]+=2;
  // decr green if blue is 255 and green is > 0
  else if (blobColor[1] > 1 && blobColor[2] > 253) blobColor[1]-=2;
  // incr red if green is 0 and red is < max
  else if (blobColor[0] < 255 && blobColor[1] < 2) blobColor[0]+=1;
  // decr blue if red is max and blue is > 0
  else if (blobColor[2] > 0 && blobColor[0] > 254) blobColor[2] -= 1;
  //incr green if red is max and green is < max
  else if (blobColor[1] < 255 && blobColor[0] > 254) blobColor[1] += 1;
  //decr red if green is max and red > 0
  else if (blobColor[0] > 0 && blobColor[1] > 254) blobColor[0] -= 1;
}




window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function startDrawing(ctx){
  contDrawing = false;
  console.log('set false')
  setTimeout( 
    window.requestAnimFrame(function(){
      if(drawType === 'webGL') clearGL()
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
      resetState();
      contDrawing = true;
      console.log(' set true')
      var fractalFn = parseForm(ctx);
      fractalFn();
    }), 100
  ); 
}



// 


function showRender(text){
  // console.log('starting');
  document.getElementById('rendering').innerHTML = text || 'Rendering...';
}
function hideRender(){
  // console.log('done')
  document.getElementById('rendering').innerHTML = '';
}

// returns arr of [x,y] for all pts on line
function getPointsOnLine(x1, y1, x2, y2){
  //array to return
  var pointsArr = [[x1,y1]];

  // Define differences and error check
  var dx = Math.abs(x2 - x1);
  var dy = Math.abs(y2 - y1);
  var sx = (x1 < x2) ? 1 : -1;
  var sy = (y1 < y2) ? 1 : -1;
  var err = dx - dy;
 
  // Main loop
  while (!((x1 === x2) && (y1 === y2))) {
    var e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
    // Set coordinates
    pointsArr.push([x1, y1]);
  }
  // Return the result
  return pointsArr;
}

function drawLine(ctx, [startX, startY, endX, endY], color, lineWidth){
  if(drawType === 'webGL'){
    drawLineGL(ctx, [startX, startY, endX, endY], color, lineWidth);
  }
  else {
    //not using webgl
    drawLineCanvas(ctx, [startX, startY, endX, endY], color, lineWidth);
  }

}


//set up listener on radio buttons

// function showLSysInputs(){
//   document.getElementsByClass('l-sys').addAttribute('display:relative;')
// }
// function hideLSysInputs(){
//   document.getElementsByClass('l-sys').addAttribute('display:none;')
// }

//resizing window erases any drawing
// window.addEventListener('resize', function(e){
//   var canvas = document.getElementById('canvas');
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// });