'use server'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)

export async function POST(req: Request) {
  const body = await req.json();
  const { menu, name, description, category, price, tags, position, quantity, cost, updating } = body;

  console.log('Request body:', body);
  

  const { data, error } = await supabase
    .from('dishes')
    .insert([
      {
        menu,
        name,
        description,
        category,
        price,
        tags,
        position,
        quantity,
        cost,
        updating
      }
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dish: data[0] }, { status: 201 });
}