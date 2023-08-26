import knex from "../knex";

const hrvSample = {
    get: async (params) => {
        return await knex('HRV_SAMPLES').where(params);
    },

    save: async (params) => {
        const saved = await knex('HRV_SAMPLES').insert(params);
        return await hrvSample.get({ ID: saved[0] });
    },

}

export default hrvSample;