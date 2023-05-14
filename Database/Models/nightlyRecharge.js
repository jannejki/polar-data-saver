import knex from "../knex";

const nightlyRecharge = {
    get: async (params) => {
        return await knex('NIGHTLY_RECHARGES').where(params);
    },

    save: async (params) => {
        try {

            const id = await knex('NIGHTLY_RECHARGES').insert(params);
            return await nightlyRecharge.get({ ID: id[0] });
        }catch(error) {
            return false;
        }
    },

}

export default nightlyRecharge;