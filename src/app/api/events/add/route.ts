'use server'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)

export async function POST(req: Request) {
  const body = await req.json();
  const { name, date, start_time, end_time, venue, customer, menu, notes, status, progress, summary, archived, default_currency } = body;

  console.log('Request body:', body);
  

  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        name,
        date,
        start_time,
        end_time,
        venue, 
        customer,
        menu,
        notes,
        progress,
        status,
        summary,
        archived,
        default_currency
      }
    ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}