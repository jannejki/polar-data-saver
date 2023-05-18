import breathingSample from "../Database/Models/breathingSampleModel";
import hrvSample from "../Database/Models/hrvSampleModel";
import nightlyRechargeModel from "../Database/Models/nightlyRechargeModel";

const nightlyRechargeController = {
    getNightlyRecharge: async (req, res) => {
        try {
            const data = await nightlyRechargeModel.getNightlyRecharge();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    saveNightlyRecharge: async (data) => {
        const newData = [];
        for (let recharge of data.recharges) {
            // because hrv_samples and breathing_samples are saved to another table, we need to create new object without them
            const { hrv_samples, breathing_samples, ...rechargeData } = recharge;

            const saved = await nightlyRechargeModel.save(rechargeData);
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
        return newData;
    }
}

export default nightlyRechargeController;