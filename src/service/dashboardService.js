'use server';

import { getAllProducts, getPaginProducts } from "./productsService";
import { getVendasByProdutoMes } from "./vendasService";

export default function dashboardService() {
    const products = getAllProducts();

    for (const product in products) {
        const vendas = getVendasByProdutoMes(product.sku, new Date().getMonth() );
    }
}