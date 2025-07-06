// Delete
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';   

// Create a single supabase client for interacting with your database
const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!);

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const venueId = Number(params.id);

  // Validate input
  if (!venueId) {
    return NextResponse.json({ error: 'Missing venue ID' }, { status: 400 });
  }

  // Delete the venue from the database
  const { data, error } = await supabase
    .from('venues')
    .delete()
    .eq('id', venueId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Venue deleted successfully', venue: data }, { status: 200 });
}