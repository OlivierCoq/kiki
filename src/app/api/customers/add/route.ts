// Add new Customer API route
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import JSONBig from "json-bigint";

// Create a single supabase client for interacting with your database
const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!);

// Square
import { randomUUID } from 'crypto'
// import JSONBig from "json-bigint"
import { SquareClient, SquareEnvironment } from "square"
const squareClient = new SquareClient({
  environment: process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT == 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox, // Environment.Production or Environment.Sandbox for testing
  token: process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN,
})


export async function POST(req: Request) {
  const body = await req.json();
  console.log('Request body:', body);

  const new_customer = body?.customer
  let response_obj = {} as any;

  // Add to Square
  await squareClient?.customers.create({
        idempotencyKey: randomUUID(), // Use a unique idempotency key for each request
        givenName: new_customer?.givenName || '',
        familyName: new_customer?.familyName || '',
        phoneNumber: new_customer?.phoneNumber || '',
        emailAddress:new_customer?.emailAddress || '',
        address: {
          postalCode: new_customer?.address?.postalCode || '',
          locality: new_customer?.address?.locality || '',
          country: new_customer?.address?.country || '',
          administrativeDistrictLevel2: new_customer?.address?.administrativeDistrictLevel2 || '',
          administrativeDistrictLevel1: new_customer?.address?.administrativeDistrictLevel1 || '',
          addressLine1: new_customer?.address?.addressLine1 || '',
          addressLine2: new_customer?.address?.addressLine2 || '',
        },
      }).then(async(square_response) => {
        
        console.log('Square customer created:', square_response)
  
        // Sign up to supbase
        const generate_password = Math.random().toString(36).slice(-8) // Generate a random password

        const supabaseData = {
          email: square_response?.customer?.emailAddress || '',
          password: generate_password
        }
        const { data: { user }, error: supabaseError } = await supabase.auth.signUp(supabaseData);
        if (supabaseError) {
          console.error('Supabase sign up error:', supabaseError);
          return NextResponse.json({ error: 'Failed to sign up customer' }, { status: 500 });
        } 
          console.log('Supabase user created:', user);
        

          // Example response:
          // {
          //   id: '9c6ed7b5-e8da-4cc1-8c28-3cdf30fb5cb3',
          //   aud: 'authenticated',
          //   role: 'authenticated',
          //   email: 'oseeyositesandmore@gmail.com',
          //   phone: '',
          //   confirmation_sent_at: '2025-07-14T02:11:22.39795868Z',
          //   app_metadata: { provider: 'email', providers: [ 'email' ] },
          //   user_metadata: {
          //     email: 'oseeyositesandmore@gmail.com',
          //     email_verified: false,
          //     phone_verified: false,
          //     sub: '9c6ed7b5-e8da-4cc1-8c28-3cdf30fb5cb3'
          //   },
          //   identities: [
          //     {
          //       identity_id: '5f164a1e-014a-43dd-b759-4540397e9b77',
          //       id: '9c6ed7b5-e8da-4cc1-8c28-3cdf30fb5cb3',
          //       user_id: '9c6ed7b5-e8da-4cc1-8c28-3cdf30fb5cb3',
          //       identity_data: [Object],
          //       provider: 'email',
          //       last_sign_in_at: '2025-07-14T02:11:22.392004689Z',
          //       created_at: '2025-07-14T02:11:22.392051Z',
          //       updated_at: '2025-07-14T02:11:22.392051Z',
          //       email: 'oseeyositesandmore@gmail.com'
          //     }
          //   ],
          //   created_at: '2025-07-14T02:11:22.386593Z',
          //   updated_at: '2025-07-14T02:11:23.001946Z',
          //   is_anonymous: false
          // }


          // Insert the customer into the database
          
          const { data, error } = await supabase
            .from('customers')
            .insert([
              { 
                user: user?.id,
                email: user?.email,
                square_data: JSONBig.parse(JSONBig.stringify(square_response))
              }])
            .select();

          if (error) {
            console.error('Error inserting customer into database:', error);
            return NextResponse.json({ error: 'Failed to add customer' }, { status: 500 });
          }
          // console.log('Customer added to database:', data);
          console.log('Customer added to database successfully')
          response_obj = await data[0];
          return NextResponse.json({ message: 'Customer added successfully', customer: response_obj }, { status: 201 });
        
      }).catch((error) => {
        console.error('Error creating Square customer:', error);
        return NextResponse.json({ error: 'Failed to create customer in Square' }, { status: 500 });
      });

  // Return a response

  return NextResponse.json({ message: 'Customer added successfully', customer: response_obj }, { status: 201 });
}