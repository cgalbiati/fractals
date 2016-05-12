function lSysData(){
  return {
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
      iterations: 5,
      startDir: 120
    },
    tree: {
      axiom: ['FX'], 
      replace:{
        '1': 'F=FF-[-F+F]+[+F-F]', 
        '2': 'X=FF+[+F]+[-F]'
      }, 
      startPos: [getWidth()/2, getHeight()],
      dist: getHeight()/60,
      angle:25,
      iterations: 4,
      startDir: 270
    },
    spiralGrass: {
      axiom: ['FX'], 
      replace:{
        '1': 'FX=FF-[-F+X-FX-F]X', 
        '2': 'X=F-[[X]--X][-X+]F[--X]-X'
      }, 
      startPos: [getWidth()/4, getHeight()-getHeight()/3],
      dist: getHeight()/8,
      angle: 340,
      iterations: 5,
      startDir: 270
    }
  };
}


//flower: F=FFF+F--F+FFF+ angle:45, 
//F=FG−FG++FG−FG, a=FG++FG++FG, 150
//F++F++F++F-GG-F++F++F++F-GG-F++F++F++F


//border F=F-F-F++F-F-F, F++F++F, 70
//F++F++F++F++F++F, F=F--FF++FF--F, 85 - line-y
//XYXYXYX+XYXYXYX+XYXYXYX+XYXYXYX, X=FX+FX+FXFY-FY-, Y=+FX+FXFY-FYFY+
// celtic scribbles: XYXYXYX+XYXYXYX+XYXYXYX+XYXYXYX, X=FX+FX+FXFY-FY-, Y=+FX+FXFY-FYFY+, 150, 4 ***takes forever
//tree: X=S[-FX]+FX, fx, 45, 10

