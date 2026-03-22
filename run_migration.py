#!/usr/bin/env python3
import os
import sys
from supabase import create_client, Client

# Initialize Supabase client
url = "https://xkpwjccqoohwbroxdwjh.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrcHdqY2Nxb29od2Jyb3hkd2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNDU2NzEsImV4cCI6MjA4NzgyMTY3MX0.KNyrbPtKiwB_CdTUrhr_FcC9jz-PUtWNnlN_vj6Gum4"

supabase: Client = create_client(url, key)

# Read the migration SQL
with open("supabase/migrations/02_remove_product_fk.sql", "r") as f:
    sql = f.read()

# Execute the SQL
try:
    result = supabase.rpc('exec_sql', {'sql': sql}).execute()
    print("Migration executed successfully!")
    print(result)
except Exception as e:
    print(f"Error executing migration: {e}")
    sys.exit(1)
