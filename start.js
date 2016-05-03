document.addEventListener("DOMContentLoaded", function(event) { 
  start(initCanvas);
  // start(initGl);
  // canvas = document.getElementById('canvas');
  // initGl(canvas)
  // // drawLine(null, [0,100, 100, 100], [255, 100, 0]);
  // drawLine(null, [0,0, 200, 200], [5, 100, 255]);
  // drawLine(null, [-.5,-.5, 1, 1], [0.0, 0.3, 0.0, 1.0]);
  // drawLine(null, [-.5,.5, 1, -1], [0.0, 0.3, 0.5, 1.0]);
  // gl.clearColor(0, 0, 0, 1.0);
  // gl.clear(gl.COLOR_BUFFER_BIT);
  //   drawLine(null, [-.5,.5, .5, .5], [0.7, 0.3, 0.5, 1.0]);

});

function start(initFn) { 
  canvas = document.getElementById('canvas');
  console.log('got canvas', canvas)
  ctx = initFn(canvas);
  var inputs = document.getElementsByClassName('l-sys-only');

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
    [].forEach.call(inputs, (function(input){input.style.display='block';}));
  });
  document.getElementById('dla-select').addEventListener('click', function(){
    [].forEach.call(inputs, (function(input){input.style.display='none';}));
  });
  document.getElementById('l-sys-thumbnails').addEventListener('click', function(e){
    var thumbId = e.target.id;
    if(lSysData()[thumbId]) populateForm(lSysData()[thumbId]);
  });
  startDrawing(ctx);
}