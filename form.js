var color = 'rainbow';


function populateForm(data){
  var form = document.getElementById('drawing-opts');
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

//colorStr is comma-sep rgb string
function parseColor(colorStr, defaultArr){
  var color = colorStr.split(',');
  color = color.map(function(col){ return Number(col); });
  if (color.length !== 3 || !color.every(function(val){
    return Number(val)>=0;
  })) color = defaultArr;
  return color;
}

//parses form and returns bound fn
function parseForm(ctx){
  var form = document.getElementById('drawing-opts');
  var fractalType = form.fractalType.value;
  if(!fractalType) {
    if(document.getElementById('l-sys-select').checked) fractalType = 'lSystem';
  }

  //set watchdraw to val of checkbox
  watchDraw = form.watchDraw.checked ? true : false;

  //set color
  color = form.color.value;
  console.log(color)
  if (color !== 'rainbow') blobColor = parseColor(color, [255,0,0]);
  var newBrCol = parseColor(form.brColor.value, [0,0,0]);
  changeBackground(newBrCol, backgroundColor);

  //set canvas size
  canvasWidth = form.canvasWidth.value.length ? Number(form.canvasWidth.value) : 500;
  if (canvasWidth < 5 || canvasWidth > 3000) canvasWidth = 500;
  canvasHeight = form.canvasHeight.value.length ? Number(form.canvasHeight.value) : 500;
  if (canvasHeight < 5 || canvasHeight > 3000) canvasHeight = 400;

  setCanvasSize();

  if(fractalType === 'lSystem'){

    if(drawType !== 'canvas') {
      drawType = 'canvas';
      //init if not yet init-ed
      initCanvas();
      setView();
    }

    var axiom = form.axiom.value.length ? form.axiom.value.split('') : ['F'];
    
    var replace = {};
    if (form.rule1.value.length) replace = parseRule(form.rule1.value, replace);
    if (form.rule2.value.length) replace = parseRule(form.rule2.value, replace);
    if (form.rule3.value.length) replace = parseRule(form.rule3.value, replace);

    var startPos = [Number(form.startPosX.value) || 200, Number(form.startPosY.value) || 200];
    var angle = Number(form.angle.value || 35);
    var dist = Number(form.dist.value) || getHeight()/29
    var startDir = Number(form.startDir.value) || 90;
    var iterations = Number(form.iterations.value) || 4;
    var distMod = Number(form.distMod.value) || .7;

    var data = {axiom, replace, startPos, angle, dist, startDir, iterations, distMod};
    // console.log(data)
    return drawLSys.bind(window, ctx, data);
  }
  else {
    //if using canvas, switch to webgl
    if(drawType !== 'webGL') {
      drawType = 'webGL';
      //init if not yet init-ed
      gl = initGl();
      setView();
    }
    var data = 22;
    return drawDLA.bind(window, ctx, data);
  }
}

function parseRule(ruleStr, rulesDict){
 if (!ruleStr.length) return rulesDict;
  var rule = ruleStr.split('=');
  if (rule.length !== 2) return rulesDict;
  // var key = rule[0];
  var [key, val] = [rule[0], rule[1].split('')];
  return Object.assign({}, rulesDict, {[key]: val});
}

function changeBackground(newCol, oldCol){
  if (newCol.length !== oldCol.length) return false;
  for (var i = 0; i<newCol.length; i++){
    if (newCol[i] !== oldCol[i]){
      backgroundColor = newCol;
      return setBackground(newCol);
    } 
  }
}

function setBackground(colArr){
  if(drawType === 'webGL') {
    colArr = fromRgbToGlCol(colArr);
    gl.clearColor(colArr[0], colArr[1], colArr[2], 1.0);
  }
  else document.getElementById('canvas').style.backgroundColor=toRGB(colArr);
}

