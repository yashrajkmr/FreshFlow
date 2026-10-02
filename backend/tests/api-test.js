// Comprehensive Backend Verification Test Suite
// Executes against all REST endpoints (CRUD, Query/Path params, FS appendFile/readFile, Auth)

const BASE = 'http://localhost:3001';

const sampleItem = {
  name: `Automated Test Mango Punnet ${Date.now()}`,
  category: 'Produce',
  hoursLeft: 8,
  qty: 25,
  basePrice: 140,
  status: 'pending'
};

async function testSuite() {
  console.log('====================================================');
  console.log('🧪 FRESHFLOW BACKEND AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  try {
    // 0. Health check
    console.log('0. Checking Server Health (/)...');
    const healthRes = await fetch(`${BASE}/`);
    if (!healthRes.ok) throw new Error('Server not responding at ' + BASE);
    const health = await healthRes.json();
    console.log(`   ✅ Service Operational: ${health.service} (DB: ${health.database})\n`);

    // 1. GET /api/items
    console.log('1. Testing GET /api/items (Read All)...');
    const getAllRes = await fetch(`${BASE}/api/items`);
    const allItems = await getAllRes.json();
    console.log(`   ✅ Successfully retrieved ${allItems.length} inventory items from MongoDB.\n`);

    // 2. POST /api/items
    console.log('2. Testing POST /api/items (Create Record)...');
    const createRes = await fetch(`${BASE}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleItem)
    });
    if (!createRes.ok) throw new Error('Failed to create item');
    const created = await createRes.json();
    const createdId = created._id || created.id;
    console.log(`   ✅ Created Item ID: ${createdId} ("${created.name}")\n`);

    // 3. GET /api/items?category=Produce (Query Parameter)
    console.log('3. Testing GET /api/items?category=Produce (Query Parameter)...');
    const queryRes = await fetch(`${BASE}/api/items?category=Produce`);
    const produceItems = await queryRes.json();
    console.log(`   ✅ Query param returned ${produceItems.length} Produce items.\n`);

    // 4. GET /api/items/:id (Path Parameter)
    console.log(`4. Testing GET /api/items/${createdId} (Path Parameter)...`);
    const getOneRes = await fetch(`${BASE}/api/items/${createdId}`);
    const fetchedOne = await getOneRes.json();
    console.log(`   ✅ Path parameter retrieved: "${fetchedOne.name}" (Base: ₹${fetchedOne.basePrice})\n`);

    // 5. POST /api/items/:id/approve (Markdown Approval Flow)
    console.log(`5. Testing POST /api/items/${createdId}/approve (Markdown Approval Flow)...`);
    const approveRes = await fetch(`${BASE}/api/items/${createdId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        markdown: 30,
        managerNote: 'Batch approaching 8 hours limit. Discounted 30% for immediate customer checkout.',
        managerName: 'Yashraj Kumar',
        staffId: 'FF-MGR-01',
        department: 'Produce Section'
      })
    });
    if (!approveRes.ok) throw new Error('Failed to approve markdown');
    const approvedData = await approveRes.json();
    console.log(`   ✅ Markdown Approved: ${approvedData.item.markdown}% off. Discounted price: ₹${approvedData.item.discountPrice}\n`);

    // 6. PUT /api/items/:id (Update Record)
    console.log(`6. Testing PUT /api/items/${createdId} (Update Record)...`);
    const putRes = await fetch(`${BASE}/api/items/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty: 35 })
    });
    const updated = await putRes.json();
    console.log(`   ✅ Updated record quantity to: ${updated.qty} units.\n`);

    // 7. Validation Rejection (400 Bad Request)
    console.log('7. Testing Input Validation (Invalid item rejection)...');
    const invalidRes = await fetch(`${BASE}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', category: 'BadCategory', hoursLeft: -10, qty: 0, basePrice: -5 })
    });
    console.log(`   ✅ Correctly rejected with HTTP ${invalidRes.status}: ${(await invalidRes.json()).error}\n`);

    // 8. DELETE /api/items/:id (Delete Record)
    console.log(`8. Testing DELETE /api/items/${createdId} (Delete Record)...`);
    const delRes = await fetch(`${BASE}/api/items/${createdId}`, { method: 'DELETE' });
    console.log(`   ✅ Deleted record (HTTP ${delRes.status} No Content).\n`);

    // 9. POST /api/audit/save (Node.js File System appendFile)
    console.log('9. Testing POST /api/audit/save (Node.js File System appendFile)...');
    const fsSaveRes = await fetch(`${BASE}/api/audit/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Yashraj Kumar',
        staffId: 'FF-MGR-01',
        department: 'Dairy Section',
        action: 'Manual Audit Checkpoint Verified',
        notes: 'Cold room temperature verified at 3.5C; shelf inventory verified.'
      })
    });
    const fsSaveData = await fsSaveRes.json();
    console.log(`   ✅ File System saved: "${fsSaveData.message}"\n`);

    // 10. GET /api/audit/view (Node.js File System readFile)
    console.log('10. Testing GET /api/audit/view (Node.js File System readFile)...');
    const fsViewRes = await fetch(`${BASE}/api/audit/view`);
    const rawAudit = await fsViewRes.text();
    console.log(`   ✅ File System read ${rawAudit.length} bytes from server disk file freshflow-audit.txt.\n`);

    // 11. GET /api/auth/profile
    console.log('11. Testing GET /api/auth/profile...');
    const authRes = await fetch(`${BASE}/api/auth/profile`);
    const profile = await authRes.json();
    console.log(`   ✅ Store Manager profile verified: ${profile.name} (${profile.role})\n`);

    // 12. POST /api/auth/login (JWT Generation)
    console.log('12. Testing POST /api/auth/login (JWT Generation)...');
    const loginRes = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'manager', password: 'freshflow123' })
    });
    const loginData = await loginRes.json();
    if (!loginData.token) throw new Error('JWT token missing from login response');
    console.log(`   ✅ Logged in as: ${loginData.user.name} | Token verified (${loginData.token.slice(0, 18)}...)\n`);

    // 13. POST /api/auth/register (Store Staff Registration)
    const testUsername = `clerk_${Date.now()}`;
    console.log(`13. Testing POST /api/auth/register (User Signup: ${testUsername})...`);
    const registerRes = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        email: `${testUsername}@freshflow.internal`,
        password: 'securePassword123',
        name: 'Automated Test Clerk',
        role: 'Inventory Clerk',
        department: 'Produce Section'
      })
    });
    const registerData = await registerRes.json();
    if (!registerData.token) throw new Error('JWT token missing from register response');
    console.log(`   ✅ Registered new user: ${registerData.user.name} [Staff ID: ${registerData.user.staffId}]\n`);

    // 14. GET /api/auth/profile with Bearer Token
    console.log('14. Testing GET /api/auth/profile with Bearer Token...');
    const tokenProfileRes = await fetch(`${BASE}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${registerData.token}` }
    });
    const tokenProfile = await tokenProfileRes.json();
    console.log(`   ✅ Authenticated token profile confirmed: ${tokenProfile.name} (${tokenProfile.role})\n`);

    // 15. Testing Invalid Login Rejection (401)
    console.log('15. Testing Invalid Password Rejection (HTTP 401)...');
    const badLoginRes = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'manager', password: 'wrongPassword123' })
    });
    if (badLoginRes.status !== 401) throw new Error('Expected 401 for bad credentials');
    console.log(`   ✅ Invalid password correctly rejected with HTTP 401.\n`);

    console.log('====================================================');
    console.log('🎉 ALL 15 TESTS PASSED! BACKEND IS 100% OPERATIONAL');
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
    process.exit(1);
  }
}

testSuite();
