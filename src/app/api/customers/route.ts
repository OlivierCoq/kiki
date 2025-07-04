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
  token: process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN,
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) { 




}