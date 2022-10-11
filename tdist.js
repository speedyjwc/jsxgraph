let lt = function(a, b) {
  return Math.abs(a - b) != a - b
};
let gt = function(a, b) {
  return Math.abs(a - b) != b - a
};
let leq = function(a, b) {
  return Math.abs(a - b) == b - a
};
let geq = function(a, b) {
  return Math.abs(a - b) == a - b
};
JXG.Options.text.useMathJax = true;

function gamma(z) {
  return Math.sqrt(2 * Math.PI / z) * Math.pow((1 / Math.E) * (z + 1 / (12 * z - 1 / (10 * z))), z);
}

let board = JXG.JSXGraph.initBoard('box', {
  boundingbox: [-4, 0.5, 4, -0.3],
  axis: true,
  showCopyright: false,
  showNavigation: false,
  defaultAxes: {
    x: {
      ticks: {
        visible: true,
        majorHeight: 1
      },
      name: '\\(t\\)', //'\\(z\\)'
      withLabel: true,
      color: '#000',
      label: {
        position: 'rt',
        offset: [-15, -25]
      },
    },
    y: {
      ticks: {
        visible: false,
        majorHeight: -1
      },
      name: '\\(y\\)',
      withLabel: false,
      color: '#000',
      label: {
        position: 'rt',
        offset: [12, 0]
      },
    },
  },
});

var chk1 = board.create('checkbox', [-3, 0.35, 'One tail'], {
  checked: false,
  fixed: true
});
var chk2 = board.create('checkbox', [-3, 0.3, 'Two tail'], {
  checked: false,
  fixed: true
});
var chkP = board.create('checkbox', [1, 0.35, 'Show value of shaded area'], {
  checked: false,
  fixed: true
});



//var gammaTest = board.create('text', [3, 0.2, gamma(10)]);


/*slider on x-axis to drag*/
let sliderDF = board.create(
  'slider',
  [
    [-2, -0.25],
    [2, -0.25],
    [5, 10, 25]
  ], {
    //name: 'degrees of freedom',
    size: 5,
    snapWidth: 1,
    withLabel: false, // hide the value of slider, since cannot make it display without decimal
    baseline: {
      strokeWidth: 1
    },
    digits: 5,
    ticks: {
      visible: false
    },
    //visable: false
  }
);

let textDF = board.create(
  'text',
  [0.15, -0.22,
    function() {
      return 'Degrees of Freedom = ' + sliderDF.Value().toFixed(0)
    }
  ]);



/*student t density curve*/
let graphT = board.create(
  'functiongraph',
  [function(x) {
    return (gamma(sliderDF.Value() / 2 + 0.5) / (Math.sqrt(sliderDF.Value() * Math.PI) * gamma(sliderDF.Value() / 2))) * Math.pow(1 + Math.pow(x, 2) / sliderDF.Value(), -0.5 - sliderDF.Value() / 2)
  }, -14, 14], {
    strokeColor: 'green'
  });

/*slider on x-axis to drag*/
let s1 = board.create(
  'slider',
  [
    [-3.4, 0],
    [3.4, 0],
    [-3.4, -3.3, 3.4]
  ], {
    ticks: {
      visible: false
    },
    label: 'drag me!!',
    size: 5,
    snapWidth: 0.01,
    withLabel: false,
    baseline: {
      strokeWidth: 1
    },
    highline: {
      strokewidth: 1
    },
    visable: false
  }
);

/*check if one tail or two tail checkbox is checked*/
var ttt = board.create('text', [function() {
  return chk1.Value() + chk2.Value()
}, 1, function() {
  return chk1.Value() + chk2.Value()
}]);


let fillL = board.create('integral', [
  [
    function() {
      if (ttt.X() == 1) {
        if (!lt(s1.Value(), 0)) {
          if (chk1.Value()) {
            return s1.Value();
          } else {
            return -14
          }
        } else {
          return -14
        }
      } else {
        return -14
      }
    },
    function() {
      if (ttt.X() == 1) {
        if (lt(s1.Value(), 0)) {
          return s1.Value()
        } else {
          if (chk2.Value()) {
            return 0 - s1.Value()
          } else {
            return 14
          }
        }
      } else {
        return -13.9
      }
    }
  ], graphT
], {
  fillColor: 'red',
  highlight: false,
  baseLeft: {
    visible: false
  },
  curveLeft: {
    visible: false
  },
  baseRight: {
    visible: false
  },
  curveRight: {
    visible: false
  },
  label: {
    visible: false
  }
});

let fillR = board.create('integral', [
  [function() {
    if (chk2.Value()) {
      return Math.abs(s1.Value())
    } else {
      return 13.9
    }
  }, 14], graphT // graph
], {
  fillColor: 'red',
  highlight: false,
  baseLeft: {
    visible: false
  },
  curveLeft: {
    visible: false
  },
  baseRight: {
    visible: false
  },
  curveRight: {
    visible: false
  },
  label: {
    visible: false
  }
});

let textZ = board.create(
  'text',
  [function() {
      return s1.Value()
    }, -0.1,
    function() {
      return s1.Value().toFixed(2)
    }
  ], {
    anchorX: 'middle',
    strokeColor: 'red',
    fontSize: 15
  });

let pointZ = board.create(
  'text',
  [function() {
    return s1.Value() * 0.5
  }, -0.15, 'drag me'], {
    anchorX: 'middle',
    strokeColor: 'black',
    fontSize: 15
  });
var l1 = board.create('arrow',
  [
    [function() {
      return s1.Value() * 0.6
    }, -0.12],
    [function() {
      return s1.Value() * 0.9
    }, -0.03]
  ]);

// p value output, initial position outside the plot, once show value checked, bring it to canvas
let textP = board.create(
  'text',
  [-8, 0.1,
    function() {
      if (chk2.Value()) {
        return 2 * fillL.Value().toFixed(3)
      } else {
        return fillL.Value().toFixed(3)
      }
    }
  ], {
    anchorX: 'left',
    fixed: true
  });


// for STACK question prt
/*let p = board.create('point',
  [function() {
      if (chk1.Value()) {
        return s1.Value()
      } else {
        return -4.000
      }
    },
    function() {
      if (chk1.Value()) {
        return 2 * fillL.Value().toFixed(3)
      } else {
        return fillL.Value().toFixed(3)
      }
    }
  ], {
    visible: false
  });*/



JXG.addEvent(chk2.rendNodeCheckbox, 'change', function() {

  if (this.Value()) {
    chk1.setAttribute({
      checked: false
    });
  } else {
    chk1.setAttribute({
      checked: true
    });
  }
  board.update();
}, chk2);

JXG.addEvent(chk1.rendNodeCheckbox, 'change', function() {

  if (this.Value()) {
    chk2.setAttribute({
      checked: false
    });
  } else {
    chk2.setAttribute({
      checked: true
    });
  }
  board.update();
}, chk1);


JXG.addEvent(chkP.rendNodeCheckbox, 'change', function() {
  if (this.Value()) {
    textP.moveTo([1, 0.3]);
  } else {
    textP.moveTo([-5, 0]);
  }
}, chkP);
