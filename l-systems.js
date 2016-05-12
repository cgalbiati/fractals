'use strict';

var digitRE = /d/;


//currState: {
  //curPos: [x,y]
  //stack [x,y,color]
  //curDir
  //instr
  //dist
  //angle
  //distMod
//}

function parseInstrIt(ctx, currState){
  // if(!dist) dist = 20; 
  // if (!angle) angle = 25;
  var curX = currState.curPos[0];
  var curY = currState.curPos[1];
  var newInstr = currState.instr.slice(1);
  var newDir, newStack, newX, newY;
  // console.log('currState', currState.instr[0],currState.instr.length, currState);

  switch(currState.instr[0]){
    case 'F':
    case 'G':
      [newX, newY] = genLineFromAngle(curX, curY, currState.curDir, currState.dist);
      // console.log('draw', curX, curY, newX, newY, currState.curDir);
      drawLine(ctx, [curX, curY, newX, newY], blobColor);
      changeColor();
      return Object.assign({}, currState, {curPos: [newX, newY]}, {instr: newInstr});
    case 'f':
      [newX, newY] = genLineFromAngle(curX, curY, currState.curDir, currState.dist);
      // console.log('move', curX, curY, newX, newY, currState.curDir);
      return Object.assign({}, currState, {curPos: [newX, newY]}, {instr: newInstr});
    case '+':
      newDir = currState.curDir + currState.angle <= 360 ? currState.curDir + currState.angle : currState.curDir + currState.angle - 360;
      // console.log('+', 'newDir',newDir)
      return Object.assign({}, currState, {curDir: newDir}, {instr: newInstr});
    case '-':
      newDir = currState.curDir - currState.angle >= 0 ? currState.curDir - currState.angle : currState.curDir - currState.angle + 360;
      // console.log('-', 'newDir',newDir)
      return Object.assign({}, currState, {curDir: newDir}, {instr: newInstr});
    case '[':
      newStack = currState.stack.concat({pos:currState.curPos, dir:currState.curDir, dist: currState.dist});
      // console.log('[', Object.assign({}, currState, {curDir: currState.curDir}, {stack: newStack}, {instr: newInstr}))
      return Object.assign({}, currState, {curDir: currState.curDir}, {stack: newStack}, {instr: newInstr});
    case ']':
      var oldPos = currState.stack[currState.stack.length-1];
      newStack = currState.stack.slice(0, currState.stack.length-1);
      return Object.assign({}, currState, {curDir: oldPos.dir}, {curPos: oldPos.pos}, {dist:oldPos.dist}, {stack: newStack}, {instr: newInstr});
    case 'S':
      var newDist = currState.dist * currState.distMod;
      console.log('making new dist', newDist)
      return Object.assign({}, currState, {dist: newDist}, {instr: newInstr});
return Object.assign({}, currState, {curDir: oldPos.dir}, {curPos: oldPos.pos}, {stack: newStack}, {instr: newInstr});
    default: return Object.assign({}, currState, {instr: newInstr});
  }
  return Object.assign({}, currState, {instr: newInstr});

}


function parseInstrRecurse(ctx, currState){
  // if(!dist) dist = 20; 
  // if (!angle) angle = 25;
  var curX = currState.curPos[0];
  var curY = currState.curPos[1];
  var newInstr = currState.instr.slice(1);
  var newDir, newStack, newX, newY;
  // console.log('currState', currState.instr[0],currState.instr.length, currState);

  switch(currState.instr[0]){
    case 'F':
    case 'G':
      [newX, newY] = genLineFromAngle(curX, curY, currState.curDir, currState.dist);
      // console.log('draw', curX, curY, newX, newY, currState.curDir);
      drawLine(ctx, [curX, curY, newX, newY], blobColor);
      changeColor();
      if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {curPos: [newX, newY]}, {instr: newInstr})));
    case 'f':
      [newX, newY] = genLineFromAngle(curX, curY, currState.curDir, currState.dist);
      // console.log('move', curX, curY, newX, newY, currState.curDir);
      if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {curPos: [newX, newY]}, {instr: newInstr})));
    case '+':
      newDir = currState.curDir + currState.angle <= 360 ? currState.curDir + currState.angle : currState.curDir + currState.angle - 360;
      // console.log('+', 'newDir',newDir)
      if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {curDir: newDir}, {instr: newInstr})));
    case '-':
      newDir = currState.curDir - currState.angle >= 0 ? currState.curDir - currState.angle : currState.curDir - currState.angle + 360;
      // console.log('-', 'newDir',newDir)
      if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {curDir: newDir}, {instr: newInstr})));
    case '[':
      newStack = currState.stack.concat({pos:currState.curPos, dir:currState.curDir, dist: currState.dist});
      // console.log('[', Object.assign({}, currState, {curDir: currState.curDir}, {stack: newStack}, {instr: newInstr}))
      if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {curDir: currState.curDir}, {stack: newStack}, {instr: newInstr})));
    case ']':
      var oldPos = currState.stack[currState.stack.length-1];
      newStack = currState.stack.slice(0, currState.stack.length-1);
      // console.log(']', Object.assign({}, currState, {curDir: oldPos.dir}, {curPos: oldPos.pos}, {stack: newStack}, {instr: newInstr}))
      if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {curDir: oldPos.dir}, {curPos: oldPos.pos}, {dist: oldPos.dist}, {stack: newStack}, {instr: newInstr})));
    case 'S':
      var newDist = currState.dist * currState.distMod;
      // console.log('making new dist', newDist)
      if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {dist: newDist}, {instr: newInstr})));
    default: if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {instr: newInstr})));
  }
  if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {instr: newInstr})));
  console.timeEnd('animatedraw')
  // console.timeEnd('draw')
  hideRender();
  return null;

}

//replace = {orig, repl=[]} //can have mult rules
function makeInstr(axiom, replace, iterations){
  for(var i = 0; i<iterations; i++){
    axiom = axiom.reduce(function(built, cmd){
      if (replace[cmd]) return built.concat(replace[cmd]);
      else return built.concat(cmd);
    }, []);
  }

  console.log('made', axiom.length, axiom)
  return axiom;
}

function drawLSys(ctx, data){
  showRender('Building...');
  if(drawType!=='canvas'){
    drawType = 'canvas';
    canvas = document.getElementById('canvas')
    initCanvas(canvas);
  }
  console.time('instr')
  var explodedInstr = makeInstr(data.axiom, data.replace, data.iterations || 5);
  hideRender();
  console.timeEnd('instr');

  var currState = {
    curPos: data.startPos || [200,200], 
    stack: [], 
    curDir: data.startDir || 270, 
    instr: explodedInstr,
    dist: data.dist || 10,
    angle: data.angle || 60,
    distMod: .7
  };
  console.log('watch', watchDraw)
  showRender('Rendering...');
  if(watchDraw){
    console.time('animatedraw')
    parseInstrRecurse(ctx, currState);
  } else {
    console.time('draw')
    while(currState.instr.length){
      currState = parseInstrIt(ctx, currState);
    }
    hideRender();
    console.timeEnd('draw')
  }
}
