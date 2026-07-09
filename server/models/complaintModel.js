const pool = require("../database/db");

function normalizeStatus(status) {
  const legacy = {
    "Forwarded to Court": "Unsettled",
    Rejected: "Cancelled",
  };
  return legacy[status] || status;
}

function normalizePriority(priority) {
  return priority === "Low" ? "Normal" : priority;
}

function mapComplaint(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    complaintNo: row.complaint_no,
    dateFiled: row.date_filed?.toISOString?.().slice(0, 10) ?? row.date_filed,
    complainant: row.complainant_name,
    complainantInfo: {
      name: row.complainant_name,
      age: row.complainant_age ?? 0,
      address: row.complainant_address ?? "",
      contact: row.complainant_contact ?? "",
      email: row.complainant_email ?? "",
    },
    respondent: row.respondent_name,
    respondentInfo: {
      name: row.respondent_name,
      age: row.respondent_age ?? 0,
      address: row.respondent_address ?? "",
      contact: row.respondent_contact ?? "",
    },
    category: row.category,
    priority: normalizePriority(row.priority),
    status: normalizeStatus(row.status),
    description: row.description ?? "",
    evidence: row.evidence ?? [],
    summonNo: row.summon_no,
    hearingDate: row.hearing_date?.toISOString?.().slice(0, 10) ?? row.hearing_date,
    hearingTime: row.hearing_time,
    venue: row.venue,
    mediationNotes: row.mediation_notes,
    previousHearingNotes: row.previous_notes,
    witnesses: row.witnesses,
    createdAt: row.created_at,
  };
}

const complaintSelect = `
  SELECT c.*,
    s.summon_no, s.hearing_date, s.hearing_time, s.venue,
    (SELECT mediation_notes FROM hearings h WHERE h.complaint_id = c.id ORDER BY h.hearing_number DESC LIMIT 1) AS mediation_notes,
    (SELECT previous_notes FROM hearings h WHERE h.complaint_id = c.id ORDER BY h.hearing_number DESC LIMIT 1) AS previous_notes,
    (SELECT witnesses FROM hearings h WHERE h.complaint_id = c.id ORDER BY h.hearing_number DESC LIMIT 1) AS witnesses
  FROM complaints c
  LEFT JOIN summons s ON s.complaint_id = c.id
`;

async function findAll() {
  const { rows } = await pool.query(
    `${complaintSelect}
     ORDER BY
       CASE COALESCE(c.priority, 'Normal')
         WHEN 'High' THEN 1
         WHEN 'Medium' THEN 2
         WHEN 'Low' THEN 3
         WHEN 'Normal' THEN 3
         ELSE 4
       END ASC,
       c.created_at DESC`
  );
  return rows.map(mapComplaint);
}

async function findRecent(limit = 10) {
  const { rows } = await pool.query(
    `${complaintSelect} ORDER BY c.created_at DESC LIMIT $1`,
    [limit]
  );
  return rows.map(mapComplaint);
}

async function findById(id) {
  const { rows } = await pool.query(`${complaintSelect} WHERE c.id = $1`, [id]);
  return mapComplaint(rows[0]);
}

async function updateStatus(id, status) {
  const resolvedAt = status === "Resolved" ? new Date() : null;
  const { rows } = await pool.query(
    `UPDATE complaints SET status = $1, updated_at = NOW(), resolved_at = COALESCE($3, resolved_at)
     WHERE id = $2 RETURNING *`,
    [status, id, resolvedAt]
  );
  return mapComplaint(rows[0]);
}

async function getStatusCounts() {
  const { rows } = await pool.query(`
    SELECT status, COUNT(*)::int AS count FROM complaints GROUP BY status
  `);
  const counts = {
    Pending: 0,
    "In Progress": 0,
    Scheduled: 0,
    Resolved: 0,
    Cancelled: 0,
    Unsettled: 0,
  };
  for (const row of rows) {
    const status = normalizeStatus(row.status);
    counts[status] = (counts[status] ?? 0) + row.count;
  }
  return counts;
}

async function getMonthlyAnalytics() {
  const { rows } = await pool.query(`
    SELECT
      TO_CHAR(d.month, 'Mon') AS month,
      COALESCE(submitted.count, 0)::int AS complaints,
      COALESCE(resolved.count, 0)::int AS resolved,
      COALESCE(scheduled.count, 0)::int AS scheduled
    FROM (
      SELECT DATE_TRUNC('month', CURRENT_DATE) - (n || ' months')::interval AS month
      FROM generate_series(5, 0, -1) AS n
    ) d
    LEFT JOIN (
      SELECT DATE_TRUNC('month', created_at) AS month, COUNT(*) AS count
      FROM complaints GROUP BY 1
    ) submitted ON submitted.month = d.month
    LEFT JOIN (
      SELECT DATE_TRUNC('month', resolved_at) AS month, COUNT(*) AS count
      FROM complaints WHERE resolved_at IS NOT NULL GROUP BY 1
    ) resolved ON resolved.month = d.month
    LEFT JOIN (
      SELECT DATE_TRUNC('month', hearing_date) AS month, COUNT(*) AS count
      FROM hearings GROUP BY 1
    ) scheduled ON scheduled.month = d.month
    ORDER BY d.month
  `);
  return rows;
}

async function getCategoryCounts() {
  const { rows } = await pool.query(`
    SELECT category, COUNT(*)::int AS total FROM complaints GROUP BY category ORDER BY total DESC
  `);
  return rows.map((r) => ({ category: r.category, total: r.total }));
}

async function getPriorityCounts() {
  const { rows } = await pool.query(`
    SELECT priority, COUNT(*)::int AS cases FROM complaints GROUP BY priority ORDER BY cases DESC
  `);
  return rows.map((r) => ({ priority: r.priority, cases: r.cases }));
}

async function getAvgResolutionDays() {
  const { rows } = await pool.query(`
    SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 86400), 0)::numeric(10,1) AS avg_days
    FROM complaints WHERE resolved_at IS NOT NULL
  `);
  return parseFloat(rows[0].avg_days) || 0;
}

module.exports = {
  findAll,
  findRecent,
  findById,
  updateStatus,
  getStatusCounts,
  getMonthlyAnalytics,
  getCategoryCounts,
  getPriorityCounts,
  getAvgResolutionDays,
};
