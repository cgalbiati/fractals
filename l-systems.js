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

//currState: {
  //curPos: [x,y]
  //stack [x,y,color]
  //curDir
  //instr
//}

function parseInstr(ctx, currState, dist=20, angle=25){
  let curX = currState.curPos[0];
  let curY = currState.curPos[1];
  let newInstr = currState.instr.slice(1);
  let newDir;
  let newStack;
  console.log('currState', currState.instr[0],currState.instr.length, currState);

  switch(currState.instr[0]){
    case 'F':
    case 'G':
      console.log('draw')
      let [newX, newY] = genLine(curX, curY, currState.curDir, dist);
      drawLine(ctx, curX, curY, newX, newY);
      return Object.assign({}, currState, {curPos: [newX, newY]}, {instr: newInstr});
    case '+':
      console.log('+')
      newDir = currState.curDir + angle <= 360 ? currState.curDir + angle : currState.curDir + angle - 360;
      console.log('newDir',newDir)
      return Object.assign({}, currState, {curDir: newDir}, {instr: newInstr});
    case '-':
          console.log('-')

      newDir = currState.curDir - angle >= 0 ? currState.curDir - angle : currState.curDir - angle + 360;
      console.log('newDir',newDir)
      return Object.assign({}, currState, {curDir: newDir}, {instr: newInstr});
    case '[':
      newStack = currState.stack.concat({pos:currState.curPos, dir:currState.curDir});
      console.log('[', Object.assign({}, currState, {curDir: currState.curDir}, {stack: newStack}, {instr: newInstr}))
      return Object.assign({}, currState, {curDir: currState.curDir}, {stack: newStack}, {instr: newInstr});
    case ']':
      let oldPos = currState.stack[currState.stack.length-1];
      newStack = currState.stack.slice(0, currState.stack.length-1);
      console.log(']', Object.assign({}, currState, {curDir: oldPos.dir}, {curPos: oldPos.pos}, {stack: newStack}, {instr: newInstr}))
      return Object.assign({}, currState, {curDir: oldPos.dir}, {curPos: oldPos.pos}, {stack: newStack}, {instr: newInstr});
    default: return Object.assign({}, currState, {instr: newInstr});
  }
  return Object.assign({}, currState, {instr: newInstr});

}

//replace = {orig, repl=[]} //can have mult rules
function makeInstr(axiom, replace, iterations){
  for(let i = 0; i<iterations; i++){
    axiom = axiom.reduce(function(built, cmd){
      if (replace[cmd]) return built.concat(replace[cmd]);
      else return built;
    }, []);
  }
  console.log('made', axiom)
  return axiom;
}

//returns start and end pts for draw
function genLine(curX, curY, dirAngle=35, dist=20){
    console.log('lala', curX, curY, dirAngle, dist)

  //(x+c)2 + (y2 + dirAngle*c)2 = dist2
  let rad = dirAngle * Math.PI/180;
  let newX = curX + Math.cos(rad) * dist;
  let newY = curY + Math.sin(rad) * dist;
  console.log('generated', rad, newX, newY)
  return [newX, newY];
}

window.addEventListener('resize', function(e){
  let canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// let data = {axiom: ['+','+','F','+','F'], replace:{'F': ['F', '+', '+', 'F', 'F', '-', 'F', '+', 'F', '+', 'F', 'F','+']}}
// let data = {axiom: ['+','+','+','+','+','F'], replace:{'F': ['F','F','-','[','-','F','+','F','+','F',']','+','[','+','F','-','F','-','F',']']}}
// let data = {axiom: ['F'], replace:{'F': ['F','-','F','+','+','F','-','F']}}
//should be tree
// let data = {axiom: ['X'], replace:{'F': ['F','F'], 'X': ['F','-','[','[','X',']','+','X',']','+','F','[','+','F','X',']','-','X']}}

//should be triangle
// let data = {axiom: ['F','-','G','-','G'], replace:{'F': ['F','-','G','+','F','+','G','-','F'], 'G':['G','G']}, angle:120}

// let data = {axiom: ['F','X'], replace:{'F': ['X','+','Y','F','+'], Y: ['-','F','X','-','Y']}, angle:90}

let data = {axiom: ['-','F'], replace:{'F': ['F','+','F','+','F','+','F','+','F']}, angle:90}


document.addEventListener("DOMContentLoaded", function(event) { 
  let canvas = document.getElementById('canvas');
  let ctx = init(canvas, data);

  let explodedInstr = makeInstr(data.axiom, data.replace, data.iterations || 4);

  let currState = {curPos: data.startPos || [300,300], stack: [], curDir: data.startDir || 0, instr: explodedInstr};

  while(currState.instr.length){
    currState = parseInstr(ctx, currState, data.dist || 20, data.angle);
  }

  // drawLine(ctx, [30, 40, 30, 90], 'red');
  // drawLine(ctx, genLine(100,100,20,20,1));


  // ctx.beginPath();
  // ctx.arc(getWidth()/2, getHeight()/2, 20, 0, 360);
  // ctx.fillStyle = 'red';
  // ctx.fill();

});

function drawLine(ctx, startX, startY, endX, endY, color){
  console.log('hi', startX, startY, endX, endY)
  if (!color, color = 'blue');
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

function init (canvas, data){
  if(canvas){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let ctx = canvas.getContext("2d");
    ctx.lineWidth=3;

    return ctx;

  } else throw new Error('Could not get canvas');
}
