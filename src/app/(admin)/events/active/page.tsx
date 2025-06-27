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
import Link from 'next/link'

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
    { title: 'Customer and Venue', content: {
      customer: event.customer,
      venue: event.venue
    } },
    { title: 'Event Details', content: {
      date: new Date(event.date).toLocaleDateString(),
      notes: event.notes
    } },
    { title: 'Timeline and Milestones', content: 'This section can include a timeline of the event, milestones achieved, or any other relevant information.' }
  ]

  const progress_width = (milestone: any) => {
    switch(milestone?.status) {
      case null:
        return '0%'
        break;
      case "in_progress":
        return '50%'
        break;
      case "confirmed":
        return '100%'
        break;
      default:
        return '0%';
    }
  }

  const progress_class = (milestone: any) => {
    switch(milestone?.status) {
      case null:
        return ''
        break;
      case "in_progress":
        return 'bg-warning'
        break;
      case "confirmed":
        return 'bg-success'
        break;
      default:
        return '';
    }
  }

  const progress = {
    "data": [
      {
        "label": "Venue",
        "status": null,
        "date": null
      },
      {
        "label": "Tasting",
        "status": null,
        "date": null
      },
       {
        "label": "Menu",
        "status": null,
        "date": null
      },
      {
        "label": "Quote",
        "status": null,
        "date": null
      },
      {
        "label": "Contract",
        "status": null,
        "date": null
      },
      {
        "label": "Invites",
        "status": null,
        "date": null
      },
      {
        "label": "Ingredients",
        "status": null,
        "date": null
      },
      {
        "label": "Production",
        "status": null,
        "date": null
      },
       {
        "label": "Delivery",
        "status": null,
        "date": null
      }
    ]
  }

  return (
    <Col md={3}>
      <Card className=" mb-4">
        <CardBody>
          <CardTitle className="text-xl font-semibold mb-2">{event.name}</CardTitle>
          <p className="text-muted mb-4">{event?.notes}</p>

          {/* Edit */}
          <Button variant="primary" type="button" onClick={toggle}>
            <IconifyIcon icon="bx-restaurant" fontSize='20' />
          </Button>
          <Modal show={isTrue} onHide={toggle} size='xl'> 
            <ModalHeader closeButton>
              <ModalTitle>{event.name}</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Row>
                <Card>
                  <CardBody>  
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                      <div>
                        <h4 className="fw-medium text-dark d-flex align-items-center gap-2">
                          #{event.id} <span className={`badge ${ event?.status === 'confirmed' ? 'bg-info-subtle text-info' : 'bg-success-subtle text-success' } px-2 py-1 fs-13` }>{ event?.status }</span>
                          <span className="border border-warning text-warning fs-13 px-2 py-1 rounded">In Progress</span>
                        </h4>
                        <p className="mb-0"> Order Details / #{event.id} - { event?.created_at }</p>

                      </div>
                      <div>
                        <Link href="" className="btn btn-outline-secondary">
                          Refund
                        </Link>
                        &nbsp;
                        <Link href="" className="btn btn-outline-secondary">
                          Return
                        </Link>
                        &nbsp;
                        <Link href="" className="btn btn-primary">
                          Update Event
                        </Link>
                        &nbsp;
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="fw-medium text-dark">Progress</h4>
                    </div>
                    <Row>
                      {
                      event?.progress?.data?.map((milestone, i)=> (
                          <Col key={i}>
                            <div className="progress mt-3" style={{ height: 10 }} >
                              
                              <div
                                className={`progress-bar progress-bar  progress-bar-striped progress-bar-animated ${progress_class(milestone) }`}
                                role="progressbar"
                                style={{ width: progress_width(milestone) }}
                                aria-valuenow={70}
                                aria-valuemin={0}
                                aria-valuemax={70}></div>
                            </div>
                            <small className='ms-1'>{ milestone?.label }</small>
                          </Col>
                        ))
                      }
                    </Row>
                  </CardBody>
                  <CardFooter className="d-flex flex-wrap align-items-center justify-content-between bg-light-subtle gap-2">
                    <p className="border rounded mb-0 px-2 py-1 bg-body">
                      <IconifyIcon icon="bx:arrow-from-left" className="align-middle fs-16" /> Estimated completion date :{' '}
                      <span className="text-dark fw-medium">{ event?.date }</span>
                    </p>
                    <div>
                      <Link href="" className="btn btn-primary">
                        Generate slip
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              </Row>
              <Row>
                <Accordion defaultActiveKey={'0'} id="accordionExample" alwaysOpen>
                  {accordion_data.map((item, idx) => (
                    <AccordionItem eventKey={`${idx}`} key={idx}>
                      <AccordionHeader id="headingOne">
                        <div className="fw-medium">{ item?.title }</div>
                      </AccordionHeader>
                      <AccordionBody>
                        {/* Customer and Venue */}
                        { idx === 0 && ( 
                          <Row>
                            <Col md={4}>
                              <Card className='card-dark'>
                                <CardBody>
                                  <CardTitle className="text-lg font-semibold mb-3">Customer</CardTitle>
                                  <div className="mb-0 row">
                                    <div className="col-12  d-flex flex-row ">
                                      <IconifyIcon icon="bx-user" fontSize='20' className="me-2" />
                                      <p>{event?.customer?.square_data?.customer?.givenName }</p>
                                    </div>
                                  </div>
                                  <div className="mb-2 row">
                                    <div className="col-12 d-flex flex-row align-items-center">
                                      <IconifyIcon icon="bx-envelope" fontSize='20' className="me-2" />
                                      <a href={`mailto:${event?.customer?.square_data?.customer?.emailAddress}`}>
                                        {event?.customer?.square_data?.customer?.emailAddress}
                                      </a>
                                    </div>
                                  </div>
                                  <div className="mb-2 row">
                                    <div className="col-12 d-flex flex-row align-items-center">
                                      <IconifyIcon icon="bx-phone" fontSize='20' className="me-2" />
                                      <a href={`tel:${event?.customer?.square_data?.customer?.address?.phoneNumber}`}>
                                        {event?.customer?.square_data?.customer?.address?.phoneNumber}
                                      </a>
         
                                    </div>
                                  </div>
                                  <div className="mb-2 row">
                                    <div className="col-12 d-flex flex-row">
                                      <IconifyIcon icon="bx-map" fontSize='20' className="me-2" />
                                      <p>
                                        {event?.customer?.square_data?.customer?.address?.addressLine1} <br/>
                                        {event?.customer?.square_data?.customer?.address?.addressLine2} 
                                        {event?.customer?.square_data?.customer?.address?.locality}, &nbsp;
                                        {event?.customer?.square_data?.customer?.address?.administrativeDistrictLevel1} <br/>
                                        {event?.customer?.square_data?.customer?.address?.postalCode} &nbsp;
                                        {event?.customer?.square_data?.customer?.address?.country}
                                      </p>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                            <Col md={8}>
                              <Card>
                                <CardBody>
                                  <CardTitle className="text-lg font-semibold mb-2">Venue</CardTitle>
                                  <Row>
                                    <Col md={6}>
                                      <div className="mb-0 row">
                                        <div className="col-12 d-flex flex-row align-items-center">
                                          <IconifyIcon icon="bx-building-house" fontSize='20' className="me-2" />
                                          <h4 className='mt-2'>{event?.venue?.name}</h4>
                                        </div>
                                      </div>
                                      <div className="mb-0 row">
                                        <div className="col-12 d-flex flex-row align-items-center">
                                          <IconifyIcon icon="bx-map" fontSize='20' className="me-2" />
                                          <p className='mt-2'>
                                            {event?.venue?.address} <br/>
                                            {event?.venue?.city}, {event?.venue?.state} {event?.venue?.zip}
                                          </p>
                                        </div>
                                      </div>
                                      <h5 className='mt-3 mb-3'>Contact Person</h5>
                                      <div className="row">
                                        <div className="col-12 d-flex flex-row ">
                                          <IconifyIcon icon="bx-user" fontSize='20' className="me-2" />
                                          <p>{event?.venue?.contact_name}</p>
                                        </div>
                                      </div>
                                      <div className="row mb-2">
                                        <div className="col-12 d-flex flex-row align-items-center">
                                          <IconifyIcon icon="bx-phone" fontSize='20' className="me-2" />
                                          <a href={`tel:${event?.venue?.contact_number}`}>
                                            {event?.venue?.contact_number}
                                          </a>
                                        </div>
                                      </div>
                                      <div className="row  mb-2">
                                        <div className="col-12 d-flex flex-row align-items-center">
                                          <IconifyIcon icon="bx-envelope" fontSize='20' className="me-2" />
                                          <a href={`mailto:${event?.venue?.contact_email}`}>
                                            {event?.venue?.contact_email}
                                          </a>
                                        </div>
                                      </div>
                                      <h5 className='mt-4'>Notes</h5>
                                      <div className="row mb-2">
                                        <div className="col-12 d-flex flex-row align-items-center">
                                          <IconifyIcon icon="bx-message-alt-detail" fontSize='20' className="me-2" />
                                          <p className='mt-2'>
                                            {event?.venue?.notes || 'No additional notes provided.'}
                                          </p>
                                        </div>
                                      </div>
                                    </Col>
                                    <Col md={6} className="text-end">
                                      <div className="mapouter">
                                        <div className="gmap_canvas">
                                          <iframe
                                            className="gmap_iframe rounded"
                                            width="100%"
                                            style={{ height: 418 }}
                                            frameBorder={0}
                                            scrolling="no"
                                            marginHeight={0}
                                            marginWidth={0}
                                            src={ `https://maps.google.com/maps?width=1980&height=400&hl=en&q=${ event?.venue?.address } ${ event?.venue?.city }, ${ event?.venue?.state } ${ event?.venue?.zip }&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
                                          />
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        )}

                        {/* Notes */}
                        { idx === 1 && (
                          <Row>
                            <Col md={6}>
                              <Card>
                                <CardBody>
                                  <CardTitle className="text-lg font-semibold mb-2">Notes</CardTitle>
                                  <p><strong>Date:</strong> {item?.content?.date}</p>
                                  <p><strong>Notes:</strong> {event?.notes}</p>
                                </CardBody>
                              </Card>
                            </Col>
                            <Col md={6}>
                              <Card>
                                <CardBody>
                                  <CardTitle className="text-lg font-semibold mb-2">Menu</CardTitle>
                                  
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        )}

                        {/* Timeline and Milestones */}
                        { idx === 2 && (
                          <Row>
                            <Col md={12}>
                              <Card>
                                <CardBody>
                                  <CardTitle className="text-lg font-semibold mb-2">Timeline and Milestones</CardTitle>
                                  <p>{item?.content}</p>
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
            <IconifyIcon icon="bx-trash" fontSize='20' />
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
