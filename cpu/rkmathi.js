/// based on "cpu/CPULv2.js"
(function(global) {
"use strict";

// --- define ----------------------------------------------
// platform detection
// var _BROWSER = !!global.self;
// var _WORKER  = !!global.WorkerLocation;
var _NODE_JS = !!global.global;

// --- local variable --------------------------------------
/* I wanna get!!
* AYB--BYA
* YZD--DZY
* BDC--CDB
* --------
* --------
* BDC--CDB
* YZD--DZY
* AYB--BYA
*/
var _wannaGet = {
  // I wanna get
  "A": [ 0,  7, 56, 63],
  "B": [ 2,  5, 16, 23, 40, 47, 58, 61],
  "C": [18, 21, 42, 45],
  "D": [10, 13, 17, 22, 41, 46, 50, 53],
};

// --- interface -------------------------------------------
function rkmathi(name) {
    this._name = name;
    this._human = false;
}
rkmathi.prototype.__proto__ = Player.prototype;
rkmathi.prototype.logic = logic; // [override] #logic

// --- implement -------------------------------------------
function logic(param, callback) {
    var cell = new Cell(param.cell);
    var hint = cell.hint(param.color);
    var color = param.color;
    var turn = param.turn;
    var candidate = [];
    var candidate2 = [];
    var pos = 0, i = 0, iz = 0, j = 0;

    for (i=0; i<64; ++i) {
      if (hint[i]) candidate.push([i, hint[i]]);
    }
    var named = BaseLogic.getNamedCell();
    var weight = [];

    /// !!! I wanna get !!!
    var _fixPosFlag = false;
    var _fixPos = -1;
    if (!_fixPosFlag) {
      _wannaGet.A.forEach(function (i) {
        if (hint[i] > 0) { _fixPosFlag = true; _fixPos = i; }
      });
    }
    if (!_fixPosFlag) {
      _wannaGet.B.forEach(function (i) {
        if (hint[i] > 0) { _fixPosFlag = true; _fixPos = i; }
      });
    }
    if (!_fixPosFlag) {
      _wannaGet.C.forEach(function (i) {
        if (hint[i] > 0) { _fixPosFlag = true; _fixPos = i; }
      });
    }
    if (!_fixPosFlag) {
      _wannaGet.D.forEach(function (i) {
        if (hint[i] > 0) { _fixPosFlag = true; _fixPos = i; }
      });
    }
    /// !!! I wanna get !!!

    for (i=0, iz=candidate.length; i<iz; ++i) {
      weight[i] = 20;
      for (j=0; j<named.K.length; ++j) { weight[i] += (named.K[j] == candidate[i][0]) ? 20 : 0; }
      for (j=0; j<named.A.length; ++j) { weight[i] += (named.A[j] == candidate[i][0]) ?  2 : 0; }
      for (j=0; j<named.B.length; ++j) { weight[i] += (named.B[j] == candidate[i][0]) ?  4 : 0; }
      for (j=0; j<named.C.length; ++j) { weight[i] += (named.C[j] == candidate[i][0]) ?-10 : 0; }
      for (j=0; j<named.X.length; ++j) { weight[i] += (named.X[j] == candidate[i][0]) ?-20 : 0; }
    }

    for (i=0, iz=candidate.length; i<iz; ++i) {
      candidate2[0] = [
          BaseLogic.getHintLength(cell.cell(), color),
          BaseLogic.getHintLength(cell.cell(), BaseLogic.reverseColor(color))
      ];
      var nextCell = new Cell(cell.cell()).move(
          color,
          candidate[i][0] % 8,
          candidate[i][0] / 8 | 0
      );
      candidate2[1] = [
          BaseLogic.getHintLength(nextCell.cell(), color),
          BaseLogic.getHintLength(nextCell.cell(), BaseLogic.reverseColor(color))
      ];
      if (candidate2[0][0] <= candidate2[1][0]) {
        weight[i] += Math.abs(candidate2[0][0] - candidate2[1][0]);
      }
      if (candidate2[0][1] > candidate2[1][1]) {
        weight[i] += Math.abs(candidate2[0][1] - candidate2[1][1]);
      }
    }

    if (turn < 12) {
      var max = -20;
      var maxWeight = [];
      for (i=0; i<weight.length; ++i) {
        if (max < weight[i]) {
          max = weight[i];
          maxWeight = [i];
        } else if (max == weight[i]) {
          maxWeight.push(i);
        }
      }
      pos = maxWeight[Math.floor(Math.random() * maxWeight.length)];
    } else {
      pos = BaseLogic.getMaxValueIndex(weight);
    }

    var position = _fixPosFlag ? _fixPos : candidate[pos][0];
    callback(position);
}

// --- export ----------------------------------------------
if (_NODE_JS) {
    module.exports = rkmathi;
}
global.rkmathi = rkmathi;

})(this.self || global);

