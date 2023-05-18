import knex from "../knex";

const nightlyRechargeModel = {
    getFromDB: async (params) => {
        return await knex('NIGHTLY_RECHARGES').where(params);
    },

    save: async (params) => {
        try {
            const id = await knex('NIGHTLY_RECHARGES').insert(params);
            return (await nightlyRechargeModel.getFromDB({ ID: id[0] }));
        }catch(error) {
            return false;
        }
    },

}

export default nightlyRechargeModel;