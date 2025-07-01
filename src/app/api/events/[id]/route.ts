'use server'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) { 


  const eventId = Number(params.id)
  const body = await req.json()
  // const body = { venue: 2 }

  // console.log("What we're working with here: ", eventId)
  // console.log('booody ', body)

  // Optionally validate input
  if (!eventId || !body) {
    return NextResponse.json({ error: 'Missing event ID or body' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('events')
    .update(body)
    .eq('id', eventId)
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ event: data })

}

