document.addEventListener("DOMContentLoaded", function(event) { 
  start(initCanvas);
});

function start() { 
  canvas = document.getElementById('canvas');
  glCanvas = document.getElementById('gl-canvas');
  ctx = initCanvas();
  gl = initGl();
  var lSysInputs = document.getElementsByClassName('l-sys-only');
  var dlaInputs = document.getElementsByClassName('dla-only');

  //register stop button
  document.getElementById('stop').addEventListener('click', function(){
    //set stopDrawin to true - stops recursive calls
    contDrawing = false;
    hideRender();
  });
  //show rendering and start drawing after draw btn clicked
  document.getElementById('start-drawing').addEventListener('click', function(){
    contDrawing = false;
    showRender('Rendering...');
    setTimeout(startDrawing.bind(window, ctx), 100);
  });
  //show l-sys inputs and hide dla
  document.getElementById('l-sys-select').addEventListener('click', function(){
    [].forEach.call(lSysInputs, (function(input){input.style.display='block';}));
    [].forEach.call(dlaInputs, (function(input){input.style.display='none';}));
  });
  //show dla inputs and hide l-sys
  document.getElementById('dla-select').addEventListener('click', function(){
    [].forEach.call(lSysInputs, (function(input){input.style.display='none';}));
    [].forEach.call(dlaInputs, (function(input){input.style.display='block';}));
  });
  //click listener on thumbnails to load form
  document.getElementById('l-sys-thumbnails').addEventListener('click', function(e){
    var thumbId = e.target.id;
    if(lSysData()[thumbId]) populateForm(lSysData()[thumbId]);
  });
  startDrawing(ctx);
}