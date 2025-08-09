'use client'
import useModal from '@/hooks/useModal'
import useToggle from '@/hooks/useToggle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { 
  Col, 
  Row 
} from 'react-bootstrap'

import { useEffect, useState } from 'react'
import Link from 'next/link'


//Events
import { useEvents } from '@/context/useEventsContext'
import EventsCard from './components/EventsCard'
import { Event, Venue, ProgressEventStep, VenueImage } from '@/types/event'

import { NewEventInterface } from './components/NewEventInterface'
import DropzoneFormInput from '@/components/form/DropzoneFormInput'


const ActiveEventsPage = () => {

 
// pull events from the database:
// const supabase = await createClient()
  // const [events, setEvents] = useState<any[]>([])
  const { events, fetchEvents } = useEvents()
  const [loading, setLoading] = useState(!events || events.length === 0) // Set loading to true if events is null or empty
  const [mainEvent, setMainEvent] = useState<any>(null)




  // Modals:
  const { isTrue, toggle } = useToggle()

  useEffect(() => {
    if (!events) {
      fetchEvents().then(() => {
        setLoading(false) // Set loading to false after fetching events
      }).catch((error:any ) => {
        console.error('Error fetching events:', error)
        setLoading(false) // Set loading to false even if there's an error
      })
    } else { setLoading(false) }
  }, [])

  console.log('Events:', events)

  const handleNewEvent = (ev: any) => {
    console.log('New event created', ev)
    // Ensure the return value matches the expected shape
    // events?.push(ev) // Add the new event to the existing events array
    // setMainEvent(ev)
    // Optionally, you can also refresh the events list from the database
    fetchEvents()  
    return {
      name: ev?.name,
      created_at: new Date().toISOString(),
      date: ev?.date,
      start_time: ev?.start_time,
      end_time: ev?.end_time,
      venue: ev?.venue,
      customer: ev?.customer,
      menu: ev?.menu,
      notes: ev?.notes,
      status: ev?.status,
    }
  }


  return (
    <Row>
      <Col md={10}>
        <h3 className="mb-2">Active Events</h3>
        <p className="text-muted mb-4">Manage your active events here. You can view, edit, or delete events.</p>
      </Col>
      <NewEventInterface onNewEvent={handleNewEvent} /> 
      <Col md={12}>
        <Row>
        {(events?.length > 0) && !loading ? (
            events?.map((event: Event) => event.active && ( <EventsCard key={event.id} event={event} /> ))
          ) : (
            <Col>
              <p>{ loading ? 'Loading ...' : 'No active events found.' }</p>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  )
}

export default ActiveEventsPage
