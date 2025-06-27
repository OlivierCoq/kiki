'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

// Square
import { randomUUID } from 'crypto'
// import JSONBig from "json-bigint"
import { SquareClient, SquareEnvironment } from "square"
const squareClient = new SquareClient({
  environment: process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT == 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox, // Environment.Production or Environment.Sandbox for testing
  token: process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN,
})


export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('emailAddress') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error)
    redirect('/error')
  }

  // Get user from supabase:
  const { data: { user } } = await supabase.auth.getUser()
  console.log('User data:', user)

  // Test updating user metadata
  // const { error: updateError } = await supabase.auth.updateUser({
  //   data: {
  //     full_name: 'Olivier Coq',
  //     avatar_url: 'https://ybkqtujfzpfkfvgsdpmg.supabase.co/storage/v1/object/public/img//oli_pfp.jpg',
  //   },
  // })
  // if (updateError) {
  //   console.error('Update user error:', updateError)
  //   redirect('/error')
  // }
  // console.log('User metadata updated successfully')
  // console.log('User metadata:', user?.user_metadata)

  revalidatePath('/', 'layout')
  redirect('/customers/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const supabaseData = {
    email: formData.get('emailAddress') as string,
    password: formData.get('password') as string,
  }

  const squareData = {
    idempotencyKey: randomUUID(), // Use a unique idempotency key for each request
    emailAddress: supabaseData.email,
    givenName: formData.get('fullName') as string,
    familyName: formData.get('familyName') as string,
    referenceId: '', // This will be set after creating the Supabase user
    address: {
      postalCode: formData.get('postalCode') as string,
      locality: formData.get('locality') as string,
      administrativeDistrictLevel1: formData.get('administrativeDistrictLevel1') as string,
      addressLine1: formData.get('addressLine1') as string,
      addressLine2: formData.get('addressLine2') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      company: formData.get('company') as string,
      country: formData.get('country') as string,      
    }
  }

  const {  error } = await supabase.auth.signUp(supabaseData)
  console.log('Supabase signup error:', error)

  if (error) {
    console.error('Signup error:', error)
    redirect('/error')
  } else {
    console.log('Form data:', formData)
    

    // create a new Square customer 
    // https://developer.squareup.com/explorer/square/customers-api/create-customer
    await squareClient?.customers.create({
      idempotencyKey: randomUUID(), // Use a unique idempotency key for each request
      givenName: squareData?.givenName || 'New User',
      emailAddress: squareData?.emailAddress || '',
      referenceId: '', // Store Supabase user ID in Square customer referenceId 
      address: {
        postalCode: formData.get('postalCode') as string || '',
        locality: formData.get('locality') as string || '',
        administrativeDistrictLevel1: formData.get('administrativeDistrictLevel1') as string || '',
        addressLine1: formData.get('addressLine1') as string || '',
        addressLine2: formData.get('addressLine2') as string || '',
        firstName: formData.get('firstName') as string || '',
        lastName: formData.get('lastName') as string || '',
        company: formData.get('company') as string || '',
        phoneNumber: formData.get('phoneNumber') as string || '',
        country: formData.get('country') as string || '',
      }
    }).then(async(response) => {
      
      console.log('Square customer created:', response)

      const { error } = await supabase.auth.signInWithPassword(supabaseData)

      if (error) {
        console.error('Login error:', error)
        redirect('/error')
      }
    
      // Get user from supabase:
      const { data: { user } } = await supabase.auth.getUser()
      console.log('User data:', user)
  
    
      revalidatePath('/', 'layout')
      redirect('/customers/dashboard')
    })
    // Update Supabase user metadata
    // const { error: updateError } = await supabase.auth.updateUser({
    //   data: {
        
    //   },
    // })
    // if (updateError) {
    //   console.error('Update user error:', updateError)
    //   redirect('/error')
    // }
    
  
   
  
  
  
      revalidatePath('/', 'layout')
      redirect('/customers/dashboard')
  }

  
  }


