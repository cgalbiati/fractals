function getWidth(){
  return window.innerWidth;
}
function getHeight(){
  return window.innerHeight;
}

function getColor(ctx, pos){
  let flooredPos = [Math.floor(pos[0]), Math.floor(pos[1])];
  return ctx.getImageData(flooredPos[0], flooredPos[1], 1, 1).data.slice(0,4);
}

function getColorArea(ctx, pos, size){
  let flooredCorner = [Math.floor(pos[0]-size/2), Math.floor(pos[1]-size/2)];
  return ctx.getImageData(flooredCorner[0], flooredCorner[1], size, size).data;
}

function drawLine(ctx, [startX, startY, endX, endY], color, lineWidth){
  // console.log('drawing', startX, startY, endX, endY)
  if (!color) color = 'blue';
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth || 1;
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}


// function drawLine(ctx, startX, startY, endX, endY, color){
//   // console.log('hi', startX, startY, endX, endY)
//   if (!color) color = 'rgb(0,0, 255)';
//   ctx.beginPath();
//   ctx.strokeStyle = color;
//   ctx.moveTo(startX, startY);
//   ctx.lineTo(endX, endY);
//   ctx.stroke();
//   // console.log(startX, startY, endX, endY, color)
// }

// generate endX and endY for a given colision direction and length
function genLine(oldX, oldY, nX, nY, lenMult=1){
  let eX = nX - (nX - oldX) * lenMult;
  let eY = nY - (nY - oldY) * lenMult;
  return [nX, nY, eX, eY];
}

//returns start and end pts for draw
function genLineFromAngle(curX, curY, dirAngle=35, dist=20){
    // console.log('lala', curX, curY, dirAngle, dist)

  //(x+c)2 + (y2 + dirAngle*c)2 = dist2
  let rad = dirAngle * Math.PI/180;
  let newX = curX + Math.cos(rad) * dist;
  let newY = curY + Math.sin(rad) * dist;
  // console.log('generated', rad, newX, newY)
  return [newX, newY];
}


function init (canvas, data){
  if(canvas){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let ctx = canvas.getContext("2d");
    // ctx.lineWidth=1;

  //test
  // let color = 'blue';
  // ctx.beginPath();
  // ctx.strokeStyle = color;
  // ctx.lineWidth = 10;
  // ctx.moveTo(0, 0);
  // ctx.lineTo(0, getHeight());
  // ctx.lineTo(getWidth(), getHeight());
  // ctx.lineTo(getWidth(), 0);
  // ctx.lineTo(0, 0);
  // ctx.stroke();

    return ctx;

  } else throw new Error('Could not get canvas');
}

//resizing window erases any drawing
// window.addEventListener('resize', function(e){
//   let canvas = document.getElementById('canvas');
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// });