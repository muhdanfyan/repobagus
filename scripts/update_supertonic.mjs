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

  console.log('\n=== STEP 2: Updating supertone-inc/supertonic Description ===');
  try {
    const records = await pb.collection('curated_repos').getFullList({ filter: `full_name='supertone-inc/supertonic'` });
    if (records.length > 0) {
      for (const record of records) {
        await pb.collection('curated_repos').update(record.id, {
          fallback_desc: 'Supertonic is a lightning-fast, multilingual Text-to-Speech (TTS) system designed for high-performance, on-device inference.'
        });
        console.log(`Updated description for ${record.full_name}.`);
      }
    } else {
      console.log('supertone-inc/supertonic not found in database.');
    }
  } catch (err) {
    console.error('Failed to update:', err.message);
  }
}

run().catch(console.error);
