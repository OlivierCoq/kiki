// Add new Venue API route
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!);

export async function POST(req: Request) {
  const body = await req.json();
  const { name, contact_number, contact_email, contact_name, address, city, state, zip, country, notes, tags, archived, images } = body;

  // Validate input
  if (!name || !address || !city || !state || !zip || !country) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Insert the new venue into the database
  const { data, error } = await supabase
    .from('venues')
    .insert([
      {
        name,
        contact_number,
        contact_email,
        contact_name,
        address,
        state,
        city,
        zip,
        capacity: 0,
        notes,
        tags,
        archived,
        images
      }
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Venue added successfully', venue: data }, { status: 201 });
}