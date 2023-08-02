$(document).ready(function (){
    cardapio.eventos.init();
})

let cardapio = {};

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

    }
}

cardapio.templates = {

    item: `
        <div class="col-3 mb-5">
            <div class="card card-item">

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
                    <span class="btn-menos"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens">0</span>
                    <span class="btn-mais"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div> 
        </div>
    `

}