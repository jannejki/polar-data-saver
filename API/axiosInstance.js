import axios from "axios";
import axiosRetry from "axios-retry";
import https from 'https'
import dotenv from 'dotenv'

dotenv.config();
const apiRoute = process.env.API_ROUTE;

//=====================================================//
//  nightly recharge client
//=====================================================//
// defining the axios client for the nightlyRechargeAPI service
const nightlyRechargeClient = axios.create({
    baseURL: `${apiRoute}/nightlyRecharge`,
})

nightlyRechargeClient.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false,
})

axiosRetry(nightlyRechargeClient, {
    retries: 3, // number of retries
    retryDelay: (retryCount) => {
        console.log(`Retry attempt: ${retryCount}`)

        // waiting 2 seconds between each retry
        return 2000
    },
    retryCondition: (error) => {
        // retrying only on 503 HTTP errors
        console.log(error);
        return error.response.status === 503
    },
})

export { nightlyRechargeClient }