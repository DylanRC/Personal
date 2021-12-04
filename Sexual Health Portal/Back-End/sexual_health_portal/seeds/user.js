
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('User').del()
    .then(function () {
      // Inserts seed entries
      return knex('User').insert([
        {
          id: 1,
          full_name: 'Test User',
          password_hash: 'idk',
          admin: '0',
          remote_id: '0'
        },
      ]);
    });
};
