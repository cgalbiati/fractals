
//pos start data:

//should be triangle
const triangles = {
  axiom: ['F','-','G','-','G'], 
  replace:{
    'F': ['F','-','G','+','F','+','G','-','F'], 
    'G':['G','G']}, 
  startPos: [getWidth()/2 - getHeight()/2, getHeight()-10],
  dist: getHeight()/29,
  angle:120
}

// const data = {axiom: ['F','X'], replace:{'F': ['X','+','Y','F','+'], Y: ['-','F','X','-','Y']}, angle:90}

// const data = {axiom: ['-','F'], replace:{'F': ['F','+','F','-','F','-','F','+','F']}, angle:90}

//tree-like thing
// const curveTree = {
//   axiom: ['F','-','X'], 
//   replace:{
//     'F': ['F','F'], 
//     'X': ['F','-','[','[','X',']','+','X',']','[','-','X','+',']','F','[','X',']','-','X']
//   }, 
//   angle:25, 
//   dist:getHeight()/50, 
//   iterations: 4,
//   startPos:[0,getHeight()]
// }
lSysData = {
  truffula: {
    axiom: ['F-X'], 
    replace:{
      '1': 'F=FF', 
      '2': 'X=F-[[X]+X][-X+]F[X]-X',
    }, 
    angle:25, 
    startDir: 300,
    dist:getHeight()/80, 
    iterations: 5,
    startPos:[getWidth()/3,getHeight()]
  },
  bushTree: {
    axiom: ['FX'], 
    replace:{
      '1': 'F=FF-[-F+F+F]+[+F-F-F]', 
      '2': 'X=F-[[X]+X][-X+]F[X]-X'
    }, 
    angle:25, 
    startDir: 270,
    iterations:4,
    dist:getHeight()/60, 
    iterations: 4,
    startPos:[getWidth()/2,getHeight()]
  },
  triangles:{
    axiom: ['F-G-G'], 
    replace:{
      '1': 'F=F-G+F+G-F', 
      '2':'G=GG'}, 
    startPos: [getWidth()/2, 10],
    dist: getHeight()/29,
    angle: 120,
    // dist:13,
    iterations: 5,
    startDir: 120
  },
  tree: {
    axiom: ['FX'], 
    replace:{
      '1': 'F=C0FF-[C1-F+F]+[C2+F-F]', 
      '2':'X=C0FF+[C1+F]+[C3-F]'}, 
    startPos: [getWidth()/2, getHeight()],
    dist: 7,
    angle: 25,
    iterations: 4,
    startDir: 270

  }
};


// const bushTree = {
//   axiom: ['F'], 
//   replace:{
//     'F': ['F','F','-','[','-','F','+','F','+','F',']','+','[','+','F','-','F','-','F',']'] 
//     // 'X': ['F','-','[','[','X',']','+','X',']','[','-','X','+',']','F','[','X',']','-','X']
//   }, 
//   angle:22, 
//   startDir: 270,
//   dist:getHeight()/60, 
//   iterations: 4,
//   startPos:[getWidth()/2,getHeight()]
// }


// let data = {axiom: ['+','+','F','+','F'], replace:{'F': ['F', '+', '+', 'F', 'F', '-', 'F', '+', 'F', '+', 'F', 'F','+']}}
// let data = {axiom: ['+','+','+','+','+','F'], replace:{'F': ['F','F','-','[','-','F','+','F','+','F',']','+','[','+','F','-','F','-','F',']']}}
// let data = {axiom: ['F','+','+', 'F','+','+','F',], replace:{'F': ['F','-','F','+','+','F','-','F']}}
//should be tree
// let data = {axiom: ['X'], replace:{'F': ['F','F'], 'X': ['F','-','[','[','X',']','+','X',']','+','F','[','+','F','X',']','-','X']}}


let data = triangles;

//currState: {
  //curPos: [x,y]
  //stack [x,y,color]
  //curDir
  //instr
//}

function parseInstrIt(ctx, currState, dist=20, angle=25){
  let curX = currState.curPos[0];
  let curY = currState.curPos[1];
  let newInstr = currState.instr.slice(1);
  let newDir, newStack, newX, newY;
  // console.log('currState', currState.instr[0],currState.instr.length, currState);

  switch(currState.instr[0]){
    case 'F':
    case 'G':
      [newX, newY] = genLineFromAngle(curX, curY, currState.curDir, dist);
      // console.log('draw', curX, curY, newX, newY, currState.curDir);
      drawLine(ctx, [curX, curY, newX, newY], toRGB(blobColor));
      changeColor();
      return Object.assign({}, currState, {curPos: [newX, newY]}, {instr: newInstr});
    case 'f':
      [newX, newY] = genLineFromAngle(curX, curY, currState.curDir, dist);
      // console.log('move', curX, curY, newX, newY, currState.curDir);
      return Object.assign({}, currState, {curPos: [newX, newY]}, {instr: newInstr});
    case '+':
      newDir = currState.curDir + angle <= 360 ? currState.curDir + angle : currState.curDir + angle - 360;
      // console.log('+', 'newDir',newDir)
      return Object.assign({}, currState, {curDir: newDir}, {instr: newInstr});
    case '-':
      newDir = currState.curDir - angle >= 0 ? currState.curDir - angle : currState.curDir - angle + 360;
      // console.log('-', 'newDir',newDir)
      return Object.assign({}, currState, {curDir: newDir}, {instr: newInstr});
    case '[':
      newStack = currState.stack.concat({pos:currState.curPos, dir:currState.curDir});
      // console.log('[', Object.assign({}, currState, {curDir: currState.curDir}, {stack: newStack}, {instr: newInstr}))
      return Object.assign({}, currState, {curDir: currState.curDir}, {stack: newStack}, {instr: newInstr});
    case ']':
      let oldPos = currState.stack[currState.stack.length-1];
      newStack = currState.stack.slice(0, currState.stack.length-1);
      // console.log(']', Object.assign({}, currState, {curDir: oldPos.dir}, {curPos: oldPos.pos}, {stack: newStack}, {instr: newInstr}))
      return Object.assign({}, currState, {curDir: oldPos.dir}, {curPos: oldPos.pos}, {stack: newStack}, {instr: newInstr});
    default: return Object.assign({}, currState, {instr: newInstr});
  }
  return Object.assign({}, currState, {instr: newInstr});

}


function parseInstrRecurse(ctx, currState, dist=20, angle=25){
  let curX = currState.curPos[0];
  let curY = currState.curPos[1];
  let newInstr = currState.instr.slice(1);
  let newDir, newStack, newX, newY;
  // console.log('currState', currState.instr[0],currState.instr.length, currState);

  switch(currState.instr[0]){
    case 'F':
    case 'G':
      [newX, newY] = genLineFromAngle(curX, curY, currState.curDir, dist);
      // console.log('draw', curX, curY, newX, newY, currState.curDir);
      drawLine(ctx, [curX, curY, newX, newY], toRGB(blobColor));
      changeColor();
      if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {curPos: [newX, newY]}, {instr: newInstr}), dist, angle));
    case 'f':
      [newX, newY] = genLineFromAngle(curX, curY, currState.curDir, dist);
      // console.log('move', curX, curY, newX, newY, currState.curDir);
      if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {curPos: [newX, newY]}, {instr: newInstr}), dist, angle));
    case '+':
      newDir = currState.curDir + angle <= 360 ? currState.curDir + angle : currState.curDir + angle - 360;
      // console.log('+', 'newDir',newDir)
      if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {curDir: newDir}, {instr: newInstr}), dist, angle));
    case '-':
      newDir = currState.curDir - angle >= 0 ? currState.curDir - angle : currState.curDir - angle + 360;
      // console.log('-', 'newDir',newDir)
      if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {curDir: newDir}, {instr: newInstr}), dist, angle));
    case '[':
      newStack = currState.stack.concat({pos:currState.curPos, dir:currState.curDir});
      // console.log('[', Object.assign({}, currState, {curDir: currState.curDir}, {stack: newStack}, {instr: newInstr}))
      if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {curDir: currState.curDir}, {stack: newStack}, {instr: newInstr}), dist, angle));
    case ']':
      let oldPos = currState.stack[currState.stack.length-1];
      newStack = currState.stack.slice(0, currState.stack.length-1);
      // console.log(']', Object.assign({}, currState, {curDir: oldPos.dir}, {curPos: oldPos.pos}, {stack: newStack}, {instr: newInstr}))
      if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {curDir: oldPos.dir}, {curPos: oldPos.pos}, {stack: newStack}, {instr: newInstr}), dist, angle));
    default: if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {instr: newInstr}), dist, angle));
  }
  if(newInstr.length && contDrawing) return window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, Object.assign({}, currState, {instr: newInstr}), dist, angle));
  console.timeEnd('animatedraw')
  // console.timeEnd('draw')
  hideRender();
  return null;

}

//replace = {orig, repl=[]} //can have mult rules
function makeInstr(axiom, replace, iterations){
  for(let i = 0; i<iterations; i++){
    axiom = axiom.reduce(function(built, cmd){
      // console.log(built, cmd)
      if (replace[cmd]) return built.concat(replace[cmd]);
      else return built.concat(cmd);
    }, []);
  }

  console.log('made', axiom.length, axiom)
  return axiom;
}

function drawLSys(ctx, data){
  showRender('Building...');
  console.time('instr')
  let explodedInstr = makeInstr(data.axiom, data.replace, data.iterations || 5);
  hideRender();
  console.timeEnd('instr');

  let currState = {curPos: data.startPos || [200,200], stack: [], curDir: data.startDir || 270, instr: explodedInstr};
  console.log('watch', watchDraw)
  showRender('Rendering...');
  if(watchDraw){
    console.time('animatedraw')
    parseInstrRecurse(ctx, currState, data.dist || 20, data.angle);
  } else {
    console.time('draw')
    while(currState.instr.length){
      currState = parseInstrIt(ctx, currState, data.dist || 20, data.angle);
    }
    hideRender();
    console.timeEnd('draw')
  }
}




// document.addEventListener("DOMContentLoaded", function(event) { 
//   let canvas = document.getElementById('canvas');
//   let ctx = init(canvas, data);

//   console.time('instr')
//   let explodedInstr = makeInstr(data.axiom, data.replace, data.iterations || 5);
//   console.timeEnd('instr');

//   let currState = {curPos: data.startPos || [200,200], stack: [], curDir: data.startDir || 0, instr: explodedInstr};

//   if(watchDraw){
//     console.time('animatedraw')
//    window.requestAnimFrame(parseInstrRecurse.bind(null, ctx, currState, data.dist || 20, data.angle));
//   } else {
//     console.time('draw')
//     while(currState.instr.length){
//       currState = parseInstrIt(ctx, currState, data.dist || 20, data.angle);
//     }
//   }
//   console.timeEnd('draw')

// });


// Symbol                  Action
// -------------------------------------
// F       Move forward one unit
// f     Move forward one units without drawing
// +     Turn left by turning angle
// -     Turn right by turning angle
// |     turn 180 degrees
// [     Save the state of the turtle on a stack
// ]     Pop the state from the stack and set the turtle to it


// Using this method some fairly one can generate various plant-like creations.

// Using the following rules a bush like plant can be created:

// Axiom= ++++F
// F= FF-[-F+F+F]+[+F-F-F]
// angle=16 


// //replace = {orig, repl=[]} //can have mult rules
// function makeInstrLoop(axiom, replace, iterations){
//   // var result = axiom;
//   // for(let i = 0; i<iterations; i++){
//   //   let newRes = [];
//   //   for(let j = 0; j<result.length; j++){
//   //     newRes.push(replace[result[j]] ? replace[result[j]] : j);
//   //     if()
//   //   }
//   //   // axiom = axiom.reduce(function(built, cmd){
//   //   //   // console.log(built, cmd)
//   //   //   if (replace[cmd]) return built.concat(replace[cmd]);
//   //   //   else return built.concat(cmd);
//   //   // }, []);
//   // }

//   console.log('made', axiom.length, axiom)
//   return axiom;
// }
