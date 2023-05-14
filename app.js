import dotenv from 'dotenv';
import polar_api from './API/polar_api';
import nightlyRecharge from './Database/Models/nightlyRecharge';
import hrvSample from './Database/Models/hrvSample';
import breathingSample from './Database/Models/breathingSample';
import sendEmail from './Utils/emailer.js';

dotenv.config();

(async () => {

    try {
        const token = await polar_api.oauthLogin();
        const data = await polar_api.get(token.value);

        const newData = [];
        for (let recharge of data.recharges) {
            // because hrv_samples and breathing_samples are saved to another table, we need to create new object without them
            const { hrv_samples, breathing_samples, ...rechargeData } = recharge;

            const saved = await nightlyRecharge.save(rechargeData);
            if (!saved) continue;

            const date = saved[0].date;

            // for saving the hrv_samples, we need to separate key and value from the object
            Object.entries(hrv_samples).forEach(async ([key, value]) => {

                // saving the hrv_samples to the database
                await hrvSample.save({
                    NIGHTLY_RECHARGE_DATE: date,
                    TIMESTAMP: key,
                    VALUE: value
                });

            });

            // same thing with breathing_samples
            Object.entries(breathing_samples).forEach(async ([key, value]) => {
                await breathingSample.save({
                    NIGHTLY_RECHARGE_DATE: date,
                    TIMESTAMP: key,
                    VALUE: value
                });
            });

            newData.push(rechargeData);
        }

        if (newData.length === 0) {
            await sendEmail({
                mail: 'Tietokantaan ei tallennettu uusia öitä.'
            });
            console.log(`[${new Date().toLocaleString()}] Tietokantaan ei tallennettu uusia öitä. ${new Date().toLocaleString()}`)

        } else {
            await sendEmail({
                mail: `Tietokantaan tallennettu seuraavien öiden tiedot:\n\n${newData.map((recharge) => recharge.date).join('\n')}.`
            });
            console.log(`[${new Date().toLocaleString()}] Tietokantaan tallennettu seuraavien öiden tiedot: ${newData.map((recharge) => recharge.date).join(', ')}.`);
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