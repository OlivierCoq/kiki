'use server'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) { 


  const customerId = Number(params.id)
  // const body = { venue: 2 }


  // Optionally validate input
  if (!customerId) {
    return NextResponse.json({ error: 'Missing customer ID or body' }, { status: 400 })
  }

  try {
    // Fetch the menu by ID
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single()

    if (customerError) {
      throw customerError
    }

    return NextResponse.json({ customer }, { status: 200 })
  } catch (error) {
    console.error('Error fetching customer: ', error)
    return NextResponse.json({ message: 'Failed to fetch customer', error }, { status: 500 })
  }
}

