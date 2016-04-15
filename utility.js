let canvasHeight = 400;
let canvasWidth = 500;
let contDrawing = true;
let watchDraw = false;
let canvas;
let ctx;


function getWidth(){
  return canvasWidth ? canvasWidth : window.innerWidth;
}
function getHeight(){
  return canvasHeight ? canvasHeight : window.innerHeight;
}

function getColor(ctx, pos){
  let flooredPos = [Math.floor(pos[0]), Math.floor(pos[1])];
  return ctx.getImageData(flooredPos[0], flooredPos[1], 1, 1).data.slice(0,4);
}

function getColorArea(ctx, pos, size){
  let flooredCorner = [Math.floor(pos[0]-size/2), Math.floor(pos[1]-size/2)];
  return ctx.getImageData(flooredCorner[0], flooredCorner[1], size, size).data;
}

//transforms color arr to rgb/rgba str
function toRGB(colorArr){
  //color is rgb val
  let startStr = 'rgb(';
  if(colorArr.length === 4) startStr = 'rgba(';
  let colorStr = colorArr.reduce(function(built, cur) {
      return built + cur.toString() + ',';
    }, startStr);
  colorStr = colorStr.slice(0, colorStr.length-1) + ')'
  return colorStr;
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


function init (canvas, data){
  if(canvas){
    canvas.width = getWidth();
    canvas.height = getHeight();
    let ctx = canvas.getContext("2d");

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
      resetState();
      contDrawing = true;
      console.log(' set true')
      let fractalFn = parseForm(ctx);
      fractalFn();
    }), 100
  ); 
}

function populateForm(data){
  var form = document.getElementById('drawing-opts')
  form.axiom.value = data.axiom || 'F';
  form.rule1.value = data.replace['1'] || '';
  form.rule2.value = data.replace['2'] || '';
  form.rule3.value = data.replace['3'] || '';
  form.startPosX.value =  Math.round(data.startPos[0]) || 200;
  form.startPosY.value =  Math.round(data.startPos[1]) || 200;
  form.angle.value =  Math.round(data.angle) || 90;
  form.dist.value =  Math.round(data.dist)  || 5;
  form.startDir.value =  Math.round(data.startDir) || 90;
  form.iterations.value =  Math.round(data.iterations) || 4;
  // form.rule1.value = data.rule1;
}

//parses form and returns bound fn
function parseForm(ctx){
  let form = document.getElementById('drawing-opts');
  let fractalType = form.fractalType.value;

  //set watchdraw to val of checkbox
  watchDraw = form.watchDraw.checked ? true : false;

  //set canvas size
  canvasWidth = form.canvasWidth.value.length ? Number(form.canvasWidth.value) : 500;
  if (canvasWidth < 5 || canvasWidth > 2000) canvasWidth = 500;
  canvasHeight = form.canvasHeight.value.length ? Number(form.canvasHeight.value) : 500;
  if (canvasHeight < 5 || canvasHeight > 2000) canvasHeight = 400;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

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
  canvas = document.getElementById('canvas');
  ctx = init(canvas);
  let inputs = document.getElementsByClassName('l-sys-only');

  //register stop button
  document.getElementById('stop').addEventListener('click', function(){
    // console.log('stoped')
    //set stopDrawin to true - stops recursive calls
    contDrawing = false;
    hideRender();
  });
  document.getElementById('start-drawing').addEventListener('click', function(){
    contDrawing = false;
    showRender('Rendering...');
    // console.log('set here false')
    setTimeout(startDrawing.bind(window, ctx), 100);
  });
  document.getElementById('l-sys-select').addEventListener('click', function(){
    [].forEach.call(inputs, (function(input){input.style.visibility='visible';}));
  });
  document.getElementById('dla-select').addEventListener('click', function(){
    [].forEach.call(inputs, (function(input){input.style.visibility='hidden';}));
  });
  document.getElementById('l-sys-thumbnails').addEventListener('click', function(e){
    let thumbId = e.target.id;
    if(lSysData[thumbId]) populateForm(lSysData[thumbId]);
  });
  startDrawing(ctx);
});


function showRender(text){
  // console.log('starting');
  document.getElementById('rendering').innerHTML = text || 'Rendering...';
}
function hideRender(){
  // console.log('done')
  document.getElementById('rendering').innerHTML = '';
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
//   let canvas = document.getElementById('canvas');
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// });