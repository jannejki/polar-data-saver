import cardioloadModel from "../Database/Models/cardioLoadModel";

const cardioloadController = {
    saveCardioload: async (data, user) => {
        const newData = [];
        
        try {
            // setting cardio load level data to the same level as the other data so it can be saved to the same table
            for (let day of data) {
                day.cardio_load_level_very_low = day.cardio_load_level.very_low;
                day.cardio_load_level_low = day.cardio_load_level.low;
                day.cardio_load_level_medium = day.cardio_load_level.medium;
                day.cardio_load_level_high = day.cardio_load_level.high;
                day.cardio_load_level_very_high = day.cardio_load_level.very_high;
                day.polar_user_id = user || null;

                delete day.cardio_load_level;
                const saved = await cardioloadModel.save(day);
                if (!saved) continue;

                newData.push(saved[0]);
            }

            return newData;

        } catch (error) {
            console.log(error);
        }
    }
}

export default cardioloadController;