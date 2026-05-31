import PocketBase from 'pocketbase';

const PB_URL = 'http://103.126.117.20:8095';
const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Piblajar2020';

async function run() {
  const pb = new PocketBase(PB_URL);

  console.log('=== STEP 1: Login to PocketBase ===');
  try {
    await pb.collection('_superusers').authWithPassword(EMAIL, PASS);
    console.log('Login successful!');
  } catch (err) {
    console.error('Failed to login:', err.message);
    process.exit(1);
  }

  console.log('\n=== STEP 2: Updating usestrix/strix Category ===');
  try {
    const records = await pb.collection('curated_repos').getFullList({ filter: `full_name='usestrix/strix'` });
    if (records.length > 0) {
      for (const record of records) {
        await pb.collection('curated_repos').update(record.id, {
          category: 'cybersecurity'
        });
        console.log(`Updated category for ${record.full_name} to 'cybersecurity'.`);
      }
    } else {
      console.log('usestrix/strix not found in database.');
    }
  } catch (err) {
    console.error('Failed to update:', err.message);
  }
}

run().catch(console.error);
