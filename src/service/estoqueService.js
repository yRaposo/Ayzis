'use server'
import { blingApi } from "@/libs/blingApi";

export async function getEstoque(id, token) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }

    const params = {
        'idsProdutos[]': [id],
    }

    try {
        const response = await blingApi.get('/estoques/saldos', { headers, params })
        return response.data;
    } catch (error) {
        console.error('Erro ao obter estoque', error);
        throw error;
    }
}

export async function postEstoque(props, token) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }

    const data = props;

    try {
        console.log('Enviando dados:', data);
        console.log('data', props);
        console.log('Token:', token);
        const response = await blingApi.post('/estoques', data, { headers })
        console.log('response', response.data);
        return response.data;
    } catch (error) {
        console.log('Enviando dados:', data);
        console.log('data', props);
        console.log('Token:', token);
        console.error('Erro ao atualizar o estoque', error.response);
        console.error('Erro ao atualizar o estoque', error);
        throw error;
    }
}