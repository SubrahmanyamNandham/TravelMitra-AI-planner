exports.up = async function (knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  const hasUsers = await knex.schema.hasTable('users');
  if (!hasUsers) {
    await knex.schema.createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('email', 255).notNullable().unique();
      table.text('password_hash').notNullable();
      table.string('full_name', 100).notNullable();
      table.string('role', 20).notNullable().defaultTo('user');
      table.boolean('is_verified').notNullable().defaultTo(false);
      table.boolean('is_active').notNullable().defaultTo(true);
      table.timestamp('last_login_at', { useTz: true }).nullable();
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    });
  }

  const hasRefreshTokens = await knex.schema.hasTable('refresh_tokens');
  if (!hasRefreshTokens) {
    await knex.schema.createTable('refresh_tokens', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').notNullable();
      table.text('token_hash').notNullable().unique();
      table.timestamp('expires_at', { useTz: true }).notNullable();
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
      table.timestamp('revoked_at', { useTz: true }).nullable();

      table.foreign('user_id').references('users.id').onDelete('CASCADE');
    });
  }

  const hasTrips = await knex.schema.hasTable('trips');
  if (!hasTrips) {
    await knex.schema.createTable('trips', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').notNullable();
      table.string('title', 200).notNullable();
      table.string('destination', 200).notNullable();
      table.string('country', 100).nullable();
      table.timestamp('start_date', { useTz: true }).nullable();
      table.timestamp('end_date', { useTz: true }).nullable();
      table.decimal('budget', 10, 2).nullable();
      table.string('currency', 3).notNullable().defaultTo('USD');
      table.specificType('interests', 'text[]').notNullable().defaultTo('{}');
      table.jsonb('itinerary').nullable();
      table.text('cover_image').nullable();
      table.string('status', 20).notNullable().defaultTo('draft');
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

      table.foreign('user_id').references('users.id').onDelete('CASCADE');
    });
  }

  const hasChatMessages = await knex.schema.hasTable('chat_messages');
  if (!hasChatMessages) {
    await knex.schema.createTable('chat_messages', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').notNullable();
      table.string('role', 20).notNullable();
      table.text('content').notNullable();
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

      table.foreign('user_id').references('users.id').onDelete('CASCADE');
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('chat_messages');
  await knex.schema.dropTableIfExists('trips');
  await knex.schema.dropTableIfExists('refresh_tokens');
  await knex.schema.dropTableIfExists('users');
};
