const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 500;
let contDrawing = true;
let watchDraw = false;


function getWidth(){
  return CANVAS_WIDTH ? CANVAS_WIDTH : window.innerWidth;
}
function getHeight(){
  return CANVAS_HEIGHT ? CANVAS_HEIGHT : window.innerHeight;
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
  if (!color) color = 'white';
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
    canvas.width = getWidth();
    canvas.height = getHeight();
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
  console.log(' set false')
  setTimeout( 
    window.requestAnimFrame(function(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      contDrawing = true;
      console.log(' set true')
      let fractalFn = parseForm(ctx);
      fractalFn();
    }), 100
  )
  
}

const testData = {
  axiom: ['F','-','G','-','G'], 
  replace:{
    'F': ['F','-','G','+','F','+','G','-','F'], 
    'G':['G','G']}, 
  startPos: [getWidth()/2 - getHeight()/2, getHeight()-10],
  dist: getHeight()/29,
  angle:120
}


//parses form and returns bound fn
function parseForm(ctx){
  let form = document.getElementById('drawing-opts');
  let fractalType = form.fractalType.value;

  //set watchdraw to val of checkbox
  watchDraw = form.watchDraw.checked ? true : false;

  if(fractalType === 'lSystem'){
    let axiom = form.axiom.value.length ? form.axiom.value.split('') : ['F'];
    
    let replace = {};
    if (form.rule1.value.length) replace = parseRule(form.rule1.value, replace);
    if (form.rule2.value.length) replace = parseRule(form.rule2.value, replace);
    if (form.rule3.value.length) replace = parseRule(form.rule3.value, replace);

    let startPos = [Number(form.startPosX.value) || 200, Number(form.startPosY.value) || 200];
    let angle = Number(form.angle.value || 35);
    let dist = Number(form.dist.value) || getHeight()/29
    let startDir = Number(form.startDir.value) || 90;
    let iterations = Number(form.iterations.value) || 4;

    let data = {axiom, replace, startPos, angle, dist, startDir, iterations};
    console.log(data)
    return drawLSys.bind(window, ctx, data);
  }
  else {
    let data = 22;
    return drawDLA.bind(window, ctx, data);
  }
}

function parseRule(ruleStr, rulesDict){
 if (!ruleStr.length) return rulesDict;
  let rule = ruleStr.split('=');
  if (rule.length !== 2) return rulesDict;
  // let key = rule[0];
  let [key, val] = [rule[0], rule[1].split('')];
  return Object.assign({}, rulesDict, {[key]: val});
}

document.addEventListener("DOMContentLoaded", function(event) { 
  let canvas = document.getElementById('canvas');
  let ctx = init(canvas);

  //register stop button
  document.getElementById('stop').addEventListener('click', function(){
    console.log('stoped')
    //set stopDrawin to true - stops recursive calls
    contDrawing = false;
  });
  document.getElementById('start-drawing').addEventListener('click', function(){
    contDrawing = false;
    console.log('set here false')
    setTimeout(startDrawing.bind(window, ctx), 100)
    
  });
  startDrawing(ctx);
});

function showRender(){
  console.log('starting')
  document.getElementById('rendering').innerHTML = 'Rendering...'
}
function hideRender(){
  console.log('done')
  document.getElementById('rendering').innerHTML = '';
}

//resizing window erases any drawing
// window.addEventListener('resize', function(e){
//   let canvas = document.getElementById('canvas');
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// });