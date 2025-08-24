'use server'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) { 


  const eventId = Number(params.id)
  // const body = { venue: 2 }


  // Optionally validate input
  if (!eventId) {
    return NextResponse.json({ error: 'Missing event ID or body' }, { status: 400 })
  }

  try {
    // Fetch the menu by ID
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (eventError) {
      throw eventError
    }

    // Fetch dishes associated with the menu
    // const { data: dishes, error: dishError } = await supabase
    //   .from('dishes')
    //   .select('*')
    //   .in('id', menu?.dishes || [])

    // if (dishError) {
    //   throw dishError

    // menuObj.dishes.forEach((d: any) => { return JSONBig.parse(d) })

    // menuObj.dishes = dishes || []
    // console.log('here we go', menuObj, menuObj.dishes, dishes)
// JSONBig.parse(JSONBig.stringify(square_response))
    // dishResults = JSONBig.parse(dishes) || []

    return NextResponse.json({ event }, { status: 200 })
  } catch (error) {
    console.error('Error fetching event: ', error)
    return NextResponse.json({ error: 'Failed to fetch menu or dishes' }, { status: 500 })
  }
}

