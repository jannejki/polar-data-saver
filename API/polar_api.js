import { cardioLoadClient, nightlyRechargeClient } from './axiosInstance';
import dotenv from 'dotenv'

dotenv.config();

const polar_api = {
    getNightlyRecharge: async (token) => {
        const response = await nightlyRechargeClient.get('/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        response.data.recharges.forEach(element => {
            // changing element.polar_user from 'https://polaraccesslink.com/v3/users/12345678' to '12345678'

            element.polar_user = element.polar_user.split('/').pop();
        });
        console.log(`[${new Date().toLocaleString()}] Polar API:sta haettu tiedot.`)
        return response.data;
    },

    getCardioLoad: async (token) => {
        const response = await cardioLoadClient.get('/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        console.log(`[${new Date().toLocaleString()}] Polar API:sta haettu tiedot.`)
        return response.data;
    },
}

export default polar_api;