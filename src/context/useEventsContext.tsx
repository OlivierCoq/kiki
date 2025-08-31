'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { produce } from "immer"
const EventsContext = createContext<any>(null)  

export function EventsProvider({ children }: { children: React.ReactNode }) {


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

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prev =>
      produce(prev, draft => {
        const index = draft?.findIndex(e => e.id === updatedEvent?.id)
        if (index !== -1) draft[index] = updatedEvent
      })
    )
  }

  return (
    <EventsContext.Provider value={{ 
        events, 
        setEvents, 
        fetchEvents,
        venues,
        setVenues,
        fetchVenues,
        updateEvent
      }}>
      {children}
    </EventsContext.Provider>
  )
}


export const useEvents = () => useContext(EventsContext)

