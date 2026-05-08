import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bptzmuqiwwdukgrhsezo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdHptdXFpd3dkdWtncmhzZXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NDgwNjYsImV4cCI6MjA5MzMyNDA2Nn0.xXxy0jhyuN91ZZrnx_IJd6c1Qubli1pqk2c3xQLMvg8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)