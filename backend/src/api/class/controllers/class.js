// path: src/api/classes/controllers/classes.js

module.exports = {
    async findCustom(ctx) {
      const { subject, days } = ctx.query;
  
      // Validate input
      if (!subject || !days) {
        return ctx.badRequest("Subject and days filter are required.");
      }
  
      // Parse the days filter (e.g., { "monday": true, "wednesday": true, "friday": true })
      const daysFilter = JSON.parse(days);
  
      // Build the SQL query
      const query = `
        SELECT c.*
        FROM classes c
        JOIN schedules s ON c.id = s.class_id
        WHERE c.subject = $1
        AND s.days @> $2
      `;
  
      // Execute the query
      const result = await strapi.db.connection.raw(query, [subject, daysFilter]);
  
      // Return the result
      ctx.send(result.rows);
    },
  };