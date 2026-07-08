const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function exportData() {
  const snapshot = await db.collection('responses').get();
  const rows = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    rows.push({
      id: doc.id,
      name: data.name || '',
      answer1: data.answers?.[0] ?? '',
      answer2: data.answers?.[1] ?? '',
      answer3: data.answers?.[2] ?? '',
      timestamp: data.timestamp || ''
    });
  });

  const headers = Object.keys(rows[0]).join(',');
  const csvRows = rows.map(r =>
    Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
  );

  fs.writeFileSync('survey_responses.csv', [headers, ...csvRows].join('\n'));
  console.log(`Exported ${rows.length} responses to survey_responses.csv`);
}

exportData();
