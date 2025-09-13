'use server'
// NextJS
import { NextResponse, NextRequest } from 'next/server'
// Supabase
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)
// Square
import { randomUUID } from 'crypto'
// import JSONBig from "json-bigint"
import { SquareClient, SquareEnvironment } from "square"
const squareClient = new SquareClient({
  environment: process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT == 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox, // Environment.Production or Environment.Sandbox for testing
  token: process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) { 

  const body = await req.json();
  const { id, packages, name, description, tags, is_public, archived, dishes } = body;

  console.log('Request body for updating menu:', body?.dishes?.data);
  // console.log('body', body)


  if (!body?.id || !body) {
    return NextResponse.json({ error: 'Missing dish ID or body' }, { status: 400 })
  }


  const { data, error } = await supabase
          .from('menus')
          .update(body)
          .eq('id', body?.id)
          .select()
          .single()

      if (error) {
        console.log('Supabase did not update: ', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
  console.log('Updated Supabase: ', data)

return NextResponse.json({ 
  status: 200,
  data,
  message: 'Updated Menu'
  })
}