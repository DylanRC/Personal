
exports.up = function (knex) {
    return knex.schema.table('Appointments', table => {
        table.string('status', 128);
    })
};

exports.down = function (knex) {
    return knex.schema.alterTable('Appointments', table => {
        table.dropColumn('status');
    })
};
