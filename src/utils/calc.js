export const calculator = (vendas) => {
    let individual = 0;
    let componente = 0;
    
    vendas.forEach(venda => {
        if (venda.produto.produtosComposicao) {
            venda.produto.produtosComposicao
                .forEach(produto => {
                    componente += produto.quantidade * venda.quantidade;
                });
        } else {
            individual += venda.quantidade;
        }
    });

    return { individual, componente };

}