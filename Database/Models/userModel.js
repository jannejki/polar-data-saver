import knex from "../knex";


const userModel = {
    get:  async (params = {}) => {
        return await knex('USERS').where(params);
    },

    save: async (params) => {
        const id =  await knex('USERS').insert(params);
        return await userModel.get({id: id[0]});
    },

    getSettings: async(params = {}) => {
        return await knex('USER_SETTINGS').where(params);
    }
}

export default userModel;