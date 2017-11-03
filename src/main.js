var canvas, ctx;
var WIDTH, HEIGHT;
var pontos = [];
var running;
var canvasMinX, canvasMinY;
var doMutacaoPrecisa;

var TAMANHO_POPULACAO;
var ELITE_RATE;
var PROBABILIDADE_CRUZAMENTO;
var PROBABILIDADE_MUTACAO;
var TAXA_CRUZAMENTO_OX;
var UNCHANGED_GENS;

var qntMutacoes;
var dis; //para contar a distancia
var melhorValor, best;
var geracaoAtual;
var melhorAtual;
var populacao;
var valores;
var valoresFinos;
var roleta;

$(function() {
  init();
  initData();

  pontos = data8;

  $('#addRandom_btn').click(function() {
    addPontosRandomicos(8);
    $('#status').text("");
    running = false;
  });
  $('#start_btn').click(function() {
    if(pontos.length >= 3) {
      initData();
      GAInicializacao();
      running = true;
    } else {
      alert("adicione mais pontos ao mapa!");
    }
  });
  $('#clear_btn').click(function() {
    running === false;
    initData();
    pontos = new Array();
  });
  $('#stop_btn').click(function() {
    if(running === false && geracaoAtual !== 0){
      if(best.length !== pontos.length) {
          initData();
          GAInitialize();
      }
      running = true;
    } else {
      running = false;
    }
  });
});
function init() {
  ctx = $('#canvas')[0].getContext("2d");
  WIDTH = $('#canvas').width();
  HEIGHT = $('#canvas').height();
  setInterval(draw, 10);
  init_mouse();
}
function init_mouse() {
  $("canvas").click(function(evt) {
    if(!running) {
      canvasMinX = $("#canvas").offset().left;
      canvasMinY = $("#canvas").offset().top;
      $('#status').text("");

      x = evt.pageX - canvasMinX;
      y = evt.pageY - canvasMinY;
      pontos.push(new Ponto(x, y));
    }
  });
}
function initData() {
  running = false;
  TAMANHO_POPULACAO = 10;
  ELITE_RATE = 0.3;
  PROBABILIDADE_CRUZAMENTO = 0.7;
  PROBABILIDADE_MUTACAO  = 0.01;
  TAXA_CRUZAMENTO_OX = 0.7;
  UNCHANGED_GENS = 0;
  qntMutacoes = 0;
  doMutacaoPrecisa = true;

  melhorValor = undefined;
  best = [];
  geracaoAtual = 0;
  populacao = []; //new Array(TAMANHO_POPULACAO);
  valores = new Array(TAMANHO_POPULACAO);
  valoresFinos = new Array(TAMANHO_POPULACAO);
  roleta = new Array(TAMANHO_POPULACAO);
}

function addPontosRandomicos(number) {
  running = false;
  for(var i = 0; i<number; i++) {
    pontos.push(pontoRandomico());
  }
}

function drawCircle(point) {
  ctx.fillStyle   = '#000';
  ctx.beginPath();
  ctx.arc(point.x, point.y, 3, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}
function drawLines(array) {
  ctx.strokeStyle = '#f00';
  ctx.lineWidth = 1;
  ctx.beginPath();

  ctx.moveTo(pontos[array[0]].x, pontos[array[0]].y);
  for(var i=1; i<array.length; i++) {
    ctx.lineTo( pontos[array[i]].x, pontos[array[i]].y )
  }
  ctx.lineTo(pontos[array[0]].x, pontos[array[0]].y);

  ctx.stroke();
  ctx.closePath();
}
function draw() {
  if(running) {
    GAProximaGeracao();

    $('#status').text("Tem " + pontos.length + " cidades no mapa, "
                      +"a " + geracaoAtual + "(a) geracao com "
                      + qntMutacoes + " vezes de mutacao. Melhor valor: "
                      + ~~(melhorValor));

    if(qntMutacoes >= ~~(melhorValor) || geracaoAtual >= (pontos.length*100)){
      running = false
    }
  } else {

    $('#status').text("Tem " + pontos.length + " Cidades no mapa. ")
  }
  clearCanvas();
  if (pontos.length > 0) {
    for(var i=0; i<pontos.length; i++) {
      drawCircle(pontos[i]);
    }
    if(best.length === pontos.length) {
      drawLines(best);
    }
  }
}
function clearCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
