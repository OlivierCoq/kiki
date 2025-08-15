'use server'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) { 


  const menuId = Number(params.id)
  // const body = { venue: 2 }

  // console.log("What we're working with here: ", menuId)

  // Optionally validate input
  if (!menuId) {
    return NextResponse.json({ error: 'Missing menu ID or body' }, { status: 400 })
  }

  let dishResults: any[] = []

  try {
    // Fetch the menu by ID
    const { data: menu, error: menuError } = await supabase
      .from('menus')
      .select('*')
      .eq('id', menuId)
      .single()

    if (menuError) {
      throw menuError
    }

    // Fetch dishes associated with the menu
    const { data: dishes, error: dishError } = await supabase
      .from('dishes')
      .select('*')
      .in('id', menu?.dishes || [])

    if (dishError) {
      throw dishError
    }

    dishResults = dishes || []

    return NextResponse.json({ menu, dishes: dishResults }, { status: 200 })
  } catch (error) {
    console.error('Error fetching menu or dishes:', error)
    return NextResponse.json({ error: 'Failed to fetch menu or dishes' }, { status: 500 })
  }
}

