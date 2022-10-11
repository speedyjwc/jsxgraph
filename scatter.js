/*less than func*/
let lt = function(a, b) {
  return Math.abs(a - b) != a - b
};

/*get correlation coefficient, slope, intercept of two arraies*/
let simpleLinearReg = function(x, y) {
  const n = x.length;
  if (n == 0) return 0;
  let sumX = 0;
  let sumY = 0;
  for (var i = 0; lt(i, n); i++) {
    sumX += x[i]
    sumY += y[i]
  }
  let meanX = sumX / n;
  let meanY = sumY / n;
  /*let meanX = Math.sum(x) / n;
  let meanY = Math.sum(y) / n;*/


  let num = 0;
  let den1 = 0;
  let den2 = 0;
  for (var i = 0; lt(i, n); i++) {
    let dx = (x[i] - meanX);
    let dy = (y[i] - meanY);
    num += dx * dy
    den1 += dx * dx
    den2 += dy * dy
  }
  const den = Math.sqrt(den1) * Math.sqrt(den2);
  const m = num / den1;
  const b = meanY - m * meanX
  if (den == 0) return 0;
  return [num / den, m, b];
};

/*number of dots*/
var dotNum = 50;

/*ideal slope*/
var s = 0.5; // for negative, change the display

var board = JXG.JSXGraph.initBoard('jsxgbox', {
  axis: true,
  boundingbox: [-50, 110, 110, -50],
  keepaspectratio: true
});

/*generate random numbers for X Y*/
var i, x, y, corX = [],
  corY = [],
  x_arr = [],
  y_arr = [];
for (i = 0; lt(i, dotNum); i++) {
  x = i + (Math.random() - 0.5);
  y = s * i + (0.5 - Math.random()) * 20;
  // y = Math.exp(((1.5*i+3)/0.3)**2/(-2))/(0.3*Math.sqrt(2*Math.PI));
  // arries for correlation calculations
  corX.push(x);
  corY.push(y);
  // arries for drawing scatter 
  x_arr.push(x, x, NaN);
  y_arr.push(y, y, NaN);
}

var cor = simpleLinearReg(corX, corY)[0];
var slope = simpleLinearReg(corX, corY)[1];
var intercept = simpleLinearReg(corX, corY)[2];

var equation = board.create('text', [60, 10, " y = " + intercept.toFixed(3) +" + x * " + slope.toFixed(3) + "<br>correlation coeficient: " + cor.toFixed(3)]);

var line = board.create("functiongraph",
  [function(x) {
      return intercept + slope * x
    },
    0, 50
  ], {
    strokeColor: 'green'
  });


var scatterplot = board.create('curve', [x_arr, y_arr], {
  strokeWidth: 3
});
