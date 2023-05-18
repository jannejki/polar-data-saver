import { cardioLoadClient, nightlyRechargeClient } from './axiosInstance';
import puppeteer from 'puppeteer-core';
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

        /*
        response.data.recharges.forEach(element => {
            // changing element.polar_user from 'https://polaraccesslink.com/v3/users/12345678' to '12345678'

            element.polar_user = element.polar_user.split('/').pop();
        });*/
        
        console.log(`[${new Date().toLocaleString()}] Polar API:sta haettu tiedot.`)
        return response.data;
    },


    oauthLogin: async () => {
        try {
            const browser = await puppeteer.launch({
                executablePath: process.env.CHROME_PATH,
                headless: true,
                IgnoreHTTPSErrors: true
            });
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1280 });

            await page.goto(process.env.POLAR_AUTH_LINK);

            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
            // Set screen size
            await page.setViewport({ width: 1080, height: 1024 });


            await page.waitForSelector('#login');
            await page.waitForSelector('#email');
            await page.waitForSelector('#password');

            // handling the cookie popup
            await page.waitForSelector('#onetrust-accept-btn-handler');
            await page.click('#onetrust-accept-btn-handler');


            await page.type('#email', process.env.POLAR_EMAIL);
            await page.type('#password', process.env.POLAR_PASSWORD);
            await page.click('#login');


            await page.waitForNetworkIdle(5000);

            const client = await page.target().createCDPSession();
            let cookies = (await client.send('Network.getAllCookies')).cookies;
            const token = cookies.find(cookie => cookie.name === 'token');

            console.log(`[${new Date().toLocaleString()}] Kirjauduttu Polar API:in.`)
            return token;


        } catch (error) {
            console.log(error);
        }
    }
}

export default polar_api;