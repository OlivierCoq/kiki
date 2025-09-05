'use server'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import JSONBig from "json-bigint"
const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) { 


  const menuId = Number(params.id)
  // const body = { venue: 2 }

  // console.log("What we're working with here: ", menuId)

  // Optionally validate input
  if (!menuId) {
    return NextResponse.json({ error: 'Missing menu ID or body' }, { status: 400 })
  }


  interface Dish {
    id: number
    name: string
    description: string
    menu: number
    position: number
    price: number
    cost: number
    tags: string[]
    quantity: number
    created_at: string
    updated_at: string
    updating: boolean
  }
  interface Menu {
      archived: boolean
      created_at: string
      description: string
      dishes: string[] | Dish[] | null
      id: number
      is_public: boolean
      name: string
      packages: {
        data: number[]
      }
      price_per_person: number
      tags: string[]
    }

  let dishResults: any[] = []
  let menuObj 

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
    // const { data: dishes, error: dishError } = await supabase
    //   .from('dishes')
    //   .select('*')
    //   .in('id', menu?.dishes || [])

    // if (dishError) {
    //   throw dishError
    // }
    menuObj = menu
    // menuObj.dishes.forEach((d: any) => { return JSONBig.parse(d) })
    // console.log('heyyyyy', menuObj.dishes)
    // menuObj.dishes = dishes || []
    // console.log('here we go', menuObj, menuObj.dishes, dishes)
// JSONBig.parse(JSONBig.stringify(square_response))
    // dishResults = JSONBig.parse(dishes) || []

    return NextResponse.json({ menu: menuObj }, { status: 200 })
  } catch (error) {
    console.error('Error fetching menu or dishes:', error)
    return NextResponse.json({ error: 'Failed to fetch menu or dishes' }, { status: 500 })
  }
}

