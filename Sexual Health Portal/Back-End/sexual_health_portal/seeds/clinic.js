
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Clinic').del()
    .then(function () {
      // Inserts seed entries
      return knex('Clinic').insert([
        {
          id: "0",
          name: "Test Clinic",
          ph_number: "02738467"
        },
      ]);
    });
};
