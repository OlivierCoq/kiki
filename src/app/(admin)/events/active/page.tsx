'use client'
import useModal from '@/hooks/useModal'
import useToggle from '@/hooks/useToggle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { 
  Col, 
  Row } from 'react-bootstrap'

import { useEffect, useState } from 'react'
import Link from 'next/link'


//Events
import EventsCard from './components/EventsCard'

const ActiveEventsPage = () => {


// pull events from the database:
// const supabase = await createClient()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mainEvent, setMainEvent] = useState<any>(null)

  // Modals:
  const { isTrue, toggle } = useToggle()

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(async(data) => {
        await setEvents(data || [])
        setLoading(false)
      })
  }, [])

  console.log('Events:', events)


  return (
    <Row>
      <Col md={10}>
        <h3 className="mb-2">Active Events</h3>
        <p className="text-muted mb-4">Manage your active events here. You can view, edit, or delete events.</p>
      </Col>
      <Col md={2}>
        {/* Add new Event button: */}
        <button className="btn btn-primary mb-3">Add New Event</button>
      </Col>
      <Col md={12}>

          {(events.length > 0) && !loading ? (
            events.map((event) => event.active && ( <EventsCard key={event.id} event={event} /> ))
          ) : (
            <Col>
              <p>{ loading ? 'Loading ...' : 'No active events found.' }</p>
            </Col>
          )}

      </Col>
    </Row>
  )
}

export default ActiveEventsPage
