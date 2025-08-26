'use server'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database

    
const supabase = createClient(process?.env?.NEXT_PUBLIC_SUPABASE_URL!, process?.env?.SUPABASE_SERVICE_ROLE_SECRET!)



export async function GET() {

  let event_data: any[] = []

  


  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    } else {
      // console.log('Fetched events raw:', data)


      const get_customer_data = async ( data: any[]) => { 
        // merge event data with customer data from database, customers table
        const customerIds = data.map(event => event.customer).filter(id => id !== null && id !== undefined)
        const { data: customers, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .in('id', customerIds)
          if (customerError) {
            throw customerError
          } else {
            // Create a map of customer IDs to customer data
            const customerMap = new Map(customers.map(customer => [customer.id, customer]))
            // Merge customer data into event data
            event_data = data.map(event => ({
              ...event,
              customer: customerMap.get(event.customer) || null // Add customer data or null if not found
            }))

            // console.log('Merged event data with customer data:', event_data)
        }
      }

      const get_venue_data = async ( data: any[]) => {
        // merge event data with venue data from database, venues table
        const venueIds = data.map(event => event.venue).filter(id => id !== null && id !== undefined)
        const { data: venues, error: venueError } = await supabase
          .from('venues')
          .select('*')
          .in('id', venueIds)
        if (venueError) {
          throw venueError
        } else {
          // Create a map of venue IDs to venue data
          const venueMap = new Map(venues.map(venue => [venue.id, venue]))
          // Merge venue data into event data
          event_data = event_data?.map(event => ({
            ...event,
            venue: venueMap.get(event.venue) || null // Add venue data or null if not found
          }))

          // console.log('Merged event data with venue data:', event_data) 
        }
      }

      const get_menu_data = async ( data: any[]) => {
        // merge event data with menu data from database, menus table
        const menuIds = data.map(event => event.menu).filter(id => id !== null && id !== undefined)
        const { data: menus, error: menuError } = await supabase
          .from('menus')
          .select('*')
          .in('id', menuIds)
        if (menuError) {
          throw menuError
        } else {
          // Create a map of menu IDs to menu data
          const menuMap = new Map(menus.map(menu => [menu.id, menu]))
          // Merge menu data into event data
          event_data = event_data?.map(event => ({
            ...event,
            menu: menuMap.get(event.menu) || null // Add menu data or null if not found
          })) 
          // console.log('Merged event data with menu data:', event_data)
        }
      }

      const get_dish_data = async ( data: any[]) => {
        // merge event data with dish data from database, dishes table
        const dishIds = data.map(event => event.menu?.dishes).flat().filter(id => id !== null && id !== undefined)
        const { data: dishes, error: dishError } = await supabase
          .from('dishes')
          .select('*')
          .in('id', dishIds)
        if (dishError) {
          throw dishError
        } else {
          // Create a map of dish IDs to dish data (coming up empty. why?)
          // console.log('Dishes fetched:', dishes)
          // console.log('Dish IDs:', dishIds)
          // console.log('Dishes length:', dishes.length)
          if (!dishes || dishes.length === 0) {
            console.warn('No dishes found for the provided dish IDs:', dishIds)
            return
          }
          console.log('Fetched dishes:', dishes)
          const dishMap = new Map(dishes.map(dish => [dish.id, dish]))
          // console.log('Dish map:', dishMap) 
          // Merge dish data into event data
          event_data = event_data?.map(event => ({
            ...event,
            menu: {   
              ...event.menu,
              dishes: {
                data: event.menu?.dishes?.map((dishId: number) => dishMap.get(dishId) || null) // Add dish data or null if not found
              }
            }
          }))
          // console.log('Merged event data with dish data:', event_data)
        }
      }

      await get_customer_data(data)
      await get_venue_data(data)
      await get_menu_data(data)
      await get_dish_data(data)

      // console.log('Final event data:', event_data)
      // Return the final event data with merged customer, venue, and menu data
      return NextResponse.json(event_data)
    
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

