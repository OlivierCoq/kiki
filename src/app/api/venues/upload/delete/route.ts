// Delete uploaded files from a venue
import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!);

export async function POST(req: NextRequest) {
  const { path } = await req.json()

  if (!path) {
    return NextResponse.json({ error: 'Missing file path' }, { status: 400 })
  }

  const { error } = await supabase.storage.from('img').remove([path])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'File deleted' })
}