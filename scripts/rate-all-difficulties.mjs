#!/usr/bin/env node

// Run this script to re-rate all problem difficulties using Claude AI
// Usage: node scripts/rate-all-difficulties.mjs
// Requires the dev server to be running on localhost:3000

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const BATCH_SIZE = 40; // Problems per API call

async function rateAll() {
    let offset = 0;
    let totalUpdated = 0;

    console.log('Starting difficulty re-rating...\n');

    while (true) {
        console.log(`Rating batch at offset ${offset}...`);

        try {
            const res = await fetch(`${BASE_URL}/api/rate-difficulty`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ batch_size: BATCH_SIZE, offset }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Error:', data.error);
                break;
            }

            console.log(`  -> Updated ${data.updated}/${data.total_in_batch} problems`);
            totalUpdated += data.updated;

            if (data.total_in_batch < BATCH_SIZE) {
                // Last batch
                break;
            }

            offset = data.next_offset;

            // Small delay to avoid rate limiting
            await new Promise(r => setTimeout(r, 1000));
        } catch (err) {
            console.error('Fetch error:', err.message);
            break;
        }
    }

    console.log(`\nDone! Total problems re-rated: ${totalUpdated}`);
}

rateAll();
