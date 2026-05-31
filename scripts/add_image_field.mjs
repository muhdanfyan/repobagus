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

  console.log('\n=== STEP 2: Updating "curated_repos" Collection ===');
  try {
    const coll = await pb.collections.getOne('curated_repos');
    
    // Check if image field already exists
    const hasImage = coll.fields.find(f => f.name === 'image');
    if (!hasImage) {
      coll.fields.push({
        name: "image",
        type: "file",
        required: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"]
        }
      });
      await pb.collections.update('curated_repos', coll);
      console.log('Successfully added "image" field to curated_repos collection.');
    } else {
      console.log('"image" field already exists.');
    }
  } catch (err) {
    console.error('Failed to update collection:', err.message, err.data);
  }
}

run().catch(console.error);
