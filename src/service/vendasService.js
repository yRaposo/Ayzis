'use server'
import { ayzisAPI } from "@/libs/ayzisAPI";

export const getAllVendas = async () => {
    try {
        const response = await ayzisAPI.get("/vendas");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getVendaById = async (id) => {
    try {
        const response = await ayzisAPI.get("/vendas", { params: { id } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getVendaByData = async (data) => {
    try {
        const response = await ayzisAPI.get("/vendas", { params: { data } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getVendaByMes = async (mes) => {
    try {
        const response = await ayzisAPI.get("/vendas", { params: { mes } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getVendasByProduto = async (sku) => {
    try {
        const response = await ayzisAPI.get("/vendas", { params: { sku } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getVendasByProdutoMes = async (sku, mes) => {
    try {
        const response = await ayzisAPI.get("/vendas", { params: { sku, mes } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getVendaByStatus = async (status) => {
    try {
        const response = await ayzisAPI.get("/vendas", { params: { status } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const createVenda = async (data) => {
    try {
        const response = await ayzisAPI.post("/vendas", data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const updateVenda = async (data) => {
    try {
        const response = await ayzisAPI.patch("/vendas", data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const deleteVenda = async (id) => {
    try {
        const response = await ayzisAPI.delete("/vendas", { params: { id } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}