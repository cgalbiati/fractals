

function initCanvas (){
  if(canvas){
    if(!ctx) ctx = canvas.getContext("2d");

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