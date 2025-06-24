'use client'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

import { useEffect, useState } from 'react'

const EventsCard = ({ event }: { event: any }) => {
  return (
    <Col md={3}>
      <Card className=" mb-4">
        <CardBody>
          <CardTitle className="text-xl font-semibold">{event.name}</CardTitle>
          <p>{event.description}</p>
        </CardBody>
        <CardFooter className="text-muted">
          <small>Created at: {new Date(event.created_at).toLocaleDateString()}</small>
        </CardFooter>
      </Card>
    </Col>
  )
}


const ActiveEvents = () => {


// pull events from the database:
// const supabase = await createClient()
const [events, setEvents] = useState<any[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch('/api/events')
    .then(res => res.json())
    .then(async(data) => {
      await setEvents(data || [])
      setLoading(false)
    })
}, [])

console.log('Events:', events)

if (loading) return <p>Loading...</p>

return (
  <Row>
    <Col md={10}></Col>
    <Col md={2}>
      {/* Add new Event button: */}
      <button className="btn btn-primary mb-3">Add New Event</button>
    </Col>
    {events.length > 0 ? (
      events.map((event) => <EventsCard key={event.id} event={event} />)
    ) : (
      <Col>
        <p>No active events found.</p>
      </Col>
    )}
  </Row>
  )
}

export default ActiveEvents
