import { ayzisAPI } from "@/libs/ayzisAPI";

// Soma da quantidade de vendas por mês
export const getSomaQuantidadeVendas = async () => {
    try {
        const response = await ayzisAPI.get("/estatisticas/soma-qtd");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Soma dos valores das vendas por mês
export const getSomaValoresVendas = async () => {
    try {
        const response = await ayzisAPI.get("/estatisticas/soma-valores");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Soma da quantidade de vendas por mês e produto (todos os produtos)
export const getSomaProdutosVendidos = async () => {
    try {
        const response = await ayzisAPI.get("/estatisticas/soma-qtd-produtos");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Soma da quantidade de vendas por mês para um produto específico
export const getSomaProdutoVendidosPorMes = async (produtoId) => {
    try {
        const response = await ayzisAPI.get("/estatisticas/soma-qtd-produtos", {
            params: { produtoId }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Soma dos valores das vendas por mês e produto
export const getSomaVendasPorProdutos = async () => {
    try {
        const response = await ayzisAPI.get("/estatisticas/soma-valores-produtos");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getSomaVendasPorProduto = async (produtoId) => {
    try {
        const response = await ayzisAPI.get("/estatisticas/soma-valores-produtos", {
            params: { produtoId }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};