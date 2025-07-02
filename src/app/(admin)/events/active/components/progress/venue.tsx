// React
import { useEffect, useState } from 'react'
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


const ProgressVenue = ({ event }: { event: Event }) => {

    // State
  const { venues, fetchVenues } = useEvents()
  const [loading, setLoading] = useState(true)
  const [newEvent, setNewEvent] = useState<Event | null>(null)
  const [newVenue, setNewVenue] = useState<Venue | null>(null)
  

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
            <button className="btn btn-primary btn-sm">Add new Venue</button>
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
        </Col>
      </Row>
    </>
  )
}

export default ProgressVenue