'use server'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cache } from 'react'

const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)

const fetchCustomerById = cache(async (id: number) => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
})

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const customerId = Number(params.id)
  
  if (!customerId) {
    return NextResponse.json({ error: 'Missing customer ID' }, { status: 400 })
  }


  const customer = await fetchCustomerById(customerId)
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  } 
  return NextResponse.json({  customer }, { status: 200 })
}
