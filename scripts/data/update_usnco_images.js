const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://rrjhdokniecigtekmpjz.supabase.co',
    'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4'
);

// Question-to-page mappings for USNCO Local
const localPageMap = {
    2020: { 3: [1,11], 4: [12,21], 5: [22,30], 6: [31,39], 7: [40,51], 8: [52,60] },
    2021: { 3: [1,10], 4: [11,19], 5: [20,29], 6: [30,39], 7: [40,52], 8: [53,60] },
    2022: { 3: [1,10], 4: [11,20], 5: [21,28], 6: [29,37], 7: [38,52], 8: [53,60] },
    2023: { 3: [1,10], 4: [11,18], 5: [19,26], 6: [27,36], 7: [37,51], 8: [52,60] },
    '2023b': { 3: [1,11], 4: [12,18], 5: [19,27], 6: [28,36], 7: [37,47], 8: [48,59], 9: [60,60] },
    2024: { 3: [1,11], 4: [12,22], 5: [23,31], 6: [32,43], 7: [44,56], 8: [57,60] },
    2025: { 3: [1,12], 4: [13,24], 5: [25,33], 6: [34,46], 7: [47,60] },
};

// Question-to-page mappings for USNCO National
const nationalPageMap = {
    2020: { 3: [1,10], 4: [11,22], 5: [23,30], 6: [31,39], 7: [40,51], 8: [52,60] },
    2021: { 3: [1,9], 4: [10,16], 5: [17,24], 6: [25,31], 7: [32,39], 8: [40,47], 9: [48,57], 10: [58,60] },
    2023: { 3: [1,8], 4: [9,17], 5: [18,23], 6: [24,29], 7: [30,36], 8: [37,45], 9: [46,57], 10: [58,60] },
    2024: { 3: [1,8], 4: [9,16], 5: [17,22], 6: [23,29], 7: [30,39], 8: [40,51], 9: [52,60] },
    2025: { 3: [1,10], 4: [11,18], 5: [19,26], 6: [27,33], 7: [34,43], 8: [44,57], 9: [58,60] },
};

function getPageForQuestion(pageMap, year, questionNum) {
    const yearMap = pageMap[year];
    if (!yearMap) return null;
    for (const [page, [start, end]] of Object.entries(yearMap)) {
        if (questionNum >= start && questionNum <= end) {
            return parseInt(page);
        }
    }
    return null;
}

async function updateImages() {
    let updated = 0;
    let errors = 0;

    // Update USNCO Local problems
    console.log('Updating USNCO Local problems...');
    const { data: localProblems, error: localErr } = await supabase
        .from('olympiad_problems')
        .select('id, year, number, contest')
        .eq('contest', 'USNCO Local');

    if (localErr) { console.error('Error fetching local:', localErr); return; }
    console.log(`Found ${localProblems.length} USNCO Local problems`);

    for (const p of localProblems) {
        // Check if it's 2023b (the "new" exam)
        // In the DB, 2023b problems might be stored differently
        // For now, use the standard year mapping
        let yearKey = p.year;
        const page = getPageForQuestion(localPageMap, yearKey, p.number);
        if (!page) {
            // Try 2023b
            if (p.year === 2023) {
                const page2 = getPageForQuestion(localPageMap, '2023b', p.number);
                if (page2) {
                    // This might be 2023b, but we can't tell from year alone
                    // Skip for now, 2023 original mapping should cover standard questions
                }
            }
            console.log(`No page mapping for Local ${p.year} #${p.number}`);
            errors++;
            continue;
        }
        const imageUrl = `/images/usnco_local/pages/${p.year}-${page}.jpg`;
        const { error } = await supabase
            .from('olympiad_problems')
            .update({ image_url: imageUrl })
            .eq('id', p.id);
        if (error) {
            console.error(`Error updating ${p.id}:`, error);
            errors++;
        } else {
            updated++;
        }
    }

    // Update USNCO National problems
    console.log('\nUpdating USNCO National problems...');
    const { data: nationalProblems, error: natErr } = await supabase
        .from('olympiad_problems')
        .select('id, year, number, contest')
        .eq('contest', 'USNCO National');

    if (natErr) { console.error('Error fetching national:', natErr); return; }
    console.log(`Found ${nationalProblems.length} USNCO National problems`);

    for (const p of nationalProblems) {
        const page = getPageForQuestion(nationalPageMap, p.year, p.number);
        if (!page) {
            console.log(`No page mapping for National ${p.year} #${p.number}`);
            errors++;
            continue;
        }
        const imageUrl = `/images/usnco_national/pages/${p.year}-${page}.jpg`;
        const { error } = await supabase
            .from('olympiad_problems')
            .update({ image_url: imageUrl })
            .eq('id', p.id);
        if (error) {
            console.error(`Error updating ${p.id}:`, error);
            errors++;
        } else {
            updated++;
        }
    }

    console.log(`\nDone! Updated: ${updated}, Errors: ${errors}`);
}

updateImages().catch(console.error);
