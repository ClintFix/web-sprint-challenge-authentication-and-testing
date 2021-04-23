const db = require('../../data/dbConfig');

function findById(id) {
    return db("users as u")
        .where('u.id', id)
        .first();
}

async function add(user) {
    const [id] = await db('users').insert(user);
    return findById(id);
}

module.exports = {
    findById,
    add
};
