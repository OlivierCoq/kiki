export type VenueImage = {
  name: string
  url: string
}

export type Venue = {
  id: number
  address: string
  archived: false
  capacity: number
  city: string
  country: string
  contact_email: string
  contact_name: string
  contact_number: string
  images: VenueImage[] | null
  name: string
  notes: string
  tags: string[] | null
  zip: string,
  state: string
}

export type ProgressEventStep = {
  date: string
  label: string
  status: string
}

export type Summary = {
  production: {
    total_guests: number
    price_per_person: number
    items: string[]
  }
  total_revenue: number
  total_cost: number
  total_profit: number
}

export type Dish = {
  id: number
  name: string
  description: string
  menu: number
  position: number
  price: number
  tags: string[]
  created_at: string
  updated_at: string
}

export type Event = {
  active: boolean
  created_at: string
  customer: {
    created_at: string
    email: string
    id: number 
    square_data: {
      customer: {
        created_at: string
        creationSource: string
        emailAddress: string
        givenName: string
        familyName: string
        phoneNumber: string
        id: string
        address: {
          addressLine1: string
          addressLine2: string | null 
          administrativeDistrictLevel1: string
          administrativeDistrictLevel2: string
          country: string
          locality: string
          postalCode: string
        }
        
        preferences: {
          emailUnsubscribed: boolean
        }
        updatedAt: string
      }
    }
    user: string
  }
  date: string
  end_time: string
  id: number
  menu: {
    archived: boolean
    created_at: string
    description: string
    dishes: string[] | Dish[] | null
    id: number
    is_public: boolean
    name: string
    packages: {
      data: number[]
    }
    price_per_person: number
    tags: string[]
  }
  name: string
  notes: string
  progress: {
    data: ProgressEventStep[]
  }
  summary: Summary
  start_time: string
  status: string
  venue: Venue
}