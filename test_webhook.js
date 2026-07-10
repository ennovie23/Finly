const pool = require('./backend/config/db');
async function run() {
  const result = await pool.query("SELECT id, paymongo_source_id, amount FROM wallet_transactions WHERE status = 'pending'");
  for (let row of result.rows) {
    console.log(`Simulating webhook for transaction ${row.id} with source ${row.paymongo_source_id}...`);
    const payload = {
      data: {
        type: "event",
        attributes: {
          type: "link.payment.paid",
          data: {
            id: "mock_payment_id_" + row.id,
            attributes: {
              link_id: row.paymongo_source_id
            }
          }
        }
      }
    };
    const res = await fetch("http://localhost:5001/api/wallet/webhook", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log(`Response: ${res.status}`);
  }
  process.exit(0);
}
run();
