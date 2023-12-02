jQuery(function () {

    novaCartela('Gean')
    novaCartela('Samela')

    for(i = 1; i < 76; i++){
        bolas.push(i.toString().padStart(2, '0'))
    }

    for(i = 0; i < bolas.length; i++){
        numJogados.push(bolas[i])
    }
    updateNumJogados()

    $('#btnNovaCartela').on('click', novaCartelaAction)
    $('#btnReset').on('click', reiniciar)
    $('#btnPausar').on('click', pausarAction)
    $('#btnJogar').on('click', jogarAction)
    $('#btnContinuarJogo').on('click', continuarJogoAction)

    updateButtons()
    notificar('Bem vindo ao jogo do bingo!')
});

var jogadores = [];
var numJogados = [];
var bolas = []
var jogoBotId;
var section;

function updateButtons(){
    $('#btnPausar').attr('disabled', !jogoBotId)
    $('#btnJogar').attr('disabled', jogadores.length < 2)
    $('#btnContinuarJogo').attr('disabled', !!jogoBotId)
}

function novaCartelaAction(){
    let nome = prompt("Qual o nome do Jogador?");
    
    novaCartela(nome)
    updateButtons()
}

function pausarAction(){
    clearInterval(jogoBotId)
    jogoBotId = undefined
    notificar('jogo pausado')
    updateButtons()
}

function jogarAction(){
    iniciarJogo()
    notificar('jogo iniciado')
    updateButtons()
}

function continuarJogoAction(){
    iniciarJogo()
    notificar('jogo retomado')
    updateButtons()
}

function iniciarJogo(){
    if(jogoBotId) return
    $('#btnPausar').css('display', 'inline-block')
    $('#btnJogar').css('display', 'none')
    $('#btnContinuarJogo').css('display', 'inline-block')
    

    setTimeout(sortearNovoNumero, 0)
    jogoBotId = setInterval(sortearNovoNumero, 3000)
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
    notificar('bola ' + novoNum)

    let vencedor = checkVencedor();
    if(vencedor != null){
        setTimeout(function () {
            clearInterval(jogoBotId)
            jogoBotId = undefined
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
    $('div#numJogados').css('display', 'grid')

    numJogados.forEach(num => {
        
        $('<p />', {
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

function notificar(msg){
    $('#notificacao').text(msg)
}

function reiniciar() {
    
    $('#btnPausar').css('display', 'none')
    $('#btnPausar').removeAttr('disabled');
    $('#btnJogar').css('display', 'inline-block')
    $('#btnContinuarJogo').css('display', 'none')
    $('#btnJogar').removeAttr('disabled');

    notificar('jogo reiniciado')
    
    jogadores = []
    numJogados = []
    var bolas = []

    for(i = 1; i < 76; i++){
        bolas.push(i.toString().padStart(2, '0'))
    }
    
    updateListaDeCartelas();
    updateNumJogados();
    updateButtons()
    clearInterval(jogoBotId)
    jogoBotId = undefined
}

function updateListaDeCartelas() {
    $('#cartelaList').empty();
    if(jogadores.length > 0) {
        if(jogadores.length == 1){
            $('#cartelas p').empty()
            $('<p />', {
                text: 'Quantidade de cartelas insuficiente, favor incluir pelo menos mais uma cartela para jogar'
            }).appendTo('#cartelas p')
        } else {
            $('#cartelas p').css('display', 'none')
        }
        jogadores.forEach(jogador => {
            let cartela = montarCartela(jogador.nome, jogador.numeros);
            
            cartela.appendTo('#cartelaList')

        });
    } else
        $('<p />', {
            text: 'Nenhuma cartela disponível. inclua pelo menos 2 para poder iniciar o jogo'
        }).appendTo('#cartelas p')
    
}

function gerarAriaLabelCartela(nome, numeros, numMarcados) {

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
    $('<h3 />', { text: nome }).appendTo(cartelaInfo);
    $('<b />', { 
        text: '( ' + numMarcados.length + '/' + numeros.length + ' )' 
    }).appendTo(cartelaInfo)
    cartelaInfo.appendTo(novaCartela)

    var tabela = $('<table />') 

    var linha = $('<tr />');
    linha.css('border', '0.1rem solid black');
    
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
            coluna.attr('aria-label', celulas[x * 5 + y] + (numJogados.includes(celulas[x * 5 + y]) ? ' marcado' : ''))

            if(numJogados.includes(celulas[x * 5 + y])){
                let marcacao = $('<i />', {
                    class: 'fa-solid fa-x'
                })
                marcacao.attr('role', 'figure')
                marcacao.attr('title', 'marcado')
                marcacao.removeAttr('aria-hidden')
                marcacao.appendTo(coluna)
            }

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