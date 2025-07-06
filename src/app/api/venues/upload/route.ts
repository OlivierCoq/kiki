'use server'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database

    
const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Handle file uploads to Supabase storage
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  
  console.log('Form data received:', formData)
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  try {
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage.from('venues').upload(`uploads/${file.name}`, file)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return the public URL of the uploaded file. Assign name other than 'data': 
    
    const public_url = await supabase.storage.from('venues').getPublicUrl(`uploads/${file.name}`)
    console.log(public_url)

    return NextResponse.json({ url: public_url }, { status: 200 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}