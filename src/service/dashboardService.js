'use server';

import { ayzisAPI } from "@/libs/ayzisAPI";

export const getAllInfo = async () => {
    try {
        const response = await ayzisAPI.get('/infoMes');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getInfoByProduto = async (id) => {
    try {
        const response = await ayzisAPI.get(`/infoMes`, {
            params: {
                produto: id
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}