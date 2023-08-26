import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

import polar_api from './API/polar_api';
import initAxios from './API/axiosInstance';

import nightlyRechargeController from './Controllers/nightlyRechargeController';
import cardioloadController from './Controllers/cardioloadController';
import initEmailer, { sendEmail } from './Utils/emailer.js';
import userModel from './Database/Models/userModel';
(async () => {

    initAxios();
    initEmailer();
    try {
        const userSettings = await userModel.getSettings({ AUTOSAVE: true });

        for (let user of userSettings) {
            const userInfo = await userModel.get({ ID: user.USER_ID });
            if (userInfo[0].access_token == '') continue;

            const data = await polar_api.getNightlyRecharge(userInfo[0].access_token);
            const savedNightlyRecharge = await nightlyRechargeController.saveNightlyRecharge(data);

            const cardioload = await polar_api.getCardioLoad(userInfo[0].access_token);
            const savedCardioload = await cardioloadController.saveCardioload(cardioload, userInfo[0]['polar-user-id']);

            if (savedNightlyRecharge.length === 0 && savedCardioload.length === 0) {
                await sendEmail({
                    mail: 'Tietokantaan ei tallennettu uusia tietoja.'
                });
                console.log(`[${new Date().toLocaleString()}] Tietokantaan ei tallennettu uusia tietoja.`)

            } else {
                await sendEmail({
                    mail: `Tietokantaan tallennettu seuraavien 
                         öiden Nightly Recharge tiedot:\n\n${savedNightlyRecharge.length > 0 ? savedNightlyRecharge.map((recharge) => recharge.date).join('\n') : ''} 
                         \n\nSekä seuraavat cardio load päivät: \n\n${savedCardioload.length > 0 ? savedCardioload.map((e) => e.date).join('\n') : ''}.`
                });

                console.log(`[${new Date().toLocaleString()}]  Tietokantaan tallennettu seuraavien öiden Nightly Recharge tiedot:\n\n${savedNightlyRecharge.map((recharge) => recharge.date).join('\n')} \n\nSekä seuraavat cardio load päivät: \n\n${savedCardioload.map((e) => e.date).join('\n')}.`);
            }
        }

    } catch (error) {
        await sendEmail({
            mail: `Tietokantaan tallennus epäonnistui klo: ${new Date().toLocaleString()}.\nVirhe: ${error}`
        });

        console.log(`[${new Date().toLocaleString()}] Tietokantaan tallennus epäonnistui.\nVirhe: ${error}`);
    } finally {
        process.exit();
    }
})();