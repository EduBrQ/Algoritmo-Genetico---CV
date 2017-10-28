function GAInicializacao() {
  contarDistancia();
  for(var i=0; i<TAMANHO_POPULACAO; i++) {
    populacao.push(randomIndivial(pontos.length));
  }
  setMelhorValor();
}
function GAProximaGeracao() {
  geracaoAtual++;
  selecao();
  cruzamento();
  mutacao();

  //   if(UNCHANGED_GENS > TAMANHO_POPULACAO + ~~(pontos.length/10)) {
  //   PROBABILIDADE_MUTACAO = 0.05;
  //   if(doMutacaoPrecisa) {
  //     best = mutacaoPrecisa(best);
  //     best = mutacaoPrecisa1(best);
  //     if(evaluate(best) < melhorValor) {
  //       melhorValor = evaluate(best);
  //       UNCHANGED_GENS = 0;
  //       doMutacaoPrecisa = true;
  //     } else {
  //       doMutacaoPrecisa = false;
  //     }
  //   }
  // } else {
  //   doMutacaoPrecisa = 1;
  //   PROBABILIDADE_MUTACAO = 0.01;
  // }
  setMelhorValor();
}
function tribulate() {
  //for(var i=0; i<TAMANHO_POPULACAO; i++) {
  for(var i=populacao.length>>1; i<TAMANHO_POPULACAO; i++) {
    populacao[i] = randomIndivial(pontos.length);
  }	
}
function selecao() {
  var parents = new Array();
  var initnum = 4;
  parents.push(populacao[melhorAtual.melhorPosicao]);
  parents.push(doMutacao(best.clone()));
  parents.push(pushMutate(best.clone()));
  parents.push(best.clone());

  setRoulette();
  for(var i=initnum; i<TAMANHO_POPULACAO; i++) {
    parents.push(populacao[wheelOut(Math.random())]);
  }
  populacao = parents;
}
function cruzamento() {
  var queue = new Array();
  for(var i=0; i<TAMANHO_POPULACAO; i++) {
    if( Math.random() < PROBABILIDADE_CRUZAMENTO ) {
      queue.push(i);
    }
  } 
  queue.shuffle();
  for(var i=0, j=queue.length-1; i<j; i+=2) {
    fazerCruzamento(queue[i], queue[i+1]);
    cruzamentoOx(queue[i], queue[i+1]);
  }
}
function cruzamentoOx(x, y) {
  //var px = populacao[x].roll();
  //var py = populacao[y].roll();
  var px = populacao[x].slice(0);
  var py = populacao[y].slice(0);

  var rand = numeroRandomico(pontos.length-1) + 1;
  var pre_x = px.slice(0, rand);
  var pre_y = py.slice(0, rand);

  var tail_x = px.slice(rand, px.length);
  var tail_y = py.slice(rand, py.length);

  px = tail_x.concat(pre_x);
  py = tail_y.concat(pre_y);

  populacao[x] = pre_y.concat(px.reject(pre_y));
  populacao[y] = pre_x.concat(py.reject(pre_x));
}

function fazerCruzamento(x, y) {
  filho1 = getFilho('next', x, y);
  filho2 = getFilho('previous', x, y);
  populacao[x] = filho1;
  populacao[y] = filho2;
}
function getFilho(fun, x, y) {
  solucao = new Array();
  var px = populacao[x].clone();
  var py = populacao[y].clone();
  var dx,dy;
  var c = px[numeroRandomico(px.length)];
  solucao.push(c);

  while(px.length > 1) {
    dx = px[fun](px.indexOf(c));
    dy = py[fun](py.indexOf(c));
    px.deleteByValue(c);
    py.deleteByValue(c);
    c = dis[c][dx] < dis[c][dy] ? dx : dy;
    solucao.push(c);
  }
  return solucao;
}
function mutacao() {
  for(var i=0; i<TAMANHO_POPULACAO; i++) {
    if(Math.random() < PROBABILIDADE_MUTACAO) {
      if(Math.random() > 0.5) {
        populacao[i] = pushMutate(populacao[i]);
      } else {
        populacao[i] = doMutacao(populacao[i]);
      }
      i--;
    }
  }
}
function mutacaoPrecisa(orseq) {  
  var seq = orseq.clone();
  if(Math.random() > 0.5){
    seq.reverse();
  }
  var melhorv = evaluate(seq);
  for(var i=0; i<(seq.length>>1); i++) {
    for(var j=i+2; j<seq.length-1; j++) {
      var new_seq = swap_seq(seq, i,i+1,j,j+1);
      var v = evaluate(new_seq);
      if(v < melhorv) {melhorv = v, seq = new_seq; };
    }
  }
  //alert(melhorv);
  return seq;
}
function mutacaoPrecisa1(orseq) {  
  var seq = orseq.clone();
  var melhorv = evaluate(seq);

  for(var i=0; i<seq.length-1; i++) {
    var new_seq = seq.clone();
    new_seq.swap(i, i+1);
    var v = evaluate(new_seq);
    if(v < melhorv) {melhorv = v, seq = new_seq; };
  }
  //alert(melhorv);
  return seq;
}
function swap_seq(seq, p0, p1, q0, q1) {
  var seq1 = seq.slice(0, p0);
  var seq2 = seq.slice(p1+1, q1);
  seq2.push(seq[p0]);
  seq2.push(seq[p1]);
  var seq3 = seq.slice(q1, seq.length);
  return seq1.concat(seq2).concat(seq3);
}
function doMutacao(seq) {
  qntMutacoes++;
  // m and n refers to the actual index in the array
  // m range from 0 to length-2, n range from 2...length-m
  do {
    m = numeroRandomico(seq.length - 2);
    n = numeroRandomico(seq.length);
  } while (m>=n)

    for(var i=0, j=(n-m+1)>>1; i<j; i++) {
      seq.swap(m+i, n-i);
    }
    return seq;
}
function pushMutate(seq) {
  qntMutacoes++;
  var m,n;
  do {
    m = numeroRandomico(seq.length>>1);
    n = numeroRandomico(seq.length);
  } while (m>=n)

  var s1 = seq.slice(0,m);
  var s2 = seq.slice(m,n)
  var s3 = seq.slice(n,seq.length);
  return s2.concat(s1).concat(s3).clone();
}
function setMelhorValor() {
  for(var i=0; i<populacao.length; i++) {
    valores[i] = evaluate(populacao[i]);
  }
  melhorAtual = getMelhorAtual();
  if(melhorValor === undefined || melhorValor > melhorAtual.melhorValor) {
    best = populacao[melhorAtual.melhorPosicao].clone();
    melhorValor = melhorAtual.melhorValor;
    UNCHANGED_GENS = 0;
  } else {
    UNCHANGED_GENS += 1;
  }
}
function getMelhorAtual() {
  var bestP = 0,
  currentMelhorValor = valores[0];

  for(var i=1; i<populacao.length; i++) {
    if(valores[i] < currentMelhorValor) {
      currentMelhorValor = valores[i];
      bestP = i;
    }
  }
  return {
    melhorPosicao : bestP
    , melhorValor    : currentMelhorValor
  }
}
function setRoulette() {
  //calculate all the fitness
  for(var i=0; i<valores.length; i++) { valoresFinos[i] = 1.0/valores[i]; }
  //set the roleta
  var sum = 0;
  for(var i=0; i<valoresFinos.length; i++) { sum += valoresFinos[i]; }
  for(var i=0; i<roleta.length; i++) { roleta[i] = valoresFinos[i]/sum; }
  for(var i=1; i<roleta.length; i++) { roleta[i] += roleta[i-1]; }
}
function wheelOut(rand) {
  var i;
  for(i=0; i<roleta.length; i++) {
    if( rand <= roleta[i] ) {
      return i;
    }
  }
}
function randomIndivial(n) {
  var a = [];
  for(var i=0; i<n; i++) {
    a.push(i);
  }
  return a.shuffle();
}
function evaluate(indivial) {
  var sum = dis[indivial[0]][indivial[indivial.length - 1]];
  for(var i=1; i<indivial.length; i++) {
    sum += dis[indivial[i]][indivial[i-1]];
  }
  return sum;
}
function contarDistancia() {
  var length = pontos.length;
  dis = new Array(length);
  for(var i=0; i<length; i++) {
    dis[i] = new Array(length);
    for(var j=0; j<length; j++) {
      dis[i][j] = ~~distancia(pontos[i], pontos[j]);
    }
  }

}