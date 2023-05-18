import knex from "../knex";

const cardioloadModel = {
    get: async (params) => {
        try {
            const data = await knex('CARDIO_LOAD').where(params);
            return data;
        } catch (error) {
            console.log(error);
        }
    },

    save: async (data) => {
        try {
            const savedData = await knex('CARDIO_LOAD').insert(data);
            return await cardioloadModel.get({ ID: savedData[0] });
        } catch (error) {
           return false;
        }
    }
}


export default cardioloadModel;