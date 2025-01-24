'use server';
import { blingApi } from "@/libs/blingApi";

export async function getUser(token) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }

    try {
        const response = await blingApi.get('/empresas/me/dados-basicos', { headers })
        return response.data;
    } catch (error) {
        console.error('Erro ao obter dados de usuario',error);
        throw error;
    }
}