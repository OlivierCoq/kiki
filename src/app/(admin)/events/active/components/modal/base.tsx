'use client'
// React + Next.js
import { createContext, useContext, useState, useEffect } from "react"
import { produce } from "immer"
import Link from 'next/link'

// UI
import IconifyIcon from '@/components/wrappers/IconifyIcon'
  // helpers
import formatText from '@/helpers/FormatText'
import formatCurrency from '@/helpers/FormatCurrency'
import updateNestedValue from '@/helpers/NestedFields'
  // Bootstrap
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
    // Modal
  import useToggle from '@/hooks/useToggle'

  // App
    // Panels
import CustomerPanel from '../customer'
import NotesPanel from '../notes'
import SummaryPanel from '../summary'
    // Progress
      // Subcomponents
import ProgressVenue from '../progress/venue'
import ProgressTasting from '../progress/tasting'
import ProgressMenu from '../progress/menu'
import ProgressQuote from '../progress/quote'
import ProgressContract from '../progress/contract'
import ProgressInvites from '../progress/invites'
import ProgressIngredients from '../progress/ingredients'
import ProgressProduction from '../progress/production'
import ProgressDelivery from '../progress/delivery'


  // Interfaces + Types
import { Event } from '@/types/event'
  // Data
import { useEvents } from "@/context/useEventsContext"


// export interface EventModalBodyProps {
//   event: Event;
// //  onUpdate: (event: Event) => void
// //  onDelete: () => void; // Callback function to handle deletion
// }
const EventModalBody = ({
  event,
  onUpdate,
}: {
  event: Event
  onUpdate: (event: Event) => void
}) => { 

    // Keep context up-to-date:
  const { updateEvent } = useEvents()


  // Progress

  const [progress_obj, set_progress_obj] = useState({
  venue: true,
  // tasting: false,
  beo: false,
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
      "label": "BEO",
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
    <>
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
                <CustomerPanel event={event} onUpdate={updateEvent} />
              </Col>
                {/* Notes */}
              <Col md={4} className='h-auto'>
                <NotesPanel event={event} onUpdate={updateEvent} />
              </Col>
                {/* Summary */}
              <Col md={4} className='h-auto'>
                <SummaryPanel event={event} onUpdate={updateEvent}  />
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
                  <ProgressVenue event={event} onUpdate={updateEvent} />
                )}

                { progress_obj?.beo && (
                  <ProgressMenu event={event} onUpdate={updateEvent} />
                )}
                { progress_obj?.quote && (
                  <ProgressQuote event={event} onUpdateEvent={updateEvent} />
                )}
                { progress_obj?.contract && (
                  <ProgressContract event={event} />
                )}
                { progress_obj?.invites && (
                  <ProgressInvites event={event} onUpdateEvent={updateEvent} />
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
    </>
  )
}
export default EventModalBody