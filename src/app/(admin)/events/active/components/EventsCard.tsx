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

// Progress
import ProgressVenue from '../components/progress/venue'
import ProgressTasting from '../components/progress/tasting'
import ProgressMenu from '../components/progress/menu'
import ProgressQuote from '../components/progress/quote'
import ProgressContract from '../components/progress/contract'
import ProgressInvites from '../components/progress/invites'
import ProgressIngredients from '../components/progress/ingredients'
import ProgressProduction from '../components/progress/production'
import ProgressDelivery from '../components/progress/delivery'



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

  console.log('Event', event)


  // Progress
  const [progress_obj, set_progress_obj] = useState({
    venue: true,
    tasting: false,
    menu: false,
    quote: false,
    contract: false,
    invites: false,
    ingredients: false,
    production: false,
    delivery: false
  })
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
  const toggleProgress = (key: keyof typeof progress_obj) => {
    set_progress_obj(prev => {
      const allFalse = Object.keys(prev).reduce((acc, k) => {
        acc[k as keyof typeof progress_obj] = false
        return acc
      }, {} as typeof progress_obj)
  
      // If already selected, toggle off (set all false), else set only this one to true
      const isAlreadyTrue = prev[key]
      return isAlreadyTrue
        ? allFalse
        : { ...allFalse, [key]: true }
    })
  }
  const progress = {
    "data": [
      {
        "label": "Venue",
        "status": null,
        "date": null,
        "action": "update_venue"
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

  // Edit handlers

    //Customer
  const [customer, updateCustomer ] = useState<any>(event?.customer)
  const [editingCustomer, toggleEditCustomer ] = useState<boolean>(false)
  const toggleCustomerEdit = () => {
    toggleEditCustomer(!editingCustomer)
  }
  const editCustomer = async () => {

    // Update square in backend:
    toggleCustomerEdit()
  }
    // Notes
  const [newNotes, setNewNotes] = useState(event.notes || '')
  const [editNotes, toggleEditNotes] = useState<boolean>(false)
  const toggleNotesEdit = () => {
    toggleEditNotes(!editNotes)
  }
  const editEventNotes = async () => {
    // console.log('neeewwwww', newNotes)

    const res = await fetch(`/api/events/${event?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes: newNotes })
    })

    const data = await res.json()
    toggleNotesEdit()
  }

  return (
    <Col md={3}>
      <Card className=" mb-4">
        <CardBody>
          <CardTitle className="text-xl font-semibold mb-2">{event.name}</CardTitle>
          {/* <p className="text-muted mb-4">{event?.notes}</p> */}

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
                    <Row className='mb-4'>
                      <Col>
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                          <div>
                            <h4 className="fw-medium text-dark d-flex align-items-center gap-2">
                              #{event.id} <span className={`badge ${ event?.status === 'confirmed' ? 'bg-info-subtle text-info' : 'bg-success-subtle text-success' } px-2 py-1 fs-13` }>{ event?.status }</span>
                              <span className="border border-warning text-warning fs-13 px-2 py-1 rounded">In Progress</span>
                            </h4>
                            <p className="mb-0"> Order Details / #{event.id} - { event?.created_at }</p>

                          </div>
                          <div>
                            <Link href="" className="btn btn-outline-secondary me-1">
                              Refund
                            </Link>
                            &nbsp;
                            <Link href="" className="btn btn-outline-secondary me-1">
                              Return
                            </Link>
                            &nbsp;
                            <Link href="" className="btn btn-primary">
                              Update Event
                            </Link>
                            &nbsp;
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                        {/* Customer */}
                      <Col md={4} className='h-auto'>
                        <Card className='bg-light h-100'>
                          <CardBody>
                            <CardTitle className="text-lg font-semibold mb-2">
                              Customer &nbsp;
                              <IconifyIcon icon="bx-edit" fontSize='20' className="me-2 text-primary cursor-hover" />
                            </CardTitle>
                            <div className="d-flex flex-column">
                              <div className="mb-0 row">
                                <div className="col-12  d-flex flex-row ">
                                  <IconifyIcon icon="bx-user" fontSize='20' className="me-2" />
                                  <p>{event?.customer?.square_data?.customer?.givenName }</p>
                                </div>
                                <div className="col-12 d-flex flex-row align-items-center mb-2">
                                  <IconifyIcon icon="bx-envelope" fontSize='20' className="me-2" />
                                  <a href={`mailto:${event?.customer?.square_data?.customer?.emailAddress}`}>
                                    {event?.customer?.square_data?.customer?.emailAddress}
                                  </a>
                                </div>
                                <div className="col-12 d-flex flex-row align-items-center mb-2">
                                  <IconifyIcon icon="bx-phone" fontSize='20' className="me-2" />
                                  <a href={`tel:${event?.customer?.square_data?.customer?.address?.phoneNumber}`}>
                                    {event?.customer?.square_data?.customer?.address?.phoneNumber}
                                  </a>
                                </div>
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
                            </div>
                            
                            
                          </CardBody>
                          <CardFooter>

                          </CardFooter>
                        </Card>
                      </Col>
                      {/* Notes */}
                      <Col md={4} className='h-auto'>
                        <Card className='bg-light h-100'>
                          <CardBody>
                            <CardTitle className="text-lg font-semibold mb-2">
                              Notes &nbsp;
                              <IconifyIcon icon="bx-edit" fontSize='20' className="me-2 text-primary cursor-hover" onClick={toggleNotesEdit} />
                            </CardTitle>
                            {
                            editNotes ? 
                              
                              <div className='d-flex flex-column justify-content-end align-items-end'>
                                <textarea className='form-control' value={newNotes} rows={10} onChange={e => setNewNotes(e.target.value)}></textarea>
                                <button className='rounded btn' onClick={editEventNotes}>
                                  <IconifyIcon icon="bx-check" fontSize='20' className='text-success cursor-hover' />
                                </button>
                              </div>
                              : <p>{ newNotes }</p>
                            }
                            
                          </CardBody>
                          <CardFooter>

                          </CardFooter>
                        </Card>
                      </Col>
                      {/* Order Summary/Estimate */}
                      <Col md={4} className='h-auto'>
                        <Card className='bg-light h-100'>
                          <CardBody>
                            <CardTitle className="text-lg font-semibold mb-2">Order Summary</CardTitle>
                          </CardBody>
                          <CardFooter>

                          </CardFooter>
                        </Card>
                      </Col>
                    </Row>
                    <div className="mt-4">
                      <h4 className="fw-medium text-dark">Progress</h4>
                    </div>
                    <Row>
                      {
                      event?.progress?.data?.map((milestone: any, i: number)=> (
                          <Col key={i} className='cursor-pointer' onClick={() => toggleProgress(milestone?.label?.toLowerCase())}>
                            <div className="progress mt-3" style={{ height: 10 }} >
                              
                              <div
                                className={`progress-bar progress-bar progress-bar-striped progress-bar-animated ${progress_class(milestone) }`}
                                role="progressbar"
                                style={{ width: progress_width(milestone) }}
                                aria-valuenow={70}
                                aria-valuemin={0}
                                aria-valuemax={70}></div>
                            </div>
                            <small className='ms-1 cursor-pointer'>{ milestone?.label }</small>
                          </Col>
                        ))
                      }
                    </Row>
                    <Row>
                      <Col>
                        { progress_obj?.venue && (
                          <ProgressVenue event={event} />
                        )}
                        { progress_obj?.tasting && (
                          <ProgressTasting event={event} />
                        )}
                        { progress_obj?.menu && (
                          <ProgressMenu event={event} />
                        )}
                        { progress_obj?.quote && (
                          <ProgressQuote event={event} />
                        )}
                        { progress_obj?.contract && (
                          <ProgressContract event={event} />
                        )}
                        { progress_obj?.invites && (
                          <ProgressInvites event={event} />
                        )}
                        { progress_obj?.ingredients && (
                          <ProgressIngredients event={event} />
                        )}
                        { progress_obj?.production && (
                          <ProgressProduction event={event} />
                        )}
                        { progress_obj?.delivery && (
                          <ProgressDelivery event={event} />
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                  
                </Card>
              </Row>
              
            </ModalBody>
            <ModalFooter>
              <div className="d-flex flex-wrap align-items-center justify-content-between  gap-2 mx-3 rounded">
                <p className="border rounded mb-0 px-2 py-1 bg-body">
                  <IconifyIcon icon="bx:arrow-from-left" className="align-middle fs-16" /> Estimated completion date :{' '}
                  <span className="text-dark fw-medium">{ event?.date }</span>
                </p>
                <div>
                  <Link href="" className="btn btn-primary">
                    Generate slip
                  </Link>
                </div>
              </div>
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

export default EventsCard
