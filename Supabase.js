import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mutqnggyktozmzgprsjv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dHFuZ2d5a3Rvem16Z3Byc2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MTgxNTYsImV4cCI6MjA2ODM5NDE1Nn0.lyt-DS8ygG5W-J9yAg8RUvx9fgAaOJTgCtgreN_0uZ4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
