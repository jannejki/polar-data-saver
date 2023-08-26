import knex from "../knex";

const breathingSample = {
    get: async (params) => {
        return await knex('BREATHING_SAMPLES').where(params);
    },

    save: async (params) => {
        const saved = await knex('BREATHING_SAMPLES').insert(params);
       return await breathingSample.get({ ID: saved[0] });
    },

}

export default breathingSample;