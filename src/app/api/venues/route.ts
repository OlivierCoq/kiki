'use server'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cache } from 'react'

// Create a single supabase client for interacting with your database

    
const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY!)


// Create cached version of the function
const fetchVenues = cache(async () => {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }
  return data
})()  
export async function GET() {
  try {
    const data = await fetchVenues
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching venues:', error)
    return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 })
  }
}


// export async function GET() {

//   let venue_data: any[] = []

  


//   try {
//     const { data, error } = await supabase
//       .from('venues')
//       .select('*')
//       .order('created_at', { ascending: false })

//     if (error) {
//       throw error
//     } else {
//       // console.log('Fetched venues raw:', data)
//       data



//       return NextResponse.json(data)
    
//     }
//   } catch (error) {
//     console.error('Error fetching venues:', error)
//     return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 })
//   }
// }