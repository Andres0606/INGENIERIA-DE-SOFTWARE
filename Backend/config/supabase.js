import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xmpatkjqezjhdbjiglzk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtcGF0a2pxZXpqaGRiamlnbHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMTQ5NjksImV4cCI6MjA3NzY5MDk2OX0.umK8-IB4yompCtMycnttCop7YjwyRv-v5QohMkQpJjM'

// Crear y exportar el cliente
const supabase = createClient(supabaseUrl, supabaseKey)

// Exportación por defecto
export default supabase