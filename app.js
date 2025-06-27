// getLayers.js
// Requires: Node.js v18+ for native fetch

async function getLayers() {
    const url = 'http://localhost:9900/api/graphics/mos/layers';

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Layers Data:", data);
    } catch (err) {
        console.error("❌ Error fetching layers:", err.message);
    }
}

async function postLayers() {
    // const url = 'http://localhost:9900/api/graphics/mos/rundown/load/96857485';
    const url = 'http://localhost:9900/api/graphics//mos/take/ITEM001';

    try {
        const token = 'your-valid-auth-token'; // replace this with actual token
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Add token here
            },
            body: JSON.stringify({}), // adjust body if needed
        });
        const data = await res.json();
        console.log("✅ Layers Data:", data);
    } catch (err) {
        console.error("❌ Error fetching layers:", err.message);
    }
}


getLayers();
postLayers()
