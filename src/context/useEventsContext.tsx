'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

const EventsContext = createContext<any>(null)  

export function EventsProvider({ children }: { children: React.ReactNode }) {

  let final_data = {}

  const [events, setEvents] = useState<any[] | null>(null)
  const [venues, setVenues] = useState<any[] | null>(null)

  const fetchEvents = async () => {
    const res = await fetch('/api/events')
    const data = await res.json()
    // console.log('CONTEXT!!!!!', data)
    setEvents(data)
  }

  const fetchVenues = async () => {
    const res = await fetch('/api/venues')
    const data = await res.json()
    // console.log('context venues!!!!!', data)
    setVenues(data)
  }

  return (
    <EventsContext.Provider value={{ 
        events, 
        setEvents, 
        fetchEvents,
        venues,
        setVenues,
        fetchVenues
      }}>
      {children}
    </EventsContext.Provider>
  )
}


export const useEvents = () => useContext(EventsContext)

