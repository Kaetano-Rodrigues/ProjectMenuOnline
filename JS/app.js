$(document).ready(function (){
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];

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

    mensagem: (texto, cor = 'red', tempo = 3500) =>{

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);
        
        setTimeout(() =>{
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            $("#msg-" + id).remove();
        }, tempo)
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
    `

}