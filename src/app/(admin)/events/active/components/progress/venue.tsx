// React
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
// Bootstrap
import { 
  Col, 
  Row 
} from 'react-bootstrap'
// Icons
import IconifyIcon from '@/components/wrappers/IconifyIcon'
// Types
import { Event } from '@/types/event'
import { Venue } from '@/types/event'
// Context
import { useEvents } from '@/context/useEventsContext'
// UI
import ComponentContainerCard from '@/components/ComponentContainerCard'
import ChoicesFormInput from '@/components/form/ChoicesFormInput'
import DropzoneFormInput from '@/components/form/DropzoneFormInput'


const ProgressVenue = ({ event }: { event: Event }) => {

    // State
  const { venues, fetchVenues } = useEvents()
  const [loading, setLoading] = useState(true)
  const [newEvent, setNewEvent] = useState<Event | null>(null)
  const [newVenue, setNewVenue] = useState<Venue | null>(null)
  // Adding new venue to db
  const [newVenueEntry, setNewVenueEntry] = useState(false)
  const toggleNewVenueEntry = () => {
    setNewVenueEntry(!newVenueEntry)
  }
  const [newVenueObject, setNewVenueObject] = useState({
    name: '',
    contact_number: '',
    contact_email: '',
    contact_name: '',
    address: '',
    state: '',
    city: '',
    zip: '',
    capacity: 0,
    notes: '',
    tags: [] as string[],
    archived: false,
    images: [] as string[],
  })
  // Uploaad images
  const[status, setStatus] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (files: File[]) => {
    setUploading(true)
    setStatus('Uploading images...')
    console.log('Files to upload:', files)
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
      if (data?.images) {
        setNewVenueObject({

          ...newVenueObject,
          images: [...newVenueObject.images, ...data.images]
        })
        setStatus('Images uploaded successfully.')
      } else {
        setStatus('Failed to upload images.')
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      setStatus('Error uploading images.')
    } finally {
      setUploading(false)
    }
  } 

  // Components
  const VenueSelector = () => {
    return (
      <ComponentContainerCard id="basic" title="Update venue" description={'Select the venue for this event. This can be changed if needed.'}>
        <Row>
          <Col md={7}>
            <ChoicesFormInput className="form-control" data-choices id="choices-single-default" defaultValue={event?.venue?.id} onChange={updateEvent}>
              { venues?.map((venue: Venue, i: number) => (
                <option value={venue?.id} key={i}>{ venue?.name }</option>
              ))}

            </ChoicesFormInput>
          </Col>
          <Col>
            <button className="btn btn-primary btn-sm" onClick={toggleNewVenueEntry}>Add new Venue</button>
          </Col>
        </Row>
      </ComponentContainerCard>
    )
  }


  // Handlers
  useEffect(() => {
    if (!venues) {
      fetchVenues()
      setLoading(false)
    } else { setLoading(false) }
  }, [])

  // console.log('Edit Venue here...', venues)


  const updateEvent = async (venue: any) => {

    const res = await fetch(`/api/events/${event?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ venue })
    })

    

    const data = await res.json()
    // console.log('resuklt', data?.event)
    const new_venue = venues?.find((venue: Venue) => venue?.id === data?.event?.venue)
    let new_event = event
    new_event.venue = new_venue
    setNewEvent(new_event)
    setNewVenue(new_venue)
  }

  return (
    <>
      <Row className='mt-4'>
        <Col med={6}>
          <div className="rounded bg-light p-4">
            { newVenue ? 
            <Row>
            <Col md={6}>
              <div className="mb-0 row">
                <div className="col-12 d-flex flex-row align-items-center">
                  <IconifyIcon icon="bx-building-house" fontSize='20' className="me-2" />
                  <h4 className='mt-2'>{newVenue?.name}</h4>
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
              <h4 className='mt-3 mb-3'>Contact Person</h4>
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
            :
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
                <h4 className='mt-3 mb-3'>Contact Person</h4>
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
          }
          </div>
        </Col>
        <Col med={6}>
          <VenueSelector />
          { newVenueEntry && 
            <Row className='mx-2 w-100'>
              <Col>
                <Row>
                  <h5>New Venue</h5>
                </Row>
                
                <Row className='mb-2'>
                  <input type="text" className='form-control' 
                    value={newVenueObject?.name} onChange={(e) => setNewVenueObject({ ...newVenueObject, name: e.target.value }) } placeholder='Venue name' />
                </Row>
                <Row className='mb-2'>
                  <h6>Contact</h6>
                </Row>
                <Row className='mb-2'>
                  <input type="text" className='form-control' 
                    value={newVenueObject?.contact_name} onChange={(e) => setNewVenueObject({ ...newVenueObject, contact_name: e.target.value }) } placeholder='Contact name' />
                </Row>
                <Row className='mb-2'>
                  <input type="text" className='form-control' 
                    value={newVenueObject?.contact_email} onChange={(e) => setNewVenueObject({ ...newVenueObject, contact_email: e.target.value }) } placeholder='Contact email' />
                </Row>
                <Row className='mb-2'>
                  <input type="text" className='form-control' 
                    value={newVenueObject?.contact_number} onChange={(e) => setNewVenueObject({ ...newVenueObject, contact_number: e.target.value }) } placeholder='Contact number' />
                </Row>
                <Row className='mb-2'>
                  <h6>Address</h6>
                </Row>
                <Row className='mb-2'>
                  <input type="text" className='form-control' 
                    value={newVenueObject?.address} onChange={(e) => setNewVenueObject({ ...newVenueObject, address: e.target.value }) } placeholder='Street' />
                </Row>
                <Row className='mb-2'>
                  <Col md={6} className='m-0 p-0'>
                    <input type="text" className='form-control' 
                      value={newVenueObject?.city} onChange={(e) => setNewVenueObject({ ...newVenueObject, city: e.target.value }) } placeholder='City' />
                  </Col>
                  <Col>
                    <input type="text" className='form-control' 
                      value={newVenueObject?.state} onChange={(e) => setNewVenueObject({ ...newVenueObject, state: e.target.value }) } placeholder='State' />
                  </Col>
                  <Col>
                    <input type="text" className='form-control' 
                      value={newVenueObject?.zip} onChange={(e) => setNewVenueObject({ ...newVenueObject, zip: e.target.value }) } placeholder='Zip code' />  
                  </Col>
                </Row>
                <Row className='mt-3 mb-1'>
                  <h6>Additional</h6>
                </Row>
                <Row className='mb-2'>
                  <Col className='m-0 p-0'>
                    <label className='form-label'>Capacity</label>
                    <input type="number" className='form-control' 
                      value={newVenueObject?.capacity} onChange={(e) => setNewVenueObject({ ...newVenueObject, capacity: Number(e.target.value) }) } placeholder='Capacity' />
                  </Col>
                  <Col className='m-0 p-0'>
                    <label className='form-label'>Tags</label>
                    <input type="text" className='form-control' 
                      value={newVenueObject?.tags} onChange={(e) => setNewVenueObject({ ...newVenueObject, tags: e.target.value.split(',') }) } placeholder='Tags (comma separated)' />
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <textarea className='form-control' rows={8} 
                    value={newVenueObject?.notes} onChange={(e) => setNewVenueObject({ ...newVenueObject, notes: e.target.value }) } placeholder='Notes' /> 
                </Row>
                <Row className='mb-2'>
                  <h6>Images</h6>
                </Row>
                {/* upload */}
                <Row className='mb-2'>
                  <DropzoneFormInput
                    iconProps={{ icon: 'bx:cloud-upload', height: 36, width: 36 }}
                    text="Drop files here or click to upload."
                    helpText={
                      <span className="text-muted fs-13">
                        (Upload images for the venue. These will be displayed in the venue details.)
                      </span>
                    }
                    showPreview
                    onFileUpload={handleUpload}
                  />
                </Row>
                <Row className='mt-3'>
                  <Col className='me-2'>
                    <button className='btn btn-secondary btn-sm' onClick={toggleNewVenueEntry}>Cancel</button>
                  </Col>
                  <Col className='text-end'>
                    <button className='btn btn-primary btn-sm' onClick={async () => {
                      const res = await fetch('/api/venues', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newVenueObject)
                      })
                      const data = await res.json()
                      console.log('new venue created', data)
                      if (data?.venue) {
                        setNewVenue(data?.venue)
                        toggleNewVenueEntry()
                      }
                    }}>Create Venue
                    </button>
                  </Col>
                </Row>
              </Col>
                
            </Row>
          }
        </Col>
      </Row>
    </>
  )
}

export default ProgressVenue