Array.prototype.clone = function() { return this.slice(0); }
Array.prototype.shuffle = function() {
  for(var j, x, i = this.length-1; i; j = numeroRandomico(i), x = this[--i], this[i] = this[j], this[j] = x);
  return this;
};
Array.prototype.indexOf = function (value) {	
  for(var i=0; i<this.length; i++) {
    if(this[i] === value) {
      return i;
    }
  }
}
Array.prototype.deleteByValue = function (value) {  //deleta os pontos no canvas pelo value de cada
  var pos = this.indexOf(value);
  this.splice(pos, 1);
}
Array.prototype.next = function (index) {
  if(index === this.length-1) {
    return this[0];
  } else {
    return this[index+1];
  }
}
Array.prototype.previous = function (index) {
  if(index === 0) {
    return this[this.length-1];
  } else {
    return this[index-1];
  }
}
Array.prototype.swap = function (x, y) {
  if(x>this.length || y>this.length || x === y) {return}
  var tem = this[x];
  this[x] = this[y];
  this[y] = tem;
}
Array.prototype.roll = function () {
  var rand = numeroRandomico(this.length);
  var tem = [];
  for(var i = rand; i<this.length; i++) {
    tem.push(this[i]);
  }
  for(var i = 0; i<rand; i++) {
    tem.push(this[i]);
  }
  return tem;
}
Array.prototype.reject = function (array) {
  return $.map(this,function (ele) {
    return $.inArray(ele, array) < 0 ? ele : null;
  })
}
// function intersect(x, y) {
//   return $.map(x, function (xi) {
//     return $.inArray(xi, y) < 0 ? null : xi;
//   })
// }
function Ponto(x, y) {
  this.x = x;
  this.y = y;
}
function pontoRandomico() {
  var randomx = numeroRandomico(WIDTH);
  var randomy = numeroRandomico(HEIGHT);
  var pontoRandomico = new Ponto(randomx, randomy);
  return pontoRandomico;
}
function numeroRandomico(boundary) {
  return parseInt(Math.random() * boundary);
  //return Math.floor(Math.random() * boundary);
}
function distancia(p1, p2) {
  return euclideano(p1.x-p2.x, p1.y-p2.y);
}
function euclideano(dx, dy) {
  return Math.sqrt(dx*dx + dy*dy);
}
