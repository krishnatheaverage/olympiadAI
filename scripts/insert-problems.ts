/**
 * Insert problems from JSON files into Supabase.
 * Run with: npx tsx scripts/insert-problems.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  const dataDir = path.resolve(__dirname, 'data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  
  let totalInserted = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  for (const file of files) {
    const problems = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
    console.log(`\n📄 Processing ${file} (${problems.length} problems)...`);
    
    for (const p of problems) {
      // Check if exists
      const { data: existing } = await supabase
        .from('olympiad_problems')
        .select('id')
        .eq('contest', p.contest)
        .eq('year', p.year)
        .eq('number', p.number)
        .maybeSingle();
      
      if (existing) {
        totalSkipped++;
        continue;
      }
      
      const { error } = await supabase
        .from('olympiad_problems')
        .insert([{
          contest: p.contest,
          year: p.year,
          number: p.number,
          topic: p.topic,
          difficulty: p.difficulty,
          problem: p.problem,
          choices: p.choices,
          correct_answer: p.correct_answer,
          correct_value: p.correct_value,
          solution: p.solution || 'See AoPS wiki for detailed solution.',
          track: p.track,
          source_link: p.source_link || '',
        }]);
      
      if (error) {
        console.error(`  ❌ ${p.contest} ${p.year} #${p.number}: ${error.message}`);
        totalErrors++;
      } else {
        totalInserted++;
      }
    }
  }
  
  console.log(`\n📊 Results:`);
  console.log(`   Inserted: ${totalInserted}`);
  console.log(`   Skipped:  ${totalSkipped}`);
  console.log(`   Errors:   ${totalErrors}`);
}

main().catch(console.error);
