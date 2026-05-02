import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://syosmldnzqueijwcjike.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5b3NtbGRuenF1ZWlqd2NqaWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzEwMzcsImV4cCI6MjA5MzMwNzAzN30.bm6u2Pg3NyqDov8MwaPIr7Hu372Zlz9CgnnVOrU9V-I";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
