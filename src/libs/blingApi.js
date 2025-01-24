import axios, { Axios } from "axios";

export const blingApi = axios.create({
    baseURL: "https://bling.com.br/Api/v3",
})