$(document).ready(function (){
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;


var VALOR_CARRINHO =0;
var VALOR_ENTREGA = 5;

cardapio.eventos ={

    init: () =>{
        cardapio.metodos.obterItensCardapio();
    }

}

cardapio.metodos = {
    // obtem a lista de itens do cardapio
    obterItensCardapio: ( categoria = 'burgers', vermais = false) =>{
        var filter = MENU[categoria];
        console.log(filter);

        if(!vermais){
            $("#itemCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
        }
      

        $.each(filter, (i, e) => {
            
            let temp = cardapio.templates.item.replace(/\${img}/g,e.img)
            .replace(/\${nome}/g,e.name)
            .replace(/\${preco}/g,e.price.toFixed(2).replace('.',','))
            .replace(/\${id}/g,e.id)

            // btn ver mais click
            if(vermais && i >= 8 && i < 12){
                $("#itemCardapio").append(temp)
            }

            // paginacao inicial(8 itens)
           if(!vermais && i < 8){
                $("#itemCardapio").append(temp)
           }

        })

        //remove o botao ativo
        $(".container-menu a").removeClass('active');

        // seta o menu para ativo
        $("#menu-"+ categoria).addClass('active');
    },

    // click botao vermais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo,true);
        $("#btnVerMais").addClass('hidden');

    },

    // diminuir quantidade de itens no cardapio
    diminuirQuantidade: (id) =>{
        
        let qntdAtual = parseInt($("#qntd-"+ id).text());

        if(qntdAtual > 0){
            $("#qntd-"+ id).text(qntdAtual - 1)
        }

    },

    //aumentar quantidade de itens no cardapio
    aumentarQuantidade: (id) =>{
        let qntdAtual = parseInt($("#qntd-"+ id).text());
        $("#qntd-"+ id).text(qntdAtual + 1)
    },

    // add ao carrinho o item do cardapio
    adicionarAoCarrinho: (id) =>{
        let qntdAtual = parseInt($("#qntd-"+ id).text());

        if(qntdAtual > 0){

            // obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //obter lista de itens
            let filter = MENU[categoria];

            //obter o item
            let item = $.grep(filter,(e, i) => {return e.id == id });

            if(item.length > 0){

                //validar se existe o item no carrinho
                let existe = $.grep(MEU_CARRINHO,(elem, index) => {return elem.id == id });

                // caso ja exista altera qtd
                if (existe.length > 0){
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }

                // caso nao exista add o item
                else{
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }

                cardapio.metodos.mensagem('Item adicionado ao carrinho','green');
                $("#qntd-"+ id).text(0);

                cardapio.metodos.atualizarBadgeTotal();

            }
        }
    },

    // atualiza badge de totais dos botoes " Meu carrinho"
    atualizarBadgeTotal: () =>{
        var total = 0;
        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if(total > 0){
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else{
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden');
        }

        $('.badge-total-carrinho').html(total)
    },

    abrirCarrinho: (abrir) =>{  


        if (abrir){
            $("#modal-carrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        }
        else{
            $("#modal-carrinho").addClass('hidden');
        }
            

    },

    // altera os textos e exibe os botoes das etapas
    carregarEtapa: (etapa) =>{
        
        if (etapa == 1){
            $("#lblTituloEtapa").text('Seu Carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnEtapaVoltar").addClass('hidden');

        }

        if (etapa == 2){
            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnEtapaVoltar").removeClass('hidden');
        }
        
        if (etapa == 3){
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnEtapaVoltar").removeClass('hidden');
        }
    },

    // btn voltar etapa
    voltarEtapa: () =>{
        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);
    },

    // carrega lista de itens carrinho
    carregarCarrinho: () =>{
        cardapio.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) =>{
               
                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g,e.img)
                .replace(/\${nome}/g,e.name)
                .replace(/\${preco}/g,e.price.toFixed(2).replace('.',','))
                .replace(/\${id}/g,e.id)
                .replace(/\${qntd}/g,e.qntd)
                

                $("#itensCarrinho").append(temp);

                if ((i + 1) == MEU_CARRINHO.length){
                    cardapio.metodos.carregarValores();
                }
            })

        }
        else {
          $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho esta vazio.</p>');
          cardapio.metodos.carregarValores();
        }
    },

   diminuirQuantidadeCarrinho: (id) =>{       
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if(qntdAtual > 1){
            $("#qntd-carrinho-" + id).text(qntdAtual - 1)
            cardapio.metodos.autualizarCarrinho(id, qntdAtual - 1)
        }
        else{
         cardapio.metodos.removerItemCarrinho(id)
        }
   },

    aumentarQuantidadeCarrinho: (id) =>{
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        $("#qntd-carrinho-" + id).text(qntdAtual + 1);

        cardapio.metodos.autualizarCarrinho(id, qntdAtual + 1);
    },

    removerItemCarrinho: (id) => {
        MEU_CARRINHO = $.grep(MEU_CARRINHO,(e, i) => { return e.id != id });
        cardapio.metodos.carregarCarrinho();
        cardapio.metodos.atualizarBadgeTotal();

    },

    autualizarCarrinho: (id, qntd) =>{
      
        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;
        
        cardapio.metodos.atualizarBadgeTotal();

        cardapio.metodos.carregarValores();
    },

    // carrega valores do carrinho, entrega
    carregarValores: () =>{
        VALOR_CARRINHO =0;

        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) =>{

            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if ((i + 1) == MEU_CARRINHO.length){
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.',',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.',',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}`); 
            }
        })
    },

    //carregar a etapa de enderecos
    carregarEndereco: () =>{

        if (MEU_CARRINHO.length <= 0){
            cardapio.metodos.mensagem('Seu carrinho esta vazio. ')
            return;
        }

        cardapio.metodos.carregarEtapa(2);

    },

    //API ViaCEP
    buscaCep: () =>{

        // cria var cep
        var cep = $("#txtCEP").val().trim().replace(/\D/g,'');

        //valida se o cep possui valor
        if (cep != ""){

            //expressao regular REGEX para validar CEP
            var validacep = /^[0-9]{8}$/;

            if(validacep.test(cep)){

                $.getJSON("https://viacep.com.br/ws/" + cep +"/json/?callback=?", function (dados){

                    if(!("erro" in dados)){
                        //atualiza campos com os valores do VIACEP
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#txtNumero").focus();
                    }
                    else{
                        cardapio.metodos.mensagem('CEP nao encontrado. Preencha as informacoes manualmente. ');
                        $("#txtEndereco").focus();
                    }

                })

            }
            else{
                cardapio.metodos.mensagem('Formato do CEP invalido.');
                $("#txtCEP").focus();
            }

        }
        else {
            cardapio.metodos.mensagem('Informe o CEP, por favor. ');
            $("#txtCEO").focus();
        }

    },

    //validacao dos campos antes da etapa 3
    resumoPedido: () => {
        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("ddlUf").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if(cep.length <= 0){
            cardapio.metodos.mensagem('Informe o CEP, por favor. ');
            $("#txtCEp").focus();
            return;
        }

        if(endereco.length <= 0){
            cardapio.metodos.mensagem('informe o Endereco, por favor. ');
            $("#txtEndereco").focus();
            return;
        }

        if(bairro.length <= 0){
            cardapio.metodos.mensagem('Informe o Bairro, por favor. ');
            $("#txtBairro").focus();
            return;
        }

        if(cidade.length <= 0){
            cardapio.metodos.mensagem('Informe a Cidade, por favor. ');
            $("#txtCidade").focus();
            return;
        }

        if(uf == "-1"){
            cardapio.metodos.mensagem('Informe a UF, por favor. ');
            $("#ddlUf").focus();
            return;
        }

        if(numero.length <= 0){
            cardapio.metodos.mensagem('Informe o Numero, por favor. ');
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            nuemro: numero,
            complemento: complemento
        }

        cardapio.metodos.carregarEtapa(3);
    },


    //mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) =>{

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);
        
        setTimeout(() =>{
            $('#msg-' + id).removeClass('fadeInDown');
            $('#msg-' + id).addClass('fadeOutUp');
            setTimeout(() => {
                $('#msg-' + id).remove();
            }, 800);
        },tempo)
       
    }
}

cardapio.templates = {

    item: `
        <div class="col-3 mb-5">
            <div class="card card-item" id="\${id}">

                    <div class="img-produto">
                        <img src="\${img}"/>
                    </div>

                    <p class="title-produto text-center mt-3">
                        <b>\${nome}</b>
                    </p>

                    <p class="price-produto text-center">
                    <b>R$ \${preco}</b>
                    </p>

                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div> 
        </div>
    `,


    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}"/>
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${nome}</b></p>
                <p class="price-produto"><b>R$ \${preco}</b></p>
            </div>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
            </div>
        </div>
    `

}