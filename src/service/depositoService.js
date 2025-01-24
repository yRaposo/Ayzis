'use server';
import { blingApi } from "@/libs/blingApi";

export async function getDepositos(token) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }

    try { 
        const response = await blingApi.get('/depositos', { headers })
        return response.data;
    } catch (error) {
        console.error('Erro ao obter dados do estoque',error);
        throw error;
    }
}

export async function getDepositoById(id, token) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }

    try {
        const response = await blingApi.get(`/depositos/${id}`, { headers })
        return response.data;
    } catch (error) {
        console.error('Erro ao obter dados do estoque',error);
        throw error;
    }
}