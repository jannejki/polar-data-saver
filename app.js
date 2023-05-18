import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

import polar_api from './API/polar_api';
import sendEmail from './Utils/emailer.js';
import nightlyRechargeController from './Controllers/nightlyRechargeController';
import cardioloadController from './Controllers/cardioloadController';
import jwt from 'jsonwebtoken';

(async () => {

    try {
        const token = await polar_api.oauthLogin();
        const decoded = await jwt.decode(token.value);

        const data = await polar_api.getNightlyRecharge(token.value);
        const savedNightlyRecharge = await nightlyRechargeController.saveNightlyRecharge(data);

        const cardioload = await polar_api.getCardioLoad(token.value);
        const savedCardioload = await cardioloadController.saveCardioload(cardioload, decoded.user);


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

    } catch (error) {
        await sendEmail({
            mail: `Tietokantaan tallennus epäonnistui klo: ${new Date().toLocaleString()}.\nVirhe: ${error}`
        });

        console.log(`[${new Date().toLocaleString()}] Tietokantaan tallennus epäonnistui.\nVirhe: ${error}`);
    } finally {
        process.exit();
    }

})();