import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nuypyyxnacvglpqwqihx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eXB5eXhuYWN2Z2xwcXdxaWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMjcyNzgsImV4cCI6MjA4NzkwMzI3OH0.Kbs44uGzc0ti9JKZ5SOJRj_-9YTZG8V-rSwcHzGLtSs'

export const supabase = createClient(supabaseUrl, supabaseKey)
