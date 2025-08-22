'use server'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database

    
const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)



export async function GET() {
  
  try {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    } else {
      return NextResponse.json({ menus: data }, { status: 200 })
    }
  } catch (error) {
    console.error('Error fetching menus:', error)
    return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 })
  }
}

