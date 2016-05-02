

// function startCanvas() { 
//   canvas = document.getElementById('canvas');
//   console.log('got canvas', canvas)
//   ctx = init(canvas);
//   var inputs = document.getElementsByClassName('l-sys-only');

//   //register stop button
//   document.getElementById('stop').addEventListener('click', function(){
//     // console.log('stoped')
//     //set stopDrawin to true - stops recursive calls
//     contDrawing = false;
//     hideRender();
//   });
//   document.getElementById('start-drawing').addEventListener('click', function(){
//     contDrawing = false;
//     showRender('Rendering...');
//     // console.log('set here false')
//     setTimeout(startDrawing.bind(window, ctx), 100);
//   });
//   document.getElementById('l-sys-select').addEventListener('click', function(){
//     [].forEach.call(inputs, (function(input){input.style.visibility='visible';}));
//   });
//   document.getElementById('dla-select').addEventListener('click', function(){
//     [].forEach.call(inputs, (function(input){input.style.visibility='hidden';}));
//   });
//   document.getElementById('l-sys-thumbnails').addEventListener('click', function(e){
//     var thumbId = e.target.id;
//     if(lSysData[thumbId]) populateForm(lSysData[thumbId]);
//   });
//   startDrawing(ctx);
// }

function initCanvas (canvas, data){
  if(canvas){
    canvas.width = getWidth();
    canvas.height = getHeight();
    var ctx = canvas.getContext("2d");

    return ctx;

  } else throw new Error('Could not get canvas');
}

function drawLineCanvas(ctx, [startX, startY, endX, endY], color, lineWidth){
  // console.log('drawing', startX, startY, endX, endY)
  if(color) color = toRGB(color);
  if (!color) color = 'white';
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth || 1;
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}