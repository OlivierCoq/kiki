'use server'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database

    
const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)
// console.log(process.env.SUPABASE_SERVICE_ROLE_SECRET)

// Handle file uploads to Supabase storage
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  
  // console.log('Form data received:', formData)
  // const file = formData.get('file') as File

  if (!formData) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  
  const files = formData.getAll('images') as File[]
  // console.log('Files array:', files)
  // if (files.length === 0) {
  //   return NextResponse.json({ error: 'No files provided' }, { status: 400 })
  // }
  type FileWithUrl = {
    name: string;
    url: string;
  }
  let venue_img_files: FileWithUrl[] = []


  for (const file of files) {
    // console.log('Processing file:', file.name)

    // return NextResponse.json({ message: 'File upload endpoint is working' }, { status: 200 })
    // Upload each file to Supabase storage
    const { data, error } = await supabase.storage.from('img').upload(`uploads/${file.name}`, file)
    if (error) {
      console.error('Error uploading file:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    // console.log('File uploaded successfully:', data)
    // Get the public URL of the uploaded file
    const publicUrl = supabase.storage.from('img').getPublicUrl(`uploads/${file.name}`)
    // console.log('Public URL:', publicUrl.data.publicUrl)
    venue_img_files.push({
      name: file.name,
      url: publicUrl.data.publicUrl
    })
  }
  // // Return a success response with the public URL of the uploaded file
  // return NextResponse.json({ message: 'Files uploaded successfully' }, { status: 200 })

    return NextResponse.json({ 
      message: 'Uploaded files successfully! :)',
      venue_img_files
    }, { status: 200 })
}
