var gl; // A global variable for the WebGL context

function initGl(canvas){

  // canvas = document.getElementById("canvas");
  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    drawType = 'webGL';
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true}) || canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});
  }
    catch(e) {
      drawType = 'canvas';
      initCanvas(canvas);
  }
  //set canvas size
  canvas.width = getWidth();
  canvas.height = getHeight();

  //set viewport to entire canvas
  gl.viewport(0, 0, getWidth(), getHeight());
  //set color to black, fully opaque
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //compile shaders
  var v = document.getElementById("vertex").firstChild.nodeValue;
  var f = document.getElementById("fragment").firstChild.nodeValue;
   
  var vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, v);
  gl.compileShader(vs);
   
  var fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, f);
  gl.compileShader(fs);
   
  program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  //log if problems
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
    console.log(gl.getShaderInfoLog(vs));
   
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
    console.log(gl.getShaderInfoLog(fs));
   
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    console.log(gl.getProgramInfoLog(program));

  return gl;
}

function clearGL(){
  gl.clearColor(1, 1, 1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function drawLineGL(ctx, [startX, startY, endX, endY], color, lineWidth){
  // gl.clear(gl.COLOR_BUFFER_BIT);
  //convert points
  [startX, startY, endX, endY] = fromPixPosToGlCoord([startX, startY]).concat(fromPixPosToGlCoord([endX, endY]));

  //convert color
  color = fromRgbToGlCol(color);
  while (color.length < 4) color.push(1)
  var vertices = new Float32Array([
             startX, startY, endX, endY
          ]);

  vbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);                                       
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
   
  itemSize = 2;
  numItems = vertices.length / itemSize;

  //use program for any subsequent calls
  gl.useProgram(program);
  
  //assign uColor to var on program to access in future
  program.uColor = gl.getUniformLocation(program, "uColor");
  //set color (r,b,g,a)
  gl.uniform4fv(program.uColor, color);
   
  program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
  gl.enableVertexAttribArray(program.aVertexPosition);
  gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);

  //actually draw
  gl.drawArrays(gl.LINES, 0, numItems);
}

//returns position[x,y] in gl coords (from -1 to 1 instead of 0 to canvas.width/height)
//top left is 0,0
function fromPixPosToGlCoord(pos){
  // console.log('converting ', pos)
  var x = 2 * pos[0] / getWidth() - 1;
  var y = 0 - (2 * pos[1] / getHeight() - 1);
  // console.log(x, y)
  return [x,y];
}

//returns colorArr for webGL
function fromRgbToGlCol(rgbArr) {
  return rgbArr.map(function(color){
    return color/255;
  });
}