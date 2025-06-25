'use client'
import useModal from '@/hooks/useModal'
import useToggle from '@/hooks/useToggle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { 
  Card, 
  CardBody, 
  CardFooter, 
  CardTitle, 
  Col, 
  Row, 
  Button, 
  Modal, 
  ModalBody, 
  ModalFooter, 
  ModalHeader, 
  ModalTitle,  
  Accordion, 
  AccordionBody,
  AccordionHeader, 
  AccordionItem } from 'react-bootstrap'

import { useEffect, useState } from 'react'

const EventsCard = ({ event }: { event: any }) => {

  // Modal toggle
  const { isTrue, toggle } = useToggle()

  const [mainEvent, setMainEvent] = useState<any>(null)
  const toggleMainEvent = (event: any) => {
    setMainEvent(event)
    toggle()
  }
  const [deleteEvent, setDeleteEvent] = useState<boolean>(false)
  const toggleDelete = () => {
    setDeleteEvent(!deleteEvent)
  }

  const accordion_data = [
    { title: 'Customer and Venue data', content: {
      customer: event.customer,
      venue: event.venue
    } },
    { title: 'Event Details', content: {
      date: new Date(event.date).toLocaleDateString(),
      notes: event.notes
    } },
    { title: 'Notes', content: event.notes },
    { title: 'Timeline and Milestones', content: 'This section can include a timeline of the event, milestones achieved, or any other relevant information.' }
  ]


  return (
    <Col md={3}>
      <Card className=" mb-4">
        <CardBody>
          <CardTitle className="text-xl font-semibold mb-2">{event.name}</CardTitle>
          <p className="text-muted mb-4">{event?.notes}</p>

          {/* Edit */}
          <Button variant="primary" type="button" onClick={toggle}>
            <IconifyIcon icon="bx-restaurant" fontSize='xl' />
          </Button>
          <Modal show={isTrue} onHide={toggle} size='xl'> 
            <ModalHeader closeButton>
              <ModalTitle>{event.name}</ModalTitle>
            </ModalHeader>
            <ModalBody>
              {/* <p><strong>Notes:</strong> {event.notes}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Customer:</strong> {event.customer?.name || 'N/A'}</p>
              <p><strong>Venue:</strong> {event.venue?.name || 'N/A'}</p> */}
              <Row>
                <Accordion defaultActiveKey={'0'} id="accordionExample" alwaysOpen>
                  {accordion_data.map((item, idx) => (
                    <AccordionItem eventKey={`${idx}`} key={idx}>
                      <AccordionHeader id="headingOne">
                        <div className="fw-medium">{ item?.title }</div>
                      </AccordionHeader>
                      <AccordionBody>
                        { idx === 0 && ( 
                          <Row>
                            <Col md={4}>
                              <Card>
                                <CardBody>
                                  <CardTitle className="text-lg font-semibold mb-2">Customer</CardTitle>
                                  <div className="mb-2 row">
                                    <div className="col-12">
                                      <input 
                                        id="customer_name" 
                                        name="customer_name" 
                                        type="text" 
                                        className="form-control" 
                                        placeholder='Customer Name'
                                        value={event?.customer?.square_data?.customer?.givenName} required 
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-2 row">
                                    <div className="col-12">
                                      <input
                                        id="customer_email"
                                        name="customer_email"
                                        type="email"
                                        className="form-control"
                                        placeholder='Customer Email'
                                        value={event?.customer?.square_data?.customer?.emailAddress} required
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-2 row">
                                    <div className="col-12">
                                      <input
                                        id="customer_phone"
                                        name="customer_phone"
                                        type="text"
                                        className="form-control"
                                        placeholder='Customer Phone'
                                        value={event?.customer?.square_data?.customer?.phoneNumber} required
                                      />
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                            <Col md={8}>
                              <Card>
                                <CardBody>
                                  <CardTitle className="text-lg font-semibold mb-2">Venue</CardTitle>
                                  
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        )}
                      </AccordionBody>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={toggle}>
                Close
              </Button>
            </ModalFooter>
          </Modal>


          {/* Delete */}
          <Button variant="secondary" type="button" className="ms-2" onClick={toggleDelete}>
            <IconifyIcon icon="bx-trash" fontSize='xl' />
          </Button>
          <Modal show={deleteEvent} onHide={toggleDelete}>
            <ModalHeader closeButton>
              <ModalTitle>Delete Event</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this event?</p>
              <p><strong>{event.name}</strong></p>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={toggleDelete}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => {
                // Handle delete logic here
                console.log('Deleting event:', event.id)
                toggleDelete()
              }}>
                Delete
              </Button>
            </ModalFooter>
          </Modal>

        </CardBody>
        <CardFooter className="text-muted">
          <small>Created at: {new Date(event.created_at).toLocaleDateString()}</small>
        </CardFooter>
      </Card>
    </Col>
  )
}


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
