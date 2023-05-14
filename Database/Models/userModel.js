import knex from "../knex";


const userModel = {
    get:  async (params = {}) => {
        return await knex('USERS').where(params);
    },

    save: async (params) => {
        const id =  await knex('USERS').insert(params);
        return await userModel.get({id: id[0]});
    },
}

export default userModel;