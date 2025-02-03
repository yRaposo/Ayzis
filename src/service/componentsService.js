'use server'
import { ayzisAPI } from "@/libs/ayzisAPI";

export const getComponent = async (id) => {
    try {
        const response = await ayzisAPI.get(`/componentes`, { params: { id } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getComponentByProduct = async (produtoComposto) => {
    try {
        const response = await ayzisAPI.get(`/componentes`, { params: { produtoComposto } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const patchComponent = async (id, produtoComposto, produtoComponente, quantidade) => {
    try {
        const response = await ayzisAPI.patch(`/componentes`, null, {
            params: { id, produtoComposto, produtoComponente, quantidade }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const postComponent = async (produtoComposto, produtoComponente, quantidade) => {
    try {
        const response = await ayzisAPI.post(`/componentes`, null, {
            params: { produtoComposto, produtoComponente, quantidade }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const deleteComponent = async (id) => {
    try {
        const response = await ayzisAPI.delete(`/componentes`, { params: { id } });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}