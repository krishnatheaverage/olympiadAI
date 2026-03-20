const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://rrjhdokniecigtekmpjz.supabase.co',
    'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4'
);

// Questions that NEED images (have visual elements like structures, diagrams, graphs)
const visualQuestions = {
    'USNCO Local': {
        2020: [8, 15, 18, 29, 35, 51, 52, 55, 56, 57, 59],
        2021: [13, 18, 36, 53, 55, 56, 59],
        2022: [3, 9, 14, 17, 22, 24, 36, 59],
        2023: [17, 23, 24, 36, 40, 46, 51, 56, 57, 58],
        2024: [15, 53, 55, 56, 57, 60],
        2025: [28, 30, 53, 55, 56],
    },
    'USNCO National': {
        2020: [18, 24, 25, 35, 36, 42, 52, 55, 56, 58, 60],
        2021: [13, 15, 18, 25, 28, 32, 35, 41, 57, 58, 59, 60],
        2023: [6, 14, 16, 18, 21, 22, 24, 28, 30, 36, 42, 53, 55, 56, 58, 60],
        2024: [7, 14, 16, 17, 22, 30, 49, 56, 58, 59],
        2025: [17, 18, 27, 29, 33, 53, 56, 58, 59, 60],
    },
};

async function fixImages() {
    let cleared = 0;
    let kept = 0;

    for (const contest of ['USNCO Local', 'USNCO National']) {
        console.log(`\nProcessing ${contest}...`);

        const { data: problems, error } = await supabase
            .from('olympiad_problems')
            .select('id, year, number, image_url')
            .eq('contest', contest);

        if (error) { console.error('Error:', error); continue; }
        console.log(`Found ${problems.length} problems`);

        for (const p of problems) {
            const needsImage = visualQuestions[contest]?.[p.year]?.includes(p.number);

            if (!needsImage && p.image_url) {
                // Remove image_url from text-only questions
                const { error: updateErr } = await supabase
                    .from('olympiad_problems')
                    .update({ image_url: null })
                    .eq('id', p.id);
                if (updateErr) console.error(`Error clearing ${p.id}:`, updateErr);
                else cleared++;
            } else if (needsImage && p.image_url) {
                kept++;
            }
        }
    }

    console.log(`\nDone! Kept images: ${kept}, Cleared text-only: ${cleared}`);
}

fixImages().catch(console.error);
