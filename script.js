jQuery(function () {

    novaCartela('Gean')
    novaCartela('Sâmela')
    novaCartela('Alam')
    novaCartela('Kell')

    for(i = 1; i < 76; i++){
        bolas.push(i.toString().padStart(2, '0'))
    }

    $('#btnNovaCartela').on('click', novaCartelaAction)
    $('#btnReset').on('click', reiniciar)
    $('#btnPausar').on('click', pausarAction)
    $('#btnJogar').on('click', jogarAction)
    $('#btnContinuarJogo').on('click', jogarAction)
});

var jogadores = [];
var numJogados = [];
var bolas = []
var jogoBotId;

function novaCartelaAction(){
    let nome = prompt("Qual o nome do Jogador?");
    
    novaCartela(nome)
}

function pausarAction(){
    clearInterval(jogoBotId)
    jogoBotId = undefined
}

function jogarAction(){
    $('#btnPausar').css('display', 'inline-block')
    $('#btnJogar').css('display', 'none')
    $('#btnContinuarJogo').css('display', 'inline-block')
    if(jogoBotId == undefined)
        $('#ariaAlert').text('jogo iniciado')
    else
        $('#ariaAlert').text('jogo retomado')

    setTimeout(sortearNovoNumero, 0)
    jogoBotId = setInterval(sortearNovoNumero, 5000)
}

function sortearNovoNumero(){
    if(bolas.length == 0) {
        alert("acabaram as bolas!!")
        return
    }
    let novoNum = bolas.splice(Math.floor(Math.random() * bolas.length), 1)[0];
    numJogados.push(novoNum);

    updateNumJogados()
    updateListaDeCartelas()
    $('#ariaAlert').text('bola ' + novoNum)

    let vencedor = checkVencedor();
    if(vencedor != null){
        setTimeout(function () {
            clearInterval(jogoBotId)
            alert(vencedor.nome + " ganhou o jogo!!!")
            
            $('#btnPausar').attr('disabled', 'true');
            $('#btnJogar').attr('disabled', 'true');
        }, 0)
        
    }

}

function checkVencedor(){
    return jogadores.filter(jogador => {
        return jogador.numeros.filter(num => numJogados.includes(num)).length == jogador.numeros.length
     })[0]
}

function updateNumJogados(){
    $('#numJogados').empty();

    numJogados.forEach(num => {
        
        $('<div />', {
            text: num
        }).appendTo('#numJogados');

    })
}

function novaCartela(nome){
    if(nome == null || nome == '') return;

    let numeros = sortearNumeros();

    jogadores.push({
        nome: nome,
        numeros: numeros
    })

    updateListaDeCartelas();
}

function reiniciar() {
    
    $('#btnPausar').css('display', 'none')
    $('#btnPausar').removeAttr('disabled');
    $('#btnJogar').css('display', 'inline-block')
    $('#btnContinuarJogo').css('display', 'none')
    $('#btnJogar').removeAttr('disabled');
    $('#ariaAlert').text('jogo pausado')
    
    jogadores = []
    numJogados = []
    var bolas = []

    for(i = 1; i < 76; i++){
        bolas.push(i.toString().padStart(2, '0'))
    }
    
    updateListaDeCartelas();
    updateNumJogados();
    clearInterval(jogoBotId)
}

function updateListaDeCartelas() {
    $('#cartelaList').empty();
    jogadores.forEach(jogador => {
        let cartela = montarCartela(jogador.nome, jogador.numeros);

        cartela.appendTo('#cartelaList')

    });
}

function gerarAriaLabelCartela(nome, numeros, numMarcados) {
    let numerosNMarcados = numeros.filter(num => !numMarcados.includes(num))

    let ariaLabel = 'cartela ' + nome
        + ', ' + numMarcados.length + ' de ' + numeros.length + ' números marcados'
        
    return ariaLabel
}

function montarCartela(nome, numeros) {
    
    celulas = [...numeros];

    celulas.splice(numeros.length/2, 0, 'X')
    let numMarcados = numJogados.filter(num => numeros.includes(num));

    let novaCartela = $('<div />', {class: 'cartela' });


    let cartelaInfo = $('<div />', {class: 'cartelaInfo'})
    cartelaInfo.attr('tabindex', 0)
    $('<b />', { text: nome }).appendTo(cartelaInfo);
    $('<b />', { 
        text: '( ' + numMarcados.length + '/' + numeros.length + ' )' 
    }).appendTo(cartelaInfo)
    cartelaInfo.appendTo(novaCartela)

    var tabela = $('<table />') 

    var linha = $('<tr />');
    linha.css('border', '0.1rem solid black');
    linha.attr('aria-hidden', 'true');
    
    $('<th />',{ text: 'B'}).appendTo(linha)
    $('<th />',{ text: 'I'}).appendTo(linha)
    $('<th />',{ text: 'N'}).appendTo(linha)
    $('<th />',{ text: 'G'}).appendTo(linha)
    $('<th />',{ text: 'O'}).appendTo(linha)
    linha.appendTo(tabela)

    for(y = 0; y < 5; y++) {
        linha = $('<tr />');        
        var coluna
        for (x = 0; x < 5; x++) {
            coluna = $('<td />')
            coluna.text(celulas[x * 5 + y])
            coluna.css('background-color', numJogados.includes(celulas[x * 5 + y]) ? 'lightgreen': 'white')
            coluna.appendTo(linha)
        }
        linha.appendTo(tabela)
    }

    tabela.appendTo(novaCartela)

    return novaCartela;
}

function sortearNumeros(){
    var output = [];
    // numeros B
    for(i = 0; i < 5; i++) {
        let novoNumero;
        do{
            novoNumero = Math.ceil(Math.random() * 15).toString().padStart(2, '0');
        } while (output.indexOf(novoNumero) > -1);
        output.push(novoNumero);
    }
    // numeros I
    for(i = 0; i < 5; i++) {
        let novoNumero;
        do{
            novoNumero = (15 + Math.ceil(Math.random() * 15)).toString();
        } while (output.indexOf(novoNumero) > -1);
        output.push(novoNumero);
    }
    // numeros N
    for(i = 0; i < 4; i++) {
        let novoNumero;
        do{
            novoNumero = (30 + Math.ceil(Math.random() * 15)).toString();
        } while (output.indexOf(novoNumero) > -1);
        output.push(novoNumero);
    }
    // numeros G
    for(i = 0; i < 5; i++) {
        let novoNumero;
        do{
            novoNumero = (45 + Math.ceil(Math.random() * 15)).toString();
        } while (output.indexOf(novoNumero) > -1);
        output.push(novoNumero);
    }
    // numeros I
    for(i = 0; i < 5; i++) {
        let novoNumero;
        do{
            novoNumero = (60 + Math.ceil(Math.random() * 15)).toString();
        } while (output.indexOf(novoNumero) > -1);
        output.push(novoNumero);
    }
    output.sort();
    return output
}