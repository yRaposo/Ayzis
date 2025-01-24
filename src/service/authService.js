'use server'
import { blingApi } from "@/libs/blingApi"
import { encodeBase64 } from "@/utils/base64encoder"

export async function getAccessToken(code) {

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '1.0',
        'Authorization': `Basic ${encodeBase64(`${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`)
            }`,
    }
    const body = {
        'grant_type': 'authorization_code',
        'code': code,
    }

    try {
        const response = await blingApi.post('/oauth/token', body, { headers })
        return response.data;
    } catch (error) {
        console.error('Erro ao obter o token de acesso', error);
        throw error;
    }
}