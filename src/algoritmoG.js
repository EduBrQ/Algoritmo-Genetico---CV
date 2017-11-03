function GAInicializacao() {

    contarDistancia();

    for (var i = 0; i < TAMANHO_POPULACAO; i++) {
        populacao.push(randomIndivial(pontos.length));
    }

    setMelhorValor();
}
var tipoALgoritmo = 'ox';


$(document).on('change','.tipoAlgoritmo',function() {
    tipoALgoritmo = this.value

});

function GAProximaGeracao() {

    //pegar tipo DE CRUZAMENTO por select

    geracaoAtual++;
    selecao();
    cruzamento(tipoALgoritmo);
    mutacao();
    setMelhorValor();
}

function selecao() {
    var parents = new Array();
    var initnum = 4;
    parents.push(populacao[melhorAtual.melhorPosicao]);
    parents.push(doMutacao(best.clone()));
    parents.push(pushMutate(best.clone()));
    parents.push(best.clone());

    setRoulette();
    for (var i = initnum; i < TAMANHO_POPULACAO; i++) {
        parents.push(populacao[wheelOut(Math.random())]);
    }
    populacao = parents;
}

function cruzamento(tipoCruzamento) {

    var queue = new Array();
    for (var i = 0; i < TAMANHO_POPULACAO; i++) {

        if (Math.random() < PROBABILIDADE_CRUZAMENTO) {
            queue.push(i);
        }
    }

    queue.shuffle();

    for (var i = 0, j = queue.length - 1; i < j; i += 2) {

        if(tipoCruzamento == 'pmx'){

            cruzamentoPmx(queue[i], queue[i + 1]);

        }else {
            cruzamentoOx(queue[i], queue[i + 1]);

        }
    }

}

function cruzamentoPmx(x, y) {

    var px = populacao[x].slice(0);
    var py = populacao[y].slice(0);

    var rand = numeroRandomico(pontos.length - 1) + 1;

    var gameta_x = px.slice(0, rand);
    var gameta_y = py.slice(0, rand);

    var resto_x = px.slice(rand, px.length);
    var resto_y = py.slice(rand, py.length);

    console.log('px',px)
    console.log('py',py)

    filhox = gameta_y.concat(resto_x);
    filhoy = gameta_x.concat(resto_y);

    populacao[y] = filhox.slice(0, rand).concat(resto_y);
    populacao[x] = filhoy.slice(0, rand).concat(resto_x);

    // populacao[y] = gameta_y.concat(filhox.reject(gameta_y));
    // populacao[x] = gameta_x.concat(filhoy.reject(gameta_x));

    console.log('rejy',filhox.reject(gameta_y))
    console.log('rejx',filhoy.reject(gameta_x))

    console.log('gameta_x',gameta_x)
    console.log('resto_x',resto_x)
    console.log('gameta_y',gameta_y)
    console.log('resto_y',resto_y)
    console.log('filhox',filhox)
    console.log('filhoy',filhoy)
    console.log('popx',populacao[x])
    console.log('popy',populacao[y])
    console.log('________________________________________   ')
}


function cruzamentoOx(x, y) {

    var px = populacao[x].slice(0);
    var py = populacao[y].slice(0);



    var rand = numeroRandomico(pontos.length - 1) + 1;

    var gameta_x = px.slice(0, rand);
    var gameta_y = py.slice(0, rand);

    var resto_x = px.slice(rand, px.length);
    var resto_y = py.slice(rand, py.length);

    console.log('px',px)
    console.log('py',py)

    px = resto_x.concat(gameta_x);
    py = resto_y.concat(gameta_y);

    populacao[x] = gameta_y.concat(px.reject(gameta_y));
    populacao[y] = gameta_x.concat(py.reject(gameta_x));


    console.log('gameta_x',gameta_x)
    console.log('resto_x',resto_x)
    console.log('gameta_y',gameta_y)
    console.log('resto_y',resto_y)
    console.log('px2',px)
    console.log('py2',py)
    console.log('popx',populacao[x])
    console.log('popy',populacao[y])
    console.log('________________________________________   ')
}


function mutacao() {
    for (var i = 0; i < TAMANHO_POPULACAO; i++) {
        if (Math.random() < PROBABILIDADE_MUTACAO) {
            if (Math.random() > 0.5) {
                populacao[i] = pushMutate(populacao[i]);
            } else {
                populacao[i] = doMutacao(populacao[i]);
            }
            i--;
        }
    }
}

function doMutacao(seq) {
    qntMutacoes++;
    // m and n refers to the actual index in the array
    // m range from 0 to length-2, n range from 2...length-m
    do {
        m = numeroRandomico(seq.length - 2);
        n = numeroRandomico(seq.length);
    } while (m >= n)

    for (var i = 0, j = (n - m + 1) >> 1; i < j; i++) {
        seq.swap(m + i, n - i);
    }
    return seq;
}

function pushMutate(seq) {
    qntMutacoes++;
    var m, n;
    do {
        m = numeroRandomico(seq.length >> 1);
        n = numeroRandomico(seq.length);
    } while (m >= n)

    var s1 = seq.slice(0, m);
    var s2 = seq.slice(m, n)
    var s3 = seq.slice(n, seq.length);
    return s2.concat(s1).concat(s3).clone();
}

function setMelhorValor() {
    for (var i = 0; i < populacao.length; i++) {
        valores[i] = evaluate(populacao[i]);
    }
    melhorAtual = getMelhorAtual();
    if (melhorValor === undefined || melhorValor > melhorAtual.melhorValor) {
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

    for (var i = 1; i < populacao.length; i++) {
        if (valores[i] < currentMelhorValor) {
            currentMelhorValor = valores[i];
            bestP = i;
        }
    }
    return {
        melhorPosicao: bestP
        , melhorValor: currentMelhorValor
    }
}

function setRoulette() {
    //calculate all the fitness
    for (var i = 0; i < valores.length; i++) {
        valoresFinos[i] = 1.0 / valores[i];
    }
    //set the roleta
    var sum = 0;
    for (var i = 0; i < valoresFinos.length; i++) {
        sum += valoresFinos[i];
    }
    for (var i = 0; i < roleta.length; i++) {
        roleta[i] = valoresFinos[i] / sum;
    }
    for (var i = 1; i < roleta.length; i++) {
        roleta[i] += roleta[i - 1];
    }
}

function wheelOut(rand) {
    var i;
    for (i = 0; i < roleta.length; i++) {
        if (rand <= roleta[i]) {
            return i;
        }
    }
}

function randomIndivial(n) {
    var a = [];
    for (var i = 0; i < n; i++) {
        a.push(i);
    }
    return a.shuffle();
}

function evaluate(indivial) {
    var sum = dis[indivial[0]][indivial[indivial.length - 1]];
    for (var i = 1; i < indivial.length; i++) {
        sum += dis[indivial[i]][indivial[i - 1]];
    }
    return sum;
}

function contarDistancia() {
    var length = pontos.length;
    dis = new Array(length);
    for (var i = 0; i < length; i++) {
        dis[i] = new Array(length);
        for (var j = 0; j < length; j++) {
            dis[i][j] = ~~distancia(pontos[i], pontos[j]);
        }
    }

}