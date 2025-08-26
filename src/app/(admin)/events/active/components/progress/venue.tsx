// React
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
// Bootstrap
import { 
  Col, 
  Row,
  Card
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
import { USStates } from '@/assets/data/us-states'
import { worldCountries } from '@/assets/data/world-countries'
import formatText from '@/helpers/FormatText'


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
  type FileWithUrl = {
    name: string;
    url: string;
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
    country: 'US',
    capacity: 0,
    notes: '',
    tags: [] as string[],
    archived: false,
    images: [] as FileWithUrl[],
  })
  const [addingNewVenue, setAddingNewVenue] = useState(false)

  const addNewVenue = async () => {
    console.log('Adding new venue...', newVenueObject)
    // if (addingNewVenue) return // Prevent multiple submissions
    setAddingNewVenue(true)

    // Validation:
    if (
        !newVenueObject.contact_name ||
        !newVenueObject.name || 
        !newVenueObject.address || 
        !newVenueObject.city || 
        !newVenueObject.state || 
        !newVenueObject.zip) {
      console.log('Please fill in all required fields.')
      return
    }
    else {
      console.log('Creating new venue in db...')
      const res = await fetch('/api/venues/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newVenueObject)
        })
        const data = await res.json()
        console.log('new venue created', data)
        if (data?.venue) {
          await venues?.push(data?.venue)
          await updateEvent(Number(data?.venue?.id))
          toggleNewVenueEntry()
        }
        setAddingNewVenue(false)
      } 
    }
  const cancelNewVenue = () => {
    setNewVenueEntry(false)
    setNewVenueObject({
      name: '',
      contact_number: '',
      contact_email: '',
      contact_name: '',
      address: '',
      state: '',
      city: '',
      zip: '',
      country: 'US',
      capacity: 0,
      notes: '',
      tags: [],
      archived: false,
      images: []
    })
    setAddingNewVenue(false)
  }



  // useEffect(() => {
  //   if (event?.venue) {
  //     setNewVenue(event?.venue)
  //     setNewVenueObject({
  //       ...event?.venue,
  //       images: event?.venue?.images || []
  //     })
  //   }
  // }, [event])
  // Uploaad images
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
        setNewVenueObject({

          ...newVenueObject,
          images: [...newVenueObject.images, ...data.venue_img_files]
        })
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
      setNewVenueObject({
        ...newVenueObject,
        images: newVenueObject.images.filter(img => img.name !== image.name)
      })
    }).catch((error) => {
      console.error('Error deleting image:', error)
      setStatus('Error deleting image.')
    })  

  } 

  // Components
  const VenueSelector = () => {
    return (
      <ComponentContainerCard id="basic" title="Update venue" description={'Select the venue for this event. This can be changed if needed.'}>
        <Row>
          <Col md={8}>
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
                      {event?.venue?.contact_number || 'No contact number provided.'}
                    </a>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-12 d-flex flex-row align-items-center">
                    <IconifyIcon icon="bx-envelope" fontSize='20' className="me-2" />
                    <a href={`mailto:${event?.venue?.contact_email}`}>
                      {event?.venue?.contact_email || 'No contact email provided.'}
                    </a>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-12 d-flex flex-row align-items-center">
                    <IconifyIcon icon="bx-group" fontSize='20' className="me-2" />
                    <p className='mt-2'>
                      {event?.venue?.capacity ? `Capacity: ${event?.venue?.capacity}` : 'No capacity information provided.'}
                    </p>
                  </div>
                </div>
                <h5 className='mt-4'>Notes</h5>
                <div className="row mb-2">
                  <div className="col-12 d-flex flex-row align-items-center">
                    <IconifyIcon icon="bx-message-alt-detail" fontSize='20' className="me-2" />
                    <div className='mt-2' dangerouslySetInnerHTML={{ __html: formatText(event?.venue?.notes) || 'No additional notes provided.' }}></div>
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
                    <p>{event?.venue?.contact_name || 'No contact name provided.'}</p>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-12 d-flex flex-row align-items-center">
                    <IconifyIcon icon="bx-phone" fontSize='20' className="me-2" />
                    <a href={`tel:${event?.venue?.contact_number}`}>
                      {event?.venue?.contact_number || 'No contact number provided.'}
                    </a>
                  </div>
                </div>
                <div className="row  mb-2">
                  <div className="col-12 d-flex flex-row align-items-center">
                    <IconifyIcon icon="bx-envelope" fontSize='20' className="me-2" />
                    <a href={`mailto:${event?.venue?.contact_email}`}>
                      {event?.venue?.contact_email || 'No contact email provided.'}
                    </a>
                  </div>
                </div>
                <h5 className='mt-4'>Notes</h5>
                <div className="row mb-2">
                  <div className="col-12 d-flex flex-row align-items-center">
                    <IconifyIcon icon="bx-message-alt-detail" fontSize='20' className="me-2" />
                    <div className='mt-2' dangerouslySetInnerHTML={{ __html: formatText(event?.venue?.notes) || 'No additional notes provided.' }}></div>
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
            <Row className='mx-2 w-100 fade-in'>
              <Col>
                <Row>
                  <h5>New Venue</h5>
                </Row>
                
                <Row className='mb-2'>
                  <input type="text" className='form-control' 
                    value={newVenueObject?.name} onChange={(e) => setNewVenueObject({ ...newVenueObject, name: e.target.value }) } placeholder='Venue name' />
                  { (!newVenueObject?.name && addingNewVenue) && <small className='text-danger'>Please enter a venue name.</small> }
                </Row>
                <Row className='mb-2'>
                  <h6>Contact</h6>
                </Row>
                <Row className='mb-2'>
                  <input type="text" className='form-control' 
                    value={newVenueObject?.contact_name} onChange={(e) => setNewVenueObject({ ...newVenueObject, contact_name: e.target.value }) } placeholder='Contact name' />
                  { (!newVenueObject?.contact_name && addingNewVenue) && <small className='text-danger'>Please enter a contact name.</small> }
                </Row>
                <Row className='mb-2'>
                  <input type="text" className='form-control' 
                    value={newVenueObject?.contact_email} onChange={(e) => setNewVenueObject({ ...newVenueObject, contact_email: e.target.value }) } placeholder='Contact email' />
                  {/* { (!newVenueObject?.contact_email && addingNewVenue) && <small className='text-danger'>Please enter a contact email.</small> } */}
                </Row>
                <Row className='mb-2'>
                  <input type="text" className='form-control' 
                    value={newVenueObject?.contact_number} onChange={(e) => setNewVenueObject({ ...newVenueObject, contact_number: e.target.value }) } placeholder='Contact number' />
                  {/* { (!newVenueObject?.contact_number && addingNewVenue) && <small className='text-danger'>Please enter a contact number.</small> } */}
                </Row>
                <Row className='mb-2'>
                  <h6>Address</h6>
                </Row>
                <Row className='mb-2'>
                  <input type="text" className='form-control' 
                    value={newVenueObject?.address} onChange={(e) => setNewVenueObject({ ...newVenueObject, address: e.target.value }) } placeholder='Street' />
                  { (!newVenueObject?.address && addingNewVenue) && <small className='text-danger'>Please enter a street address.</small> }
                </Row>
                <Row className='mb-2'>
                  <Col md={5} className='p-0'>
                    <input type="text" className='form-control' 
                      value={newVenueObject?.city} onChange={(e) => setNewVenueObject({ ...newVenueObject, city: e.target.value }) } placeholder='City' />
                    { (!newVenueObject?.city && addingNewVenue) && <small className='text-danger'>Please enter a city.</small> }
                  </Col>
                  { newVenueObject?.country === 'US' ?
                  <Col md={4} className='pe-1'>
                    <select id="state" name="state" className="form-control mx-0" required
                      value={newVenueObject?.state} onChange={(e) => setNewVenueObject({ ...newVenueObject, state: e.target.value }) }>
                      {USStates.map((state) => (
                        <option key={state.abbreviation} value={state.abbreviation}>
                          {state.name}  
                        </option>   
                      ))}
                    </select>
                  </Col>
                  :
                  <Col md={4} className='pe-1'>
                    <input type="text" className='form-control' 
                      value={newVenueObject?.state} onChange={(e) => setNewVenueObject({ ...newVenueObject, state: e.target.value }) } placeholder='State/Province' />
                    { (!newVenueObject?.state && addingNewVenue) && <small className='text-danger'>Please enter a state or province.</small> }
                  </Col>
                  }
                  <Col>
                    <input type="text" className='form-control' 
                      value={newVenueObject?.zip} onChange={(e) => setNewVenueObject({ ...newVenueObject, zip: e.target.value }) } placeholder='Postal/Zip' />  
                    { (!newVenueObject?.zip && addingNewVenue) && <small className='text-danger'>Please enter a postal code.</small> }
                  </Col>
                </Row>
                <Row className='mb-2'> 
                  <Col md={6} className='m-0 p-0'></Col>
                  
                  
                </Row>
                <Row className='mb-2 mx-0 px-0'>
                  <Col className='m-0 p-0'>
                    <select id="country" name="country" className="form-control mx-0" required
                      value={newVenueObject?.country} onChange={(e) => setNewVenueObject({ ...newVenueObject, country: e.target.value }) }>
                      {worldCountries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
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
                    
                    onFileUpload={handleUpload}
                  />
                </Row>
                <Row className='mb-2'>
                  <Col>
                    {uploadError && <p className='text-danger'>{uploadError}</p>}
                    {status && <p className='text-success'>{status}</p>}
                    {newVenueObject?.images?.length > 0 && (
                      <div className="dz-preview">
                        {newVenueObject?.images?.map((image, idx) => (
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
                </Row>
                <Row className='mt-3'>
                  <Col className='me-2'>
                    <button className='btn btn-secondary btn-sm' onClick={cancelNewVenue}>Cancel</button>
                  </Col>
                  <Col className='text-end'>
                    <button className='btn btn-primary btn-sm' onClick={addNewVenue} disabled={uploading}>Create Venue</button>
                  </Col>
                </Row>
                <Row>
                  <Col className='mt-2'>
                    {addingNewVenue && <p className='text-success'>Adding new venue...</p>}
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