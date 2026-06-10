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

  console.log('\n=== STEP 2: Creating "vps_credentials" Collection ===');
  try {
    await pb.collections.getOne('vps_credentials');
    console.log('Collection "vps_credentials" already exists.');
  } catch (err) {
    console.log('Collection not found, creating...');
    try {
      await pb.collections.create({
        name: 'vps_credentials',
        type: 'base',
        listRule: null, // Admin only
        viewRule: null, // Admin only
        createRule: null, // Admin only
        updateRule: null, // Admin only
        deleteRule: null, // Admin only
        fields: [
          { name: "environment", type: "text", required: true, unique: true },
          { name: "ip_address", type: "text", required: true },
          { name: "username", type: "text", required: true },
          { name: "password", type: "text", required: true },
          { name: "notes", type: "text", required: false }
        ]
      });
      console.log('Successfully created vps_credentials collection.');
    } catch (createErr) {
      console.error('Failed to create collection:', createErr.message, JSON.stringify(createErr.data));
      process.exit(1);
    }
  }

  console.log('\n=== STEP 3: Seeding VPS Data ===');
  const vpsData = [
    {
      environment: 'Primary VPS (Pondok / Aiman)',
      ip_address: '103.150.196.183',
      username: 'pondokinformatika',
      password: 'pi.pem / Piblajar2020 (Console)',
      notes: 'Local path: /Users/pondokit/Herd/aiman/pi.pem'
    },
    {
      environment: 'Pi Santri Dev',
      ip_address: '210.79.191.137',
      username: 'pi',
      password: 'Piblajar2020',
      notes: ''
    },
    {
      environment: 'Pi Santri Prod',
      ip_address: '103.171.84.156',
      username: 'pi',
      password: 'Piblajar2020',
      notes: ''
    },
    {
      environment: 'Risethub Prod',
      ip_address: '103.127.138.200',
      username: 'risethub',
      password: 'Piblajar2020',
      notes: ''
    },
    {
      environment: 'M-PAD Baubau',
      ip_address: '157.10.252.74',
      username: 'sipanda',
      password: 'Bapenda123#$',
      notes: ''
    }
  ];

  let count = 0;
  for (const vps of vpsData) {
    try {
      const records = await pb.collection('vps_credentials').getFullList({ filter: `environment='${vps.environment}'` });
      if (records.length > 0) {
        console.log(`[Update] ${vps.environment}`);
        await pb.collection('vps_credentials').update(records[0].id, vps);
      } else {
        console.log(`[Create] ${vps.environment}`);
        await pb.collection('vps_credentials').create(vps);
      }
      count++;
    } catch (insertErr) {
      console.error(`Failed to process vps "${vps.environment}":`, insertErr.message, insertErr.data);
    }
  }
  
  console.log(`\nSuccessfully processed ${count} VPS credentials!`);
}

run().catch(console.error);
