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

const DisplayEvent = ({ event }: { event: any }) => {


  return (
    <>
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
    </>
  )
}

export default DisplayEvent