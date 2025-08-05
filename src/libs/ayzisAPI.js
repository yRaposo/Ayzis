import axios from "axios";

export const ayzisAPI = axios.create({
    baseURL: "http://localhost:8080/api/v1",
});