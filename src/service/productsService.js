'use server'
import { ayzisAPI } from "@/libs/ayzisAPI";

export const getPaginProducts = async (page, limit) => {
    try {
        const response = await ayzisAPI.get("/produtos",{
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getAllProducts = async () => {
    try {
        const response = await ayzisAPI.get("/produtos");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getProductById = async (id) => {
    try {
        const response = await ayzisAPI.get(`/produtos`, { params: { id } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getProductByName = async (nome) => {
    try {
        const response = await ayzisAPI.get(`/produtos`, { params: { nome } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const createProduct = async (data) => {
    try {
        const response = await ayzisAPI.post("/produtos", data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const updateProduct = async (data) => {
    try {
        const response = await ayzisAPI.patch(`/produtos`, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await ayzisAPI.delete(`/produtos/deletar`, { params: { id } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}