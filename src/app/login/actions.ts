'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'



export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
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
  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      full_name: 'Olivier Coq',
      avatar_url: 'https://ybkqtujfzpfkfvgsdpmg.supabase.co/storage/v1/object/public/img//example_pfp.jpg',
    },
  })
  if (updateError) {
    console.error('Update user error:', updateError)
    redirect('/error')
  }
  console.log('User metadata updated successfully')
  // console.log('User metadata:', user?.user_metadata)

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}