
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Appointments').del()
    .then(function () {
      // Inserts seed entries
      return knex('Appointments').insert([
        {
          id: 1,
          user_id: "0",
          datetime: "2021-11-11 13:23:44",
          doctor: "Dr Dolittle",
          clinic_id: "0"
        },
      ]);
    });
};
