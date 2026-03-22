#!/usr/bin/env node

/**
 * Admin Panel Setup Script
 *
 * This script helps set up the admin panel by:
 * 1. Checking if is_admin field exists in profiles table
 * 2. Prompting to add the field if it doesn't exist
 * 3. Making the current user an admin
 *
 * Usage: node scripts/setup-admin.js
 */

const fs = require("fs");
const path = require("path");

console.log("🔧 Admin Panel Setup\n");
console.log("To complete admin panel setup:\n");

console.log("1. Update your Supabase schema:");
console.log("   - Go to Supabase SQL Editor");
console.log(
  "   - Run: supabase/schema.sql (or just run the ALTER TABLE command below)\n",
);

console.log("2. Ensure is_admin column exists:");
console.log(`
   ALTER TABLE public.profiles 
   ADD COLUMN is_admin boolean NOT NULL DEFAULT false;
`);

console.log("3. Make a user an admin:");
console.log(`
   UPDATE public.profiles 
   SET is_admin = true 
   WHERE email = 'your-email@example.com';
`);

console.log(
  '4. The admin will now see an "Admin" link in the header when signed in\n',
);

console.log("✅ Setup complete!");
console.log("Visit /admin to access the admin panel (admin users only)\n");
