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

  const customerId = Number(params.id)
  const body = await req.json()

  console.log('body', body)
  console.log('customah', body?.kiki_customer?.square_data?.customer)

  if (!customerId || !body) {
    return NextResponse.json({ error: 'Missing customer ID or body' }, { status: 400 })
  }


  // First edit the Square object
    body.square_customer['customerId'] = body?.square_customer?.id
    console.log('to Square: ', body?.square_customer)

  
    await squareClient.customers.update(body?.square_customer)
    .then(async (res) => {
      console.log('updated square customer', res)

      // Then update the Supabase object
      const { data, error } = await supabase
          .from('customers')
          .update(body?.kiki_customer)
          .eq('id', customerId)
          .select()
          .single()

        if (error) {
          console.log('Supabase did not update: ', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }
      
        console.log('Updated Supabase: ', data)
         
    })
    .catch((err) => {
      console.log('error updating Square: ', err)
    })

    return NextResponse.json({ 
      status: 200,
      data: 'Updated Customer'
     })
}