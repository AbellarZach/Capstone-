const pool = require("../database/db");

function mapResident(row) {
  if (!row) return null;
  return {
    id: row.resident_id,
    dbId: row.id,
    fullName: row.full_name,
    birthdate: row.birthdate?.toISOString?.().slice(0, 10) ?? row.birthdate,
    age: row.age,
    gender: row.gender,
    civilStatus: row.civil_status,
    address: row.address,
    contactNumber: row.contact_number,
    email: row.email ?? "",
    householdNumber: row.household_number ?? "",
    emergencyContact: row.emergency_contact ?? "",
    dateRegistered: row.created_at?.toISOString?.().slice(0, 10) ?? row.created_at,
  };
}

async function findAll() {
  const { rows } = await pool.query(
    "SELECT * FROM residents ORDER BY created_at DESC"
  );
  return rows.map(mapResident);
}

async function findById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM residents WHERE id = $1 OR resident_id = $1",
    [id]
  );
  return mapResident(rows[0]);
}

async function create(data) {
  const residentId = await generateResidentId();
  const birthdate = data.birthdate || null;
  const age = birthdate
    ? Math.floor((Date.now() - new Date(birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : data.age ?? null;

  const { rows } = await pool.query(
    `INSERT INTO residents (resident_id, full_name, birthdate, age, gender, civil_status, address, contact_number, email, household_number, emergency_contact)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [
      residentId,
      data.fullName,
      birthdate,
      age,
      data.gender,
      data.civilStatus,
      data.address,
      data.contactNumber,
      data.email ?? "",
      data.householdNumber ?? "",
      data.emergencyContact ?? "",
    ]
  );
  return mapResident(rows[0]);
}

async function update(id, data) {
  const birthdate = data.birthdate || null;
  const age = birthdate
    ? Math.floor((Date.now() - new Date(birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : data.age ?? null;

  const { rows } = await pool.query(
    `UPDATE residents SET
      full_name = COALESCE($2, full_name),
      birthdate = COALESCE($3, birthdate),
      age = COALESCE($4, age),
      gender = COALESCE($5, gender),
      civil_status = COALESCE($6, civil_status),
      address = COALESCE($7, address),
      contact_number = COALESCE($8, contact_number),
      email = COALESCE($9, email),
      household_number = COALESCE($10, household_number),
      emergency_contact = COALESCE($11, emergency_contact)
     WHERE id = $1 OR resident_id = $1 RETURNING *`,
    [
      id,
      data.fullName,
      birthdate,
      age,
      data.gender,
      data.civilStatus,
      data.address,
      data.contactNumber,
      data.email,
      data.householdNumber,
      data.emergencyContact,
    ]
  );
  return mapResident(rows[0]);
}

async function remove(id) {
  const { rowCount } = await pool.query(
    "DELETE FROM residents WHERE id = $1 OR resident_id = $1",
    [id]
  );
  return rowCount > 0;
}

async function generateResidentId() {
  const { rows } = await pool.query(
    "SELECT COUNT(*)::int + 1 AS next FROM residents"
  );
  return `R-${String(rows[0].next).padStart(3, "0")}`;
}

module.exports = { findAll, findById, create, update, remove };
