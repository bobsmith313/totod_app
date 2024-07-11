import axios, { AxiosError } from "axios";

export default axios.create({
    baseURL: "https://668fce96c0a7969efd99997a.mockapi.io/api/v1"
});

export const errorHandling = (err: AxiosError) => {
    if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
    }
    else {
        console.log(`Error: ${err.message}`);
    }
}