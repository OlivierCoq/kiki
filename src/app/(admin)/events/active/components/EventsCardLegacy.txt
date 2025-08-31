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

// UI 
import formatText from '@/helpers/FormatText'
import formatCurrency from '@/helpers/FormatCurrency'
import updateNestedValue from '@/helpers/NestedFields'

// Progress
import ProgressVenue from './progress/venue'
import ProgressTasting from './progress/tasting'
import ProgressMenu from './progress/menu'
import ProgressQuote from './progress/quote'
import ProgressContract from './progress/contract'
import ProgressInvites from './progress/invites'
import ProgressIngredients from './progress/ingredients'
import ProgressProduction from './progress/production'
import ProgressDelivery from './progress/delivery'



// Add both onDelete and event props:

export interface EventsCardProps {
  event: any;
  onUpdate: (event: Event) => void
  onDelete: () => void; // Callback function to handle deletion
}
const EventsCard = ({ event, onDelete = () => {} }: EventsCardProps) => {


  // Modal toggle
  const { isTrue, toggle } = useToggle()


  const [deleteEvent, setDeleteEvent] = useState<boolean>(false)
  const toggleDelete = () => {
    setDeleteEvent(!deleteEvent)
  }
  
  const updateEvent = async (event: Event) => {
     console.log('send this to the db: ', event)

  }

  // UI
  const time_convert = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const convertedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${convertedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } 

  // console.log('Event', event)
  // console.log('Event summary default parent', event?.summary?.production?.items[0])

  // Progress
  const [progress_obj, set_progress_obj] = useState({
    venue: true,
    // tasting: false,
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
  const [customer, updateCustomer ] = useState(
    event?.customer?.square_data?.customer || {}
  )
  const [editingCustomer, toggleEditCustomer ] = useState<boolean>(false)
  const toggleCustomerEdit = () => { toggleEditCustomer(!editingCustomer) }
  const updateNestedField = (key: any, value: any) => {
    updateCustomer((prev: any) => ({
      ...prev,
      address: {
        ...prev.address,
        [key]: value 
      }
    }))
  }
  const [customerPosting, toggleCustomerPosting] = useState<boolean>(false)
  const toggleCustomer = () => { toggleCustomerPosting(!customerPosting) }
  const editCustomer = async () => {

    await toggleCustomerPosting(true)
    let kiki_customer = event?.customer 
    kiki_customer.square_data = {customer}

    const res = await fetch(`/api/customers/${event?.customer?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ kiki_customer, square_customer: customer })
    })

    

    const data = await res.json()
    // console.log('resuklt', data)
    await toggleCustomerPosting(false)

    // Update square in backend:
    toggleCustomerEdit()
  }

    // Notes
  const [newNotes, setNewNotes] = useState(event.notes || '')
  const [editNotes, toggleEditNotes] = useState<boolean>(false)
  const toggleNotesEdit = () => { toggleEditNotes(!editNotes) }
  const editEventNotes = async () => {
    // console.log('neeewwwww', newNotes)
    console.log('editEventNotes')
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

  // Summary handlers
  const [summary, setSummary] = useState(event?.summary || {})
  const [editSummary, toggleEditSummary ] = useState<boolean>(false)
  const [summaryPosting, toggleSummaryPosting] = useState<boolean>(false)
  const toggleSummary = () => { toggleSummaryPosting(!summaryPosting) }
  const toggleSummaryEdit = () => { toggleEditSummary(!editSummary) }

  const update_total_cost = (summary: any) => {

    
  }

  const editEventSummary = async () => {
    console.log('editEventSummary')
    await toggleSummaryPosting(true)



    const res = await fetch(`/api/events/update/${event?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ summary })
    })


    // Update total cost

    // update revenue

    // update profit


    const data = await res.json()
    console.log('updated event', data)
    await toggleSummaryPosting(false)
    toggleSummaryEdit()
    // return data
  }

  const updateEventSummary = async (summary: any) => {

    // console.log('Patch here')

    const res = await fetch(`/api/events/update/${event?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ summary })
    })

    const data = await res.json()
    setSummary(data?.event?.summary)
    return data?.event?.summary
    // console.log('updated event', data)
  }

  return (
    <Col md={3} className='fade-in'>
      <Card className="h-full" style={{ height: '14rem' }}>
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
                          {/* <div>
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
                          </div> */}
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
                              <a href="#" className="text-primary cursor-hover" onClick={toggleCustomerEdit}>
                                <IconifyIcon icon="bx-edit" fontSize='20' className="me-2 text-primary cursor-hover" />
                              </a>
                            </CardTitle>

                            {
                              !editingCustomer ? 

                              <div className="d-flex flex-column">
                                <div className="mb-0 row">
                                  <div className="col-12  d-flex flex-row ">
                                    <IconifyIcon icon="bx-user" fontSize='20' className="me-2" />
                                    <p>{customer?.givenName }</p> &nbsp;
                                    <p>{customer?.familyName }</p>
                                  </div>
                                  <div className="col-12 d-flex flex-row align-items-center mb-2">
                                    <IconifyIcon icon="bx-envelope" fontSize='20' className="me-2" />
                                    <a href={`mailto:${customer?.emailAddress}`}>
                                      {customer?.emailAddress}
                                    </a>
                                  </div>
                                  <div className="col-12 d-flex flex-row align-items-center mb-2">
                                    <IconifyIcon icon="bx-phone" fontSize='20' className="me-2" />
                                    <a href={`tel:${customer?.phoneNumber}`}>
                                      {customer?.phoneNumber}
                                    </a>
                                  </div>
                                  <div className="col-12 d-flex flex-row">
                                    <IconifyIcon icon="bx-map" fontSize='20' className="me-2" />
                                    <p>
                                      {customer?.address?.addressLine1} <br/>
                                      {customer?.address?.addressLine2} <br/>
                                      {customer?.address?.locality}, &nbsp;
                                      {customer?.address?.administrativeDistrictLevel1} <br/>
                                      {customer?.address?.postalCode} &nbsp;  
                                      {customer?.address?.country}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              : 

                              <div className="d-flex flex-column fade-in">
                                <Row>
                                  <Col>
                                    <div className="d-flex flex-row align-items-center mb-1">
                                      <IconifyIcon icon="bx-user" fontSize='20' className="me-2" />
                                      <Col className='me-1'>
                                        <input type="text" 
                                          className='form-control' value={ customer?.givenName || ''} 
                                          onChange={(e) => updateCustomer({ ...customer, givenName: e.target.value }) } />
                                      </Col>
                                      <Col>
                                        <input type="text" 
                                          className='form-control' value={ customer?.familyName || ''} 
                                          onChange={(e) => updateCustomer({ ...customer, familyName: e.target.value }) } />
                                      </Col>
                                    </div>
                                    <div className="d-flex flex-row align-items-center mb-1">
                                      <IconifyIcon icon="bx-envelope" fontSize='20' className="me-2" />
                                      <input type="text" 
                                        className='form-control' value={ customer?.emailAddress || ''} 
                                        onChange={(e) => updateCustomer({ ...customer, emailAddress: e.target.value }) } />
                                    </div>
                                    <div className="d-flex flex-row align-items-center mb-1">
                                      <IconifyIcon icon="bx-phone" fontSize='20' className="me-2" />
                                      <input type="text" 
                                        className='form-control' value={ customer?.phoneNumber || ''} 
                                        onChange={(e) => updateCustomer({ ...customer, phoneNumber: e.target.value }) } />
                                    </div>
                                    <div className="d-flex flex-row align-items-center mb-1">
                                      <IconifyIcon icon="bx-map" fontSize='20' className="me-2" />
                                      <div className="d-flex flex-column w-auto">
                                        <input type="text" 
                                          style={{width: '15rem'}}
                                          className='form-control ms-2' value={ customer?.address?.addressLine1 || ''} 
                                          onChange={(e) => updateNestedField('addressLine1', e.target.value) } />
                                        <input type="text" 
                                          style={{width: '15rem'}}
                                          className='form-control ms-2' value={ customer?.address?.addressLine2 || ''} 
                                          onChange={(e) => updateNestedField('addressLine2', e.target.value) } />
                                        <div className="w-full d-flex flex-row align-items-center justify-content-center">
                                          <input type="text"  
                                            style={{width: '10rem'}}
                                            className='form-control ms-2' value={ customer?.address?.locality || ''} 
                                            onChange={(e) => updateNestedField('locality', e.target.value) } />
                                          <input type="text" 
                                            style={{width: '5rem'}}
                                            className='form-control' value={ customer?.address?.administrativeDistrictLevel1 || ''} 
                                            onChange={(e) => updateNestedField('administrativeDistrictLevel1', e.target.value) } />
                                        </div>
                                        <div className="w-full d-flex flex-row align-items-start justify-content-start">
                                          <input type="text" 
                                            style={{width: '5rem'}}
                                            className='form-control ms-2' value={ customer?.address?.postalCode || ''} 
                                            onChange={(e) => updateNestedField('postalCode', e.target.value) } />
                                          <input type="text" 
                                            style={{width: '4rem'}}
                                            className='form-control' value={ customer?.address?.country || ''} 
                                            onChange={(e) => updateNestedField('country', e.target.value) } />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="d-flex flex-row  justify-content-end align-items-end">
                                      { 
                                        customerPosting ? <IconifyIcon fontSize='10' icon="mdi:loading" className="spinner-border text-primary text-sm" />
                                        :

                                        <button className='rounded btn' onClick={editCustomer}>
                                          <IconifyIcon icon="bx-check" fontSize='20' className='text-success cursor-hover' />
                                        </button>
                                      }
                                      
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            }
                            
                            
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
                              Details
                            </CardTitle>
                            <p className='mb-1'>Time</p>
                            <div className='d-flex flex-row align-items-center mb-2'>
                              <IconifyIcon icon="bx-calendar" fontSize='20' className="me-2" />
                              <p className='mb-0'>Date: { event?.date }</p>
                            </div>
                            {/* Start and end time: */}
                            <div className='d-flex flex-row align-items-center mb-2'>
                              <IconifyIcon icon="bx-time" fontSize='20' className="me-2" />
                              <p className='mb-0'>Start: { time_convert(event?.start_time) } - End: { time_convert(event?.end_time) }</p>
                            </div>
                            
                            <div className='d-flex flex-row align-items-center mt-4 mb-1'>
                              <p className='mb-0'>Notes &nbsp;</p>
                              <a href="#" className="text-primary cursor-hover" onClick={toggleNotesEdit}>
                                <IconifyIcon icon="bx-edit" fontSize='20' className="me-2 text-primary cursor-hover" />
                              </a>
                            </div>
                            {
                            editNotes ? 
                              
                              <div className='d-flex flex-column justify-content-end align-items-end fade-in'>
                                <textarea className='form-control' value={newNotes} rows={10} onChange={e => setNewNotes(e.target.value)}></textarea>
                                <button className='rounded btn' onClick={editEventNotes}>
                                  <IconifyIcon icon="bx-check" fontSize='20' className='text-success cursor-hover' />
                                </button>
                              </div>
                              : <div dangerouslySetInnerHTML={{ __html: formatText(newNotes) }}></div>
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
                            <CardTitle className="text-lg font-semibold mb-2">
                              Summary &nbsp;
                              <a href="#" className="text-primary cursor-hover" onClick={toggleSummaryEdit}>
                                <IconifyIcon icon="bx-edit" fontSize='20' className="me-2 text-primary cursor-hover" />
                              </a>
                            </CardTitle>
                            
                            { !editSummary && 
                              <div className='fade-in'>
                                <Row className='mb-3'>
                                  <Col>
                                    <h5 className='mb-1'>Total Guests</h5>
                                    <p className='mb-0'>{ summary?.production?.total_guests }</p>
                                  </Col>
                                  <Col>
                                    <h5 className='mb-1'>Total Cost</h5>
                                    <p className='mb-0'>{ formatCurrency(event?.default_currency, summary?.total_cost) }</p>
                                  </Col>
                                  {/* <Col>
                                    <h5 className='mb-1'>Price per Person</h5>
                                    <p className='mb-0'>{ formatCurrency(summary?.production?.price_per_person) }</p>
                                   
                                  </Col> */} 
                                </Row>
                                <Row className='mb-3'>
                                  
                                  <Col>
                                    <h5 className='mb-1'>Total Revenue</h5>
                                    <p className='mb-0'>{ formatCurrency(event?.default_currency, summary?.total_revenue) }</p>
                                  </Col>
                                  {/* <Col>
                                    <h5 className='mb-1'>Total Profit</h5>
                                    <p className='mb-0'>{ formatCurrency(summary?.total_profit) }</p>
                                  </Col> */}
                                </Row>
                              </div>
                            }

                            {
                              editSummary && 
                              <div>
                                <Row>
                                  <Col className='me-1 mb-2 p-0'>
                                    <label htmlFor="total_guests">Total Guests</label>
                                    {/* onChange={(e) => { updateNestedValue('start_time', e.target.value, setNewEvent) }} */}
                                    <input type="number" id="total_guests" className="form-control" defaultValue={summary?.production?.total_guests} 
                                      onChange={(e) => { updateNestedValue('production.total_guests', e.target.value, setSummary) }}
                                    />
                                  </Col>
                                  <Col className='m-0 p-0'>
                                    {/* <label htmlFor="price_per_person">Price per Person</label>
                                    <input type="number" disabled id="price_per_person" className="form-control" defaultValue={summary?.production?.price_per_person} /> */}
                                    <label htmlFor="total_cost">Total Cost</label>
                                    <input type="number" disabled id="total_cost" className="form-control" defaultValue={summary?.total_cost} />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col className='me-1 mb-2 p-0'>
                                    <label htmlFor="total_revenue">Total Revenue</label>
                                    <input type="number" disabled id="total_revenue" className="form-control" defaultValue={summary?.total_revenue} />
                                  </Col>
                                  <Col className='m-0 p-0'>
                                    
                                  </Col>
                                </Row>
                                <Row className='mb-3'>
                                  <Col md={6}></Col>
                                  <Col md={6}>
                                    <div className="d-flex fex-row justify-content-end">

                                      { 
                                        summaryPosting ? <IconifyIcon fontSize='10' icon="mdi:loading" className="spinner-border text-primary text-sm" />
                                        :

                                        <button className='rounded btn' onClick={editEventSummary}>
                                          <IconifyIcon icon="bx-check" fontSize='20' className='text-success cursor-hover' />
                                        </button>
                                      }
                                    </div>
                                  </Col>
                                </Row>  
                                <Row className='mb-3'>
                                  <Col>
                                    <h5 className='mb-1'>Total Profit</h5>
                                    <p className='mb-0'>{ formatCurrency(event?.default_currency, event?.summary?.total_profit) }</p>
                                  </Col>
                                </Row>
                              </div> 
                            }
                            
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
      
                        { progress_obj?.menu && (
                          <ProgressMenu event={event} onUpdateEvent={updateEvent} parentData={() => {
                            return true
                          }} />
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
                    Deliver
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
                fetch('/api/events/delete', {
                  method: 'DELETE',
                  body: JSON.stringify({ id: event.id }),
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).then(() => {
                  // Optionally, you can add a callback to refresh the events list in the parent component
                  if (onDelete) onDelete() // Call the onDelete prop to notify parent
                  console.log('Event deleted successfully')
                  toggleDelete()
                }).catch((error) => {
                  console.error('Error deleting event:', error)
                })
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
