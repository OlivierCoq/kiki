'use server'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) { 


  const venueId = Number(params.id)
  // const body = { venue: 2 }


  // Optionally validate input
  if (!venueId) {
    return NextResponse.json({ error: 'Missing venue ID or body' }, { status: 400 })
  }

  try {
    // Fetch the menu by ID
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select('*')
      .eq('id', venueId)
      .single()

    if (venueError) {
      throw venueError
    }

    return NextResponse.json({ venue }, { status: 200 })
  } catch (error) {
    console.error('Error fetching venue: ', error)
    return NextResponse.json({ error: 'Failed to fetch menu or dishes' }, { status: 500 })
  }
}

