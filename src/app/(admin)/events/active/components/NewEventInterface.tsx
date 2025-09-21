'use client'

// Imports
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { 
  Col, 
  Row,
  Modal,
  FormCheck,
  Card
} from 'react-bootstrap'

import { useEffect, useState, useRef, useDebugValue } from 'react'
import Link from 'next/link'
import updateNestedValue from '@/helpers/NestedFields'

// Types
import { Event, Venue,  ProgressEventStep, VenueImage, Summary, Dish } from '@/types/event'


// UI
   // Forms
import { USStates } from '@/assets/data/us-states'
import { worldCountries } from '@/assets/data/world-countries'
import ChoicesFormInput from '@/components/form/ChoicesFormInput'
import DropzoneFormInput from '@/components/form/DropzoneFormInput'
// Components

// Context
   // Customers
import { useCustomers } from '@/context/useCustomersContext'
  // Venues
import { useEvents } from '@/context/useEventsContext'
import { error } from 'console'

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
    created_at?: string;
  }
  
}

export const NewEventInterface = ({ onNewEvent }: NewEventInterfaceProps) => {

  // State variables
    // New event modal
  const [ showModal, setShowModal ] = useState(false)
  const toggleModal = () => { setShowModal(!showModal) }
    // loading
  const [loading, setLoading] = useState(true)
    // Customers
  const [newCustomer, setNewCustomer] = useState(false)
  const toggleNewCustomer = () => { 
    setNewCustomer(!newCustomer)
    clear_customer()
  }

  // Data
    // customers
  const { customers, fetchCustomers } = useCustomers()
  useEffect(() => {
    if (!customers) {
      fetchCustomers()
      setLoading(false)
    } else { 
      // console.log('customers fetched:', customers)
      setLoading(false) 
    }
  }, [customers, fetchCustomers])

    // Venues
  const { venues, fetchVenues } = useEvents()
  useEffect(() => {
    if (!venues) {
      fetchVenues()
      setLoading(false)
    } else { setLoading(false) }
  }, [])
    // console.log('Venues', venues)
  const [newVenue, setNewVenue] = useState(false)
  const toggleNewVenue = () => {
    setNewVenue(!newVenue)
    clear_venue()
  }

  let progress = {
    data: [
      {
          "label": "Venue",
          "status": "confirmed",
          "date": new Date().toISOString()
      },
      {
          "label": "Menu",
          "status": null,
          "date": null
      },
      {
          "label": "Invites",
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

  const summary = {
    "production": {
      "total_guests": 0,
      "price_per_person": 0,
      "items": []
    },
    "total_cost": 0,
    "total_revenue": 0,
    "total_profit": 0
  }

  const [ newEvent, setNewEvent ] = useState<any>({
    active: true,
    created_at: '',
    customer: {
      created_at: '',
      email: '',
      id: 1,
      square_data: {
        customer: {
          created_at: '',
          creationSource: 'THIRD_PARTY',
          emailAddress: '',
          phoneNumber: '',
          givenName: '',
          familyName: '',
          id: '1',
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
    id: 1,
    menu: {
      id: 1,
      archived: false,
      created_at: new Date().toISOString(),
      description: '',
      dishes: [] as Dish[],
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
      id: 1,
      address: '',
      archived: false,
      capacity: 0,
      country: 'US',
      city: '',
      contact_email: '',
      contact_name: '',
      contact_number: '',
      images: [] as VenueImage[] | null,
      name: '',
      notes: '',
      tags: [] as string[] | null,
      zip: '',
      state: 'TN'
    } as Venue,
    summary,
    archived: false,
      default_currency: {
        code: 'USD',
        symbol: '$'
      }
  })
  let newEventObj = {
    name: newEvent?.name,
    date: newEvent?.date,
    start_time: newEvent?.start_time,
    end_time: newEvent?.end_time,
    customer: newEvent?.customer?.id,
    menu: newEvent?.menu?.id,
    venue: newEvent?.venue?.id,
    notes: newEvent?.notes,
    progress,
    summary,
    active: true,
    archived: false,
    default_currency: {
        code: 'USD',
        symbol: '$'
      }
  }

    // Customer
  const updateCustomer = (customer: any) => {
    setNewEvent((prev: any) => ({
      ...prev,
      date: prev.date,
      start_time: prev.start_time,
      end_time: prev.end_time,
      notes: prev.notes,
      venue: prev.venue,
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
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        address: {
          ...newEvent.customer.square_data.customer.address,
          country: newEvent.customer.square_data.customer.address.country || 'US'
        }
      }


      // send to backend
       setLoading(true)
      newEventStatus += ' Adding new customer...'

      try {
        const response = await fetch('/api/customers/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: newCustomerObj
        })
      })
        const data = await response.json()
        setPostingNewCustomer(false)
        customers.push(data?.customer)
        console.log('New customer added:', data)

        let target_customer = customers.find((customer: any) => {
          return customer?.id === data?.customer?.id
        })

        // console.log('Target customer found:', target_customer)
      // Update the newEventObj with the new customer ID
        // console.log('Updating newEventObj with new customer ID:', data?.customer?.id)
        // console.log('new id:', data?.customer?.id)

        await fetchCustomers() // Refresh the customers list
        await setLoading(false)

        updateCustomer(target_customer)
        // setNewEvent({ ...newEvent, customer: target_customer })
        updateNestedValue('customer', target_customer, setNewEvent)

        newEventObj.customer = target_customer?.id


        return data?.customer
      } catch (error) {
        console.error('Error creating new customer:', error)
        throw error
      } finally {
        setPostingNewCustomer(false)
        setLoading(false)
      }
      
      
    }
  }
  const clear_customer = () => {
    setNewEvent((prev: any) => ({
      ...prev,
      customer: {  
        created_at: '',
        email: '',
        id: 1,
        square_data: {
          customer: {
            created_at: '',
            creationSource: 'THIRD_PARTY',
            emailAddress: '',
            phoneNumber: '',
            givenName: '',
            familyName: '',
            id: '1',
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
      }
    }))
  }

    // Venue
  const clear_venue = () => {
    setNewEvent((prev: any) => ({
      ...prev,
      venue: {
        id: 0,
        address: '',
        archived: false,
        capacity: 0,
        country: 'US',
        city: '',
        contact_email: '',
        contact_name: '',
        contact_number: '',
        images: [] as VenueImage[] | null,
        name: '',
        notes: '',
        tags: [] as string[] | null,
        zip: '',
        state: 'TN' // Preset to Tennessee
      }
    }))
  }
  type FileWithUrl = {
    name: string;
    url: string;
  }
  const[status, setStatus] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const handleUpload = async (files: File[]) => {
    setUploading(true)
    setStatus('Uploading images to server...')
    const formData = new FormData()
    files.forEach(file => {
      formData.append('images', file)
    })
    try {
      const res = await fetch('/api/venues/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      console.log('Upload response:', data)
      if (data?.venue_img_files?.length) {
        updateNestedValue('venue.images', [...(newEvent.venue.images ?? []), ...data.venue_img_files], setNewEvent)
        setStatus('Images uploaded successfully.')
      } else {
        setStatus('Failed to upload images. Please change the name of files and try again.')
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      setStatus('Error uploading images.')
    } finally {
      setUploading(false)
    }
  }
  const removeImg = async (image: FileWithUrl) => {

    await fetch('/api/venues/upload/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ path: `uploads/${image.name}` })
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to delete image')
      }
      return res.json()
    }).then((data) => {
      console.log('Image deleted successfully:', data)
      setStatus('Image deleted successfully.')
      updateNestedValue('venue.images', (newEvent?.venue?.images ?? []).filter((img: VenueImage) => img.name !== image.name), setNewEvent)
    }).catch((error) => {
      console.error('Error deleting image:', error)
      setStatus('Error deleting image.')
    })  

  } 
  const addNewVenue = async () => {

    // Validation:
    if (
      !newEvent.venue.contact_name ||
      !newEvent.venue.name || 
      !newEvent.venue.contact_email ||
      !newEvent.venue.address || 
      !newEvent.venue.city || 
      !newEvent.venue.state || 
      !newEvent.venue.country || 
      !newEvent.venue.zip) {
    // console.log('Please fill in all required fields for new venues', newEvent.venue)
    return false
  }
  else {
    console.log('Creating new venue in db...')
    newEventStatus += ' Adding new venue...'

      try {
        const res = await fetch('/api/venues/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newEvent.venue)
        })
        const data = await res.json()
        // console.log('new venue created', data)
        newEventObj.venue = data?.venue?.id
        if (data?.venue) {
          await venues?.push(data?.venue)
        }
        return data?.venue
      } catch (error) {
        console.error('Error creating new venue:', error)
        newEventStatus += ' Error creating new venue.'
        throw error
      } finally {
        setLoading(false)
        // setAddingNewVenue(false)
      }
    } 
    
  }

   // Event
  let newEventStatus = ''
  let newEventError = ''
  const [validating, setValidating] = useState(false)
  const toggleValidating = () => {
    setValidating(!validating)
  }
  const clearNewEventState = () => { 

    setValidating(false)
    setNewVenue(false)
    setNewCustomer(false)

    setNewEvent({
      active: true,
      created_at: '',
      customer: {
        created_at: '',
        email: '',
        id: 1,
        square_data: {
          customer: {
            created_at: '',
            creationSource: 'THIRD_PARTY',
            emailAddress: '',
            phoneNumber: '',
            givenName: '',
            familyName: '',
            id: '1',
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
      id: 1,
      menu: {
        id: 1,
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
        id: 1,
        address: '',
        archived: false,
        capacity: 0,
        country: 'US',
        city: '',
        contact_email: '',
        contact_name: '',
        contact_number: '',
        images: [] as VenueImage[] | null,
        name: '',
        notes: '',
        tags: [] as string[] | null,
        zip: '',
        state: 'TN'
      } as Venue,
     summary: {
        "production": {
          "total_guests": 0,
          "price_per_person": 0,
          "items": []
        },
        "total_cost": 0,
        "total_revenue": 0,
        "total_profit": 0
      } as Summary,
      archived: false,
      default_currency: {
        code: 'USD',
        symbol: '$'
      }
    })
  }
  const submitNewEvent = async () => {

    let invalid = false

    invalid = 
      !newEventObj?.name?.length ||
      !newEventObj?.date?.length ||
      !newEventObj?.start_time?.length ||
      !newEventObj?.end_time?.length ||
      newEventObj?.customer === null ||
      newEventObj?.venue === null ||
      newEventObj?.menu === null 

    if(invalid) {
      // console.log('Fix ur shit: ', newEventObj)
      
      toggleValidating()
      return 
    } else {
        toggleValidating()
        // console.log('sending to backend: ', newEventObj)
        if(newCustomer || newVenue) {
          if(newCustomer) { await addNewCustomer() }
          if(newVenue) { await addNewVenue() }
          

          newEventStatus = 'Creating new event...'

          // send to DB
          console.log('Submitting new event:', newEventObj)
          // send to backend
          await fetch('/api/events/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEventObj)
          }).then(async (res_data) => {
            console.log('Event created, sent to local API endpoint:', res_data)
            newEventStatus = 'Event created successfully.'
            await onNewEvent(newEventObj)
            clearNewEventState()
            toggleModal()
          }).catch((error) => {
            console.error('Error creating event:', error)
            newEventError = `Error creating event: ${error}`
          })

        }
        else {
          

          await fetch('/api/events/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEventObj)
          }).then(async (res_data) => {
            await onNewEvent(newEventObj)
            await toggleModal()
            newEventStatus = 'Event created successfully!'
            console.log('Event created, sent to local API endpoint:', res_data)
            clearNewEventState()
          }).catch((error) => {
            console.error('Error creating event:', error)
            newEventError = `Error creating event: ${error}`
          })
        }
    }
  }


  return (
    <Col md={2} >
      <button className="btn btn-primary" onClick={toggleModal}>Add new Event</button>

      <Modal show={showModal} onHide={toggleModal} centered size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{'minHeight' : '50vh'}}>

          <div className="mb-3">
            <label className="form-label">Event Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={newEvent.name} 
              // onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} 
              onChange={(e) => {
                updateNestedValue('name', e.target.value, setNewEvent)
              }}
            />
            { validating && !newEvent.name.length && <small className="text-danger">Please enter an event name.</small> }
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
                { validating && !newEvent.date.length && <small className="text-danger">Please enter an event date.</small> }
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="form-label">Start Time</label>
                <input 
                  type="time" 
                  className="form-control" 
                  defaultValue={newEvent.start_time} 
                  onChange={(e) => { updateNestedValue('start_time', e.target.value, setNewEvent) }}
                />
                { validating && !newEvent?.start_time?.length && <small className="text-danger">Please enter an event start time.</small> }
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="form-label">End Time</label>
                <input 
                  type="time" 
                  className="form-control" 
                  defaultValue={newEvent.end_time} 
                  onChange={(e) => { updateNestedValue('end_time', e.target.value, setNewEvent) }}
                  
                />
                { validating && !newEvent.end_time?.length && <small className="text-danger">Please enter an event end time.</small> }
              </div>
            </Col>
          </Row>

          <Row>
            <Col className='mt-2 mb-4'> 
              <textarea className='form-control' rows={8} 
                value={newEvent.notes} onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}  placeholder='Notes' /> 
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              {/* Customer */}

              <Row className="px-2">
                <FormCheck type="switch" label="Add new Customer" id="new_customer_switch" onChange={toggleNewCustomer}/>
              </Row>

              {
                newCustomer &&

                <Row className="mb-3 px-3 pt-2 fade-in">
                  <Col>
                    <small>New Customer Info</small>
                    <div className="d-flex flex-row align-items-center mt-2 mb-1">
                      <IconifyIcon icon="bx-user" fontSize='25' className="me-2" />
                      <Col>
                        <input type="text" 
                          id="givenName"
                          name="givenName"
                          placeholder='First Name'
                          className='form-control' defaultValue={ newEvent?.customer?.square_data?.customer?.givenName || ''} 
                          onChange={(e) => { updateNestedValue('customer.square_data.customer.givenName', e.target.value, setNewEvent) }}
                        />
                        { validating && newCustomer && !newEvent.customer?.square_data?.customer?.givenName.length && <small className="text-danger">Please enter a first name.</small> }
                      </Col>
                      <Col> 
                        <input type="text" 
                        id="familyName"
                        name="familyName"
                        placeholder='Last Name'
                        className='form-control ms-2' defaultValue={ newEvent?.customer?.square_data?.customer?.familyName || ''} 
                        onChange={(e) => { updateNestedValue('customer.square_data.customer.familyName', e.target.value, setNewEvent) }}
                      />
                      { validating && newCustomer && !newEvent.customer?.square_data?.customer?.familyName.length && <small className="text-danger">Please enter a last name.</small> }
                    </Col>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                      <IconifyIcon icon="bx-envelope" fontSize='20' className="me-2" />
                      <Col>
                      <input type="text" 
                        placeholder='Email'
                        className='form-control' defaultValue={ newEvent?.customer?.square_data?.customer?.emailAddress || ''} 
                        onChange={(e) => { updateNestedValue('customer.square_data.customer.emailAddress', e.target.value, setNewEvent) }}    
                      />
                      { validating && newCustomer && !newEvent.customer?.square_data?.customer?.emailAddress.length && <small className="text-danger">Please enter a proper email address.</small> }
                      </Col>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                      <IconifyIcon icon="bx-phone" fontSize='20' className="me-2" />
                      <Col>
                        <input  
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          placeholder='+1-234-567-8910'
                          className='form-control' defaultValue={ newEvent?.customer?.square_data?.customer?.phoneNumber || ''} 
                          onChange={(e) => { updateNestedValue('customer.square_data.customer.phoneNumber', e.target.value, setNewEvent) }}
                        />
                         { validating && newCustomer && !newEvent.customer?.square_data?.customer?.phoneNumber.length && <small className="text-danger">Please enter a phone number.</small> }
                      </Col>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                      <IconifyIcon icon="bx-map" fontSize='20' className="me-2" />
                      <div className="d-flex flex-column w-auto">
                        <Col>
                          <input type="text" 
                            placeholder='Address Line 1'
                            style={{width: '15rem'}}
                            className='form-control ms-2 mb-1' defaultValue={ newEvent?.customer?.square_data?.customer?.address?.addressLine1 || ''} 
                            onChange={(e) => { updateNestedValue('customer.square_data.customer.address.addressLine1', e.target.value, setNewEvent) }}
                          />
                          { validating && newCustomer && !newEvent.customer?.square_data?.customer?.address.addressLine1.length && <small className="text-danger">Please enter an address line 1.</small> }
                        </Col>
                        <input type="text" 
                          placeholder='Address Line 2'
                          style={{width: '15rem'}}
                          className='form-control ms-2 mb-1' defaultValue={ newEvent?.customer?.square_data?.customer?.address?.addressLine2 || ''} 
                          onChange={(e) => { updateNestedValue('customer.square_data.customer.address.addressLine2', e.target.value, setNewEvent) }}
                        />
                        <div className="w-full d-flex flex-row align-items-center justify-content-center mb-1">
                          <Col>
                          <input type="text" 
                            placeholder='City'
                            style={{width: '8rem'}}
                            className='form-control ms-1' defaultValue={ newEvent?.customer?.square_data?.customer?.address?.locality || ''} 
                            onChange={(e) => updateNestedValue('customer.square_data.customer.address.locality', e.target.value, setNewEvent) } />
                            { validating && newCustomer && !newEvent.customer?.square_data?.customer?.address.locality.length && <small className="text-danger">Please enter a city.</small> }
                            </Col>
                            {/* If country is US */}
                            { newEvent?.customer?.square_data?.customer?.address?.country === 'US' &&
                              <select 
                              className='form-select ms-2' 
                              style={{width: '6rem'}}
                              defaultValue={ newEvent?.customer?.square_data?.customer?.address?.administrativeDistrictLevel1 || ''} 
                              onChange={(e) => { updateNestedValue('customer.square_data.customer.address.administrativeDistrictLevel1', e.target.value, setNewEvent) }}
                            >
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
                                onChange={(e) => { updateNestedValue('customer.square_data.customer.address.administrativeDistrictLevel1', e.target.value, setNewEvent) }} />
                            }
                        </div>
                        <div className="w-full d-flex flex-row align-items-start justify-content-start">
                          <Col>
                            <input type="text" 
                              placeholder='Zip/Postal'
                              style={{width: '7rem'}}
                            className='form-control ms-2 me-1' defaultValue={ newEvent?.customer?.square_data?.customer?.address?.postalCode || ''} 
                            onChange={(e) => { updateNestedValue('customer.square_data.customer.address.postalCode', e.target.value, setNewEvent) }}/>
                            { validating && newCustomer && !newEvent.customer?.square_data?.customer?.address.postalCode.length && <small className="text-danger">Please enter a zip/postal code.</small> }
                            </Col>
                          <Col><select 
                            className='form-select ms-2' 
                            style={{width: '6rem'}}
                            defaultValue={ newEvent?.customer?.square_data?.customer?.address?.country || ''} 
                            onChange={(e) => { updateNestedValue('customer.square_data.customer.address.country', e.target.value, setNewEvent) }}>
                            { worldCountries.map((country, index) => (
                              <option key={index} value={country.code}>{country.code}</option>
                            ))}
                          </select>
                        </Col>
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
                        {/* <button className="btn btn-sm btn-primary mt-2" onClick={addNewCustomer}>Save Customer</button> */}
                      </div>
                    </div>
                  </Col>
                </Row>
              }

              {
                !newCustomer &&
            
                <Row className="px-2 fade-in">
                  <small className="my-2">Select from previous customers</small>
                  <ChoicesFormInput
                    className="form-control"
                    data-choices
                    style={{zIndex: 99}}
                    id="event-customer-choice"
                    defaultValue={newEvent?.customer?.id || ""}
                    onChange={(e) => { updateNestedValue('customer', customers.find((customer: any) => customer?.id === Number(e)), setNewEvent) }}
                  >
                    {customers?.map((customer: any, i: number) => (
                      <option value={customer?.id} key={customer?.id}>
                        {customer?.square_data?.customer?.givenName} {customer?.square_data?.customer?.familyName}
                      </option>
                    ))}
                  </ChoicesFormInput>
                </Row>
              }

            </Col>
            <Col md={6}>
              {/* Venue */}

              <Row className="px-2">
                <FormCheck type="switch" label="Add new Venue" id="new_venue_switch" onChange={toggleNewVenue}/>
              </Row>

              {
                newVenue &&
                // <p>NEW VENUE</p>
                <div className="mt-2 px-2 " style={{ height: '500px', overflowY: 'scroll' }}> 
                  <small className='mt-2 mb-4'>New venue details</small>
                  <Row className='mb-2 mt-1'>
                    <input type="text" className="form-control" value={newEvent.venue.name} onChange={(e) =>  updateNestedValue('venue.name', e.target.value, setNewEvent)} />
                    { validating && newVenue && !newEvent.venue.name.length && <small className="text-danger mb-1">Please enter an venue name.</small> }
                  </Row> 
                  <Row>
                    <h6>Contact</h6>
                    <input type="text" className="form-control mb-1" placeholder='Name' value={newEvent.venue.contact_name} onChange={(e) =>  updateNestedValue('venue.contact_name', e.target.value, setNewEvent)}  />
                    { validating && newVenue && !newEvent.venue.contact_name.length && <small className="text-danger mb-1">Please enter an venue contact person name.</small> }
                    <input type="text" className="form-control mb-1" placeholder='Email' value={newEvent.venue.contact_email} onChange={(e) =>  updateNestedValue('venue.contact_email', e.target.value, setNewEvent)}  />
                    { validating && newVenue && !newEvent.venue.contact_email.length && <small className="text-danger mb-1">Please enter an venue contact email.</small> }
                    <input type="text" className="form-control mb-1" placeholder='Phone number' value={newEvent.venue.contact_number} onChange={(e) =>  updateNestedValue('venue.contact_number', e.target.value, setNewEvent)}  />
                  </Row>
                  <Row>
                    <h6>Address</h6>
                    <Col>
                      <Row className='mb-1'>
                        <input type="text" className="form-control" placeholder='Street' value={newEvent.venue.address} onChange={(e) =>  updateNestedValue('venue.address', e.target.value, setNewEvent)} />
                        { validating && newVenue && !newEvent.venue.address.length && <small className="text-danger mb-1">Please enter an venue address.</small> }
                      </Row>
                      <Row className='mb-1'>
                        <Col className='mx-0 px-0'>
                          <input type="text" className="form-control" placeholder='City' value={newEvent.venue.city} onChange={(e) =>  updateNestedValue('venue.city', e.target.value, setNewEvent)} />
                          { validating && newVenue && !newEvent.venue.city.length && <small className="text-danger mb-1">Please enter an venue city.</small> }
                        </Col>
                        <Col className='mx-0 px-1'>
                          <select id="state" name="state" className="form-control mx-0" required
                              value={newEvent.venue.state} onChange={(e) =>  updateNestedValue('venue.state', e.target.value, setNewEvent)} >
                              {USStates.map((state) => (
                                <option key={state.abbreviation} value={state.abbreviation}>
                                  {state.name}  
                                </option>   
                              ))}
                            </select>
                        </Col>
                        <Col className='mx-0 px-0'>
                          <input type="text" className="form-control" placeholder='Zip/Postal' value={newEvent.venue.zip} onChange={(e) =>  updateNestedValue('venue.zip', e.target.value, setNewEvent)}/>
                          { validating && newVenue && !newEvent.venue.zip.length && <small className="text-danger mb-1">Please enter an venue zip or postal code.</small> }
                        </Col>
                      </Row>
                      <Row className='mb-1'>
                        <Col className='mx-0 px-0'>
                          <select id="country" name="country" className="form-control mx-0" required
                              value={newEvent.venue.country} onChange={(e) =>  updateNestedValue('venue.country', e.target.value, setNewEvent)} >
                              {worldCountries.map((country: any) => (
                                <option key={country.code} value={country.code}>
                                  {country.name}  
                                </option>    
                              ))}
                            </select>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className='pt-2'>
                    <h6>Additional</h6>
                    <Col>
                      <Row className='mb-1'>
                        <Col className='px-0'>
                          <label className='form-label'>Capacity</label>
                          <input type="number" className="form-control" value={newEvent.venue.capacity} onChange={(e) =>  updateNestedValue('venue.capacity', e.target.value, setNewEvent)} />
                        </Col>
                        <Col>
                          <label className='form-label'>Tags</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ex: outdoor, barn, "
                            value={Array.isArray(newEvent.venue.tags) ? newEvent.venue.tags.join(', ') : ''}
                            onChange={(e) =>  updateNestedValue('venue.tags', e.target.value.split(', ').map(tag => tag.trim()), setNewEvent )}
                          />
                        </Col>
                      </Row>
                      <Row>
                      <textarea className='form-control' rows={8} 
                        value={newEvent.venue.notes} onChange={(e) =>  updateNestedValue('venue.notes', e.target.value, setNewEvent)} placeholder='Notes' /> 
                      </Row>
                    </Col>
                  </Row>
                  <Row className='pt-2'>
                    <h6>Images</h6>
                  </Row>
                  <Row className='mb-2'>
                      <DropzoneFormInput
                        iconProps={{ icon: 'bx:cloud-upload', height: 36, width: 36 }}
                        text="Drop files here or click to upload."
                        helpText={
                          <span className="text-muted fs-13">
                            (Upload images for the venue. These will be displayed in the venue details.)
                          </span>
                        }
                        
                        onFileUpload={handleUpload}
                      />
                    </Row>
                  <Col>
                    {uploadError && <p className='text-danger'>{uploadError}</p>}
                    {status && <p className='text-success'>{status}</p>}
                    {(newEvent.venue?.images?.length ?? 0) > 0 && (
                      <div className="dz-preview">
                        {(newEvent.venue?.images ?? []).map((image: VenueImage, idx: number) => (
                          <Card className="mt-1 mb-0 shadow-none border" key={idx + '-file'}>
                            <div className="p-2">
                              <Row className="align-items-center">
                                {image.name ? (
                                  <Col className="col-auto">
                                    <img data-dz-thumbnail="" className="avatar-sm rounded bg-light" alt={image.name} src={image.url} />
                                  </Col>
                                ) : ''}
                                
                                <Col className="text-end">
                                  <Link href="" className="btn btn-link btn-lg text-muted shadow-none">
                                    <div className="flex-shrink-0 ms-3">
                                      <button data-dz-remove className="btn btn-sm btn-primary" onClick={() => removeImg(image)}>
                                        Delete
                                      </button>
                                    </div>
                                  </Link>
                                </Col>
                              </Row>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </Col>
                </div>

              }

              {
                !newVenue &&

                <Row className="px-2 fade-in">
                  <small className="my-2">Select from previous venues</small>
                  <ChoicesFormInput
                    className="form-control"
                    data-choices
                    
                    id="event-venue-choice"
                    defaultValue={newEvent?.venue?.id || ""}
                    onChange={(e) => { updateNestedValue('venue', venues.find((venue: any) => venue?.id === Number(e)), setNewEvent) }}
                  >
                    {venues?.map((venue: any, i: number) => (
                      <option value={venue?.id} key={venue?.id}>
                        { venue?.name }
                      </option>
                    ))}
                  </ChoicesFormInput>
                </Row>
              }


            </Col>
          </Row>

          <Row>
            <Col md={6} className='d-flex flex-row justify-content-end align-items-center'>
              <p className="text-success text-align-right mt-4 mb-0">{ newEventStatus }</p>
              { newEventError && <p className="text-danger text-align-right mt-4 mb-0">{ newEventError }</p> }
            </Col>
            <Col md={6}>
              <button className="btn btn-primary btn-md mt-4 w-100" onClick={submitNewEvent}>Save event</button>
            </Col>
          </Row>

        </Modal.Body>
      </Modal>

    </Col>

  )
}