import { getDepositoById } from "@/service/depositoService";
import { getEstoque, postEstoque } from "@/service/estoqueService";
import { getProductById, getProducts } from "@/service/productService";
import { getUser } from "@/service/userService";

const requestQueue = [];
let isProcessingQueue = false;

const processQueue = () => {
    if (requestQueue.length === 0) {
        isProcessingQueue = false;
        return;
    }

    isProcessingQueue = true;
    const { requestFn, resolve, reject } = requestQueue.shift();

    requestFn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
            setTimeout(processQueue, 333); // 333ms interval to ensure 3 requests per second
        });
};

const addToQueue = (requestFn) => {
    return new Promise((resolve, reject) => {
        requestQueue.push({ requestFn, resolve, reject });

        if (!isProcessingQueue) {
            processQueue();
        }
    });
};

export const getUserQ = (token) => {
    return addToQueue(() => getUser(token));
};

export const getProductsQ = (pagina, limite, token, sku) => {
    return addToQueue(() => getProducts(pagina, limite, token, sku));
}

export const getProductByIdQ = (id, token) => {
    return addToQueue(() => getProductById(id, token));
}

export const getEstoqueQ = (id, token) => {
    return addToQueue(() => getEstoque(id, token));
}

export const postEstoqueQ = (props, token) => {
    return addToQueue(() => postEstoque(props, token));
}

export const getDepositoByIdQ = (id, token) => {
    return addToQueue(() => getDepositoById(id, token));
}
