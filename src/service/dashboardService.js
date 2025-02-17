'use server';

import { ayzisAPI } from "@/libs/ayzisAPI";

export const getAllInfo = async () => {
    return await ayzisAPI.get('/');
}