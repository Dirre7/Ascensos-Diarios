import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ssqmajjigujmocnndtfa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzcW1hamppZ3VqbW9jbm5kdGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MDg4MTcsImV4cCI6MjA4MTA4NDgxN30.gSV6PYcyi622X4RLwm4w2tZnVhBV2tDJPHmzhfrBb-A';

export const supabase = createClient(supabaseUrl, supabaseKey);