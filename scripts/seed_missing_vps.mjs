import PocketBase from 'pocketbase';

const PB_URL = 'http://103.126.117.20:8095';
const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Piblajar2020';

async function run() {
  const pb = new PocketBase(PB_URL);

  console.log('=== Login to PocketBase ===');
  await pb.collection('_superusers').authWithPassword(EMAIL, PASS);
  console.log('Login successful!');

  const missingVps = [
    {
      environment: 'Sirangkul',
      ip_address: '89.233.105.92',
      username: 'sirangkul',
      password: 'Sfgxjs4H38DQb7K',
      notes: 'DB MySQL password: jUSlAmnIagcSUz4 | Aplikasi SiRangkul (Sistem Rencana Anggaran Kelola Usulan)'
    },
    {
      environment: 'MBG One',
      ip_address: '103.126.117.20',
      username: 'mbgone',
      password: 'mbg.pem',
      notes: 'SSH Key login | PocketBase CMS, N8N, GH Actions Runner'
    }
  ];

  for (const vps of missingVps) {
    try {
      const records = await pb.collection('vps_credentials').getFullList({ filter: `environment='${vps.environment}'` });
      if (records.length > 0) {
        console.log(`[Update] ${vps.environment}`);
        await pb.collection('vps_credentials').update(records[0].id, vps);
      } else {
        console.log(`[Create] ${vps.environment}`);
        await pb.collection('vps_credentials').create(vps);
      }
    } catch (err) {
      console.error(`Failed: ${vps.environment}:`, err.message);
    }
  }

  console.log('\nDone! Total VPS in CMS should now be 7.');
}

run().catch(console.error);
