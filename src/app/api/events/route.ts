'use server'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cache } from 'react'

// Create a single supabase client for interacting with your database

    
const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)

export async function GET() {
   

  // cached version of the function
  const fetchEvents = cache(async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      } else {
        // console.log('Fetched events raw:', data)

        return NextResponse.json({
          message: 'Events fetched successfully',
          data
        }, { status: 200 })
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }
  })

  return fetchEvents()
}