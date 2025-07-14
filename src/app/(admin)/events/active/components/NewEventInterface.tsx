'use client'
import useModal from '@/hooks/useModal'
import useToggle from '@/hooks/useToggle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { 
  Col, 
  Row,
  Modal
} from 'react-bootstrap'

import { useEffect, useState } from 'react'
import Link from 'next/link'



//Events
import EventsCard from '../components/EventsCard'
// import { Event, Venue, ProgressEventStep, VenueImage } from '@/types/event'
import { Event, Venue, ProgressEventStep, VenueImage } from '@/types/event'

// Form UI
import { USStates } from '@/assets/data/us-states'
import { worldCountries } from '@/assets/data/world-countries'
import ChoicesFormInput from '@/components/form/ChoicesFormInput'

// Fetch customers
import { useCustomers } from '@/context/useCustomersContext'
import { set } from 'react-hook-form'


interface NewEventInterfaceProps {
  onNewEvent: (event: any) => {
    name?: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    venue?: number;
    customer?: number;
    menu?: number;
    notes?: string;
    status?: string;
  }
  
}

export const NewEventInterface = ({ onNewEvent }: NewEventInterfaceProps) => {

  // State
  const [loading, setLoading] = useState(true)
  const [mainEvent, setMainEvent] = useState<Event | null>(null)
  const [ showModal, setShowModal ] = useState(false)
  const toggleModal = () => { setShowModal(!showModal) }

  // Fetch customers
  const { customers, fetchCustomers } = useCustomers()
  useEffect(() => {
    if (!customers) {
      fetchCustomers()
      setLoading(false)
      
    } else { 
      console.log('customers fetched:', customers)
      setLoading(false) 
    }
  }, [customers, fetchCustomers])

  let progress = [
    {
        "label": "Venue",
        "status": "confirmed",
        "date": null
    },
    {
        "label": "Tasting",
        "status": "in_progress",
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


  const [ newEvent, setNewEvent ] = useState<Event>({
    active: true,
    created_at: '',
    customer: {
      created_at: '',
      email: '',
      id: 2,
      square_data: {
        customer: {
          created_at: '',
          creationSource: 'THIRD_PARTY',
          emailAddress: '',
          phoneNumber: '',
          givenName: '',
          familyName: '',
          id: '2',
          address: {
            addressLine1: '',
            addressLine2: '',
            administrativeDistrictLevel1: '',
            administrativeDistrictLevel2: '',
            country: 'US',
            locality: '',
            postalCode: ''
          },
          preferences: {
            emailUnsubscribed: false
          },
          updatedAt: ''
        }
      },
      user: ''
    },
    date: '',
    end_time: '',
    id: 0,
    menu: {
      id: 0,
      archived: false,
      created_at: new Date().toISOString(),
      description: '',
      dishes: [] as string[],
      is_public: true,
      name: '',
      packages: {
        data: [] as number[]
      },
      price_per_person: 0,
      tags: [] as string[]
    },
    name: '',
    notes: '',
    progress: {
      data: [] as ProgressEventStep[]
    },
    start_time: '',
    status: '',
    venue: {
      id: 0,
      address: '',
      archived: false,
      capacity: 0,
      country: '',
      city: '',
      contact_email: '',
      contact_name: '',
      contact_number: '',
      images: [] as VenueImage[] | null,
      name: '',
      notes: '',
      tags: [] as string[] | null,
      zip: '',
      state: ''
    } as Venue
  })
  const [ newEventObj, setNewEventObj ] = useState<any>({
    active: true,
    customer: newEvent?.customer?.id,
    date: newEvent?.date,
    end_time: newEvent?.end_time,
    menu: newEvent?.menu?.id,
    name: newEvent?.name,
    notes: newEvent?.notes,
    progress: {
      data: progress
    },
    start_time: newEvent?.start_time,
    status: newEvent?.status,
    venue: newEvent?.venue?.id
  })


  // Handlers & helpers
  const submitNewEvent = async () => {

    console.log('Submitting new event:', newEvent)
    onNewEvent(newEventObj)
  }
    // Customers
  const [newCustomer, setNewCustomer] = useState(false)
  const toggleNewCustomer = () => { setNewCustomer(!newCustomer)}
  const updateNestedField = (field: string, value: string) => {
    setNewEvent((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        square_data: {
          ...prev.customer.square_data,
          customer: {
            ...prev.customer.square_data.customer,
            address: {
              ...prev.customer.square_data.customer.address,
              [field]: value
            }
          }
        }
      }
    }))
  }
  const updateCustomer = (customer: any) => {
    setNewEvent((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        square_data: {
          ...prev.customer.square_data,
          customer: {
            ...prev.customer.square_data.customer,
            givenName: customer.givenName,
            familyName: customer.familyName,
            phoneNumber: customer.phoneNumber,
            emailAddress: customer.emailAddress
          }
        }
      }
    }))
  }
  const [customerValidStatus, setCustomerValidStatus] = useState(true)
  const [postingNewCustomer, setPostingNewCustomer] = useState(false)
  const addNewCustomer = async () => {
    // validate customer data
    if (
        !newEvent?.customer?.square_data?.customer?.givenName || 
        !newEvent?.customer?.square_data?.customer?.familyName || 
        !newEvent?.customer?.square_data?.customer?.emailAddress || 
        !newEvent?.customer?.square_data?.customer?.phoneNumber ||
        !newEvent?.customer?.square_data?.customer?.address?.addressLine1 ||
        !newEvent?.customer?.square_data?.customer?.address?.locality ||
        !newEvent?.customer?.square_data?.customer?.address?.administrativeDistrictLevel1 ||
        !newEvent?.customer?.square_data?.customer?.address?.postalCode ||
        !newEvent?.customer?.square_data?.customer?.address?.country
      ) {
      setCustomerValidStatus(false)
      console.error('Customer data is invalid', newEvent?.customer?.square_data?.customer)
    } else {
      setCustomerValidStatus(true)
      setPostingNewCustomer(true)
      console.log('Customer data is valid, proceeding to add new customer')
      // Create new customer object
      const newCustomerObj = {
        ...newEvent.customer.square_data.customer,
        id: Date.now().toString(), // Temporary ID, replace with actual ID from backend
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        address: {
          ...newEvent.customer.square_data.customer.address,
          country: newEvent.customer.square_data.customer.address.country || 'US'
        }
      }


      // send to backend
      await fetch('/api/customers/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: newCustomerObj
        })
      }).then((res) => {
        if (!res.ok) {
          // throw new Error('Failed to add new customer', res)
        }
        return res.json()
      }).then((data) => {
        console.log('New customer added:', data)
          // Reset the newCustomer state
          // Update the newEvent state with the new customer ID
          setPostingNewCustomer(false)
        setNewEvent((prev) => ({
          ...prev,
          customer: {   
            ...prev.customer,
            id: data?.customer?.id, // Assuming the backend returns the new customer ID
            square_data: {
              ...prev.customer.square_data,
              customer: {
                ...prev.customer.square_data.customer,
                id: data?.customer?.id, // Update the customer ID
                address: {
                  ...prev.customer.square_data.customer.address
                }
              }
            }
          }
        }))
        setNewEventObj((prev: any) => ({
          ...prev,
          customer: data.id // Update the newEventObj with the new customer ID
        }))
        // Close the new customer form
        toggleNewCustomer()
      }).catch((error) => {
        console.error('Error adding new customer:', error)
      })

      
    }
  }

  return ( 
    <Col md={2}>
      <button className="btn btn-primary" onClick={toggleModal}>Add new Event</button>

      <Modal show={showModal} onHide={toggleModal} centered size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>

            <div className="mb-3">
              <label className="form-label">Event Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={newEvent.name} 
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} 
              />
            </div>

            <Row>
              <Col md={4}>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={newEvent.date} 
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} 
                  />
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <label className="form-label">Start Time</label>
                  <input 
                    type="time" 
                    className="form-control" 
                    defaultValue={newEvent.start_time} 
                    onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })} 
                  />
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <label className="form-label">End Time</label>
                  <input 
                    type="time" 
                    className="form-control" 
                    defaultValue={newEvent.end_time} 
                    onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })} 
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                {/* Customer: */}
                <Row>
                  <Col md={8}>
                    <label className="form-label">Customer</label>
                    <ChoicesFormInput className="form-control" data-choices id="choices-single-default" defaultValue={0} onChange={(e) => { 
                        // newEventObj.customer = parseInt(e?.target.?value, 10)
                        setNewEventObj({ ...newEventObj, customer: parseInt(e?.target?.value, 10) })
                      }}>
                        { customers?.map((customer: any, i: number) => (
                          <option value={customer?.id} key={i}>{ customer?.square_data?.customer?.givenName } { customer?.square_data?.customer?.familyName }</option>
                        ))}
                      </ChoicesFormInput>
                  </Col>
                  <Col md={4}>
                    <button className={`btn ${ newCustomer ? 'btn-btn-secondary' : 'btn-primary' } mt-3`} onClick={toggleNewCustomer}>
                      { newCustomer ? 'Cancel' : 'Add New Customer' }
                    </button>
                  </Col>
                </Row>
                { newCustomer && 
                <Row className="mb-3 pt-3 fade-in">
                  <Col>
                    <small>New Customer Info</small>
                    <div className="d-flex flex-row align-items-center mt-2 mb-1">
                      <IconifyIcon icon="bx-user" fontSize='45' className="me-2" />
                      <input type="text" 
                        id="givenName"
                        name="givenName"
                        placeholder='First Name'
                        className='form-control' defaultValue={ newEvent?.customer?.square_data?.customer?.givenName || ''} 
                        onChange={(e) =>  updateCustomer( {...newEvent.customer.square_data.customer, givenName: e.target.value })} />
                      <input type="text" 
                        id="familyName"
                        name="familyName"
                        placeholder='Last Name'
                        className='form-control ms-2' defaultValue={ newEvent?.customer?.square_data?.customer?.familyName || ''} 
                        onChange={(e) =>  updateCustomer( {...newEvent.customer.square_data.customer, familyName: e.target.value })} />
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                      <IconifyIcon icon="bx-envelope" fontSize='20' className="me-2" />
                      <input type="text" 
                        placeholder='Email'
                        className='form-control' defaultValue={ newEvent?.customer?.square_data?.customer?.emailAddress || ''} 
                        onChange={(e) => updateCustomer({ ...newEvent.customer.square_data.customer, emailAddress: e.target.value }) } />
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                      <IconifyIcon icon="bx-phone" fontSize='20' className="me-2" />
                      <input  
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        placeholder='+1-234-567-8910'
                        className='form-control' defaultValue={ newEvent?.customer?.square_data?.customer?.phoneNumber || ''} 
                        onChange={(e) => updateCustomer({ ...newEvent.customer.square_data.customer, phoneNumber: e.target.value }) } />
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                      <IconifyIcon icon="bx-map" fontSize='20' className="me-2" />
                      <div className="d-flex flex-column w-auto">
                        <input type="text" 
                          placeholder='Address Line 1'
                          style={{width: '15rem'}}
                          className='form-control ms-2 mb-1' defaultValue={ newEvent?.customer?.square_data?.customer?.address?.addressLine1 || ''} 
                          onChange={(e) => updateNestedField('addressLine1', e.target.value) } />
                        <input type="text" 
                          placeholder='Address Line 2'
                          style={{width: '15rem'}}
                          className='form-control ms-2 mb-1' defaultValue={ newEvent?.customer?.square_data?.customer?.address?.addressLine2 || ''} 
                          onChange={(e) => updateNestedField('addressLine2', e.target.value) } />
                        <div className="w-full d-flex flex-row align-items-center justify-content-center mb-1">
                          <input type="text" 
                            placeholder='City'
                            style={{width: '8rem'}}
                            className='form-control ms-1' defaultValue={ newEvent?.customer?.square_data?.customer?.address?.locality || ''} 
                            onChange={(e) => updateNestedField('locality', e.target.value) } />
                            {/* If country is US */}
                            { newEvent?.customer?.square_data?.customer?.address?.country === 'US' &&
                              <select 
                              className='form-select ms-2' 
                              style={{width: '6rem'}}
                              defaultValue={ newEvent?.customer?.square_data?.customer?.address?.administrativeDistrictLevel1 || ''} 
                              onChange={(e) => updateNestedField('administrativeDistrictLevel1', e.target.value) }>
                              { USStates.map((state, index) => (
                                <option key={index} defaultValue={state.abbreviation}>{state.abbreviation}</option>
                              ))}
                            </select>
                            }
                            { newEvent?.customer?.square_data?.customer?.address?.country !== 'US' &&
                              <input type="text" 
                                placeholder='Province'
                                style={{width: '6rem'}}
                                className='form-control ms-2' defaultValue={ newEvent?.customer?.square_data?.customer?.address?.administrativeDistrictLevel1 || ''} 
                                onChange={(e) => updateNestedField('administrativeDistrictLevel1', e.target.value) } />
                            }
                        </div>
                        <div className="w-full d-flex flex-row align-items-start justify-content-start">
                          <input type="text" 
                            placeholder='Zip/Postal'
                            style={{width: '7rem'}}
                            className='form-control ms-2 me-1' defaultValue={ newEvent?.customer?.square_data?.customer?.address?.postalCode || ''} 
                            onChange={(e) => updateNestedField('postalCode', e.target.value) } />
                          <select 
                            className='form-select ms-2' 
                            style={{width: '6rem'}}
                            defaultValue={ newEvent?.customer?.square_data?.customer?.address?.country || ''} 
                            onChange={(e) => updateNestedField('country', e.target.value) }>
                            { worldCountries.map((country, index) => (
                              <option key={index} value={country.code}>{country.code}</option>
                            ))}
                          </select>
                        </div>
                        {/* submit button: */}
                        { !customerValidStatus &&
                          <div className="text-danger mt-2">
                            <IconifyIcon icon="bx-error" fontSize='20' className="me-2" />
                            Please fill out all fields correctly.
                          </div>
                          }
                        {
                          customerValidStatus && postingNewCustomer && 
                          <div className="text-success mt-2">
                            <IconifyIcon icon="bx-check-circle" fontSize='20' className="me-2" />
                            Adding new customer...
                          </div>
                        }
                        <button className="btn btn-sm btn-primary mt-2" onClick={addNewCustomer}>Save Customer</button>
                      </div>
                    </div>
                  </Col>
                </Row>
                }
              </Col>
              <Col>
                {/* Venue */}
              </Col>
            </Row>
            

        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={toggleModal}>Close</button>
          <button onClick={submitNewEvent} className="btn btn-primary">Create Event</button>
        </Modal.Footer>
      </Modal>

    </Col>
  )
}