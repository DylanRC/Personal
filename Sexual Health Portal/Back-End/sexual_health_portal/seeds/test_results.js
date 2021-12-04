
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('TestResults').del()
    .then(function () {
      // Inserts seed entries
      return knex('TestResults').insert([
        {
          id: 0,
          user_id: 0,
          result: "You are A-OK mate"
        },
      ]);
    });
};
