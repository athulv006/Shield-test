import { query } from '../config/db.js';

export const findUserByPhone = async (phoneNumber) => {
  const result = await query(
    'SELECT id, phone_number, name, created_at FROM users WHERE phone_number = $1',
    [phoneNumber]
  );
  return result.rows[0] || null;
};

export const createUser = async (phoneNumber, name = 'Badminton Player') => {
  const result = await query(
    'INSERT INTO users (phone_number, name) VALUES ($1, $2) RETURNING id, phone_number, name, created_at',
    [phoneNumber, name]
  );
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await query(
    'SELECT id, phone_number, name, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};
