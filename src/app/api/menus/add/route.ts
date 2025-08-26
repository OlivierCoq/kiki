'use server'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)

export async function POST(req: Request) {
  const body = await req.json();
  const { name, archived, description, dishes, is_public, packages, price_per_person, tags } = body;

  console.log('Request body:', body);

  const { data, error } = await supabase
    .from('menus')
    .insert([
      {
        archived,
        name,
        description,
        dishes,
        is_public,
        packages,
        price_per_person,
        tags 
      }
    ])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}