
exports.up = function(knex) {
    return knex.schema.table('User', table => {
        table.string('email', 128);
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('User', table => {
        table.dropColumn('email');
    })
};
