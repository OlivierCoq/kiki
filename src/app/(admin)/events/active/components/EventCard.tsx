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
  ModalTitle } from 'react-bootstrap'
    // Modal
import useToggle from '@/hooks/useToggle'

  // App
import EventModalBody from './modal/base'
import CostomerPanel from './customer'

  // Interfaces + Types
import { Event } from '@/types/event'
  // Data
import { useEvents } from "@/context/useEventsContext"


export interface EventCardProps {
  event: Event;
  onUpdate: (event: Event) => void
//  onDelete: () => void; // Callback function to handle deletion
}
const EventCard = ({ event }: { event: Event }) => {

    // Keep context up-to-date:
  const { updateEvent } = useEvents()

    // Derived field: total cost
  // const totalCost = event.menu?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0

  // UI
  const time_convert = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const convertedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${convertedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } 

    // Progress
  // const [progress_obj, set_progress_obj] = useState({
  //   venue: true,
  //   // tasting: false,
  //   menu: false,
  //   quote: false,
  //   contract: false,
  //   invites: false,
  //   ingredients: false,
  //   production: false,
  //   delivery: false
  // })
  // const progress_width = (milestone: any) => {
  //   switch(milestone?.status) {
  //     case null:
  //       return '0%'
  //       break;
  //     case "in_progress":
  //       return '50%'
  //       break;
  //     case "confirmed":
  //       return '100%'
  //       break;
  //     default:
  //       return '0%';
  //   }
  // }
  // const progress_class = (milestone: any) => {
  //   switch(milestone?.status) {
  //     case null:
  //       return ''
  //       break;
  //     case "in_progress":
  //       return 'bg-warning'
  //       break;
  //     case "confirmed":
  //       return 'bg-success'
  //       break;
  //     default:
  //       return '';
  //   }
  // }
  // const toggleProgress = (key: keyof typeof progress_obj) => {
  //   set_progress_obj(prev => {
  //     const allFalse = Object.keys(prev).reduce((acc, k) => {
  //       acc[k as keyof typeof progress_obj] = false
  //       return acc
  //     }, {} as typeof progress_obj)
  
  //     // If already selected, toggle off (set all false), else set only this one to true
  //     const isAlreadyTrue = prev[key]
  //     return isAlreadyTrue
  //       ? allFalse
  //       : { ...allFalse, [key]: true }
  //   })
  // }
  // const progress = {
  //   "data": [
  //     {
  //       "label": "Venue",
  //       "status": null,
  //       "date": null,
  //       "action": "update_venue"
  //     },
  //     {
  //       "label": "Tasting",
  //       "status": null,
  //       "date": null
  //     },
  //       {
  //       "label": "Menu",
  //       "status": null,
  //       "date": null
  //     },
  //     {
  //       "label": "Quote",
  //       "status": null,
  //       "date": null
  //     },
  //     {
  //       "label": "Contract",
  //       "status": null,
  //       "date": null
  //     },
  //     {
  //       "label": "Invites",
  //       "status": null,
  //       "date": null
  //     },
  //     {
  //       "label": "Ingredients",
  //       "status": null,
  //       "date": null
  //     },
  //     {
  //       "label": "Production",
  //       "status": null,
  //       "date": null
  //     },
  //       {
  //       "label": "Delivery",
  //       "status": null,
  //       "date": null
  //     }
  //   ]
  // }
  
  

// Methods
  // Modal toggle
  const { isTrue, toggle } = useToggle()
  // Delete
  const [deleteEvent, setDeleteEvent] = useState<boolean>(false)
  const toggleDelete = () => {
    setDeleteEvent(!deleteEvent)
  }

  return (
    <>
      <Col md={3} className='fade-in'>
        <Card className="h-full" style={{ height: '14rem' }}>
          <CardBody>
            <CardTitle className="text-xl font-semibold mb-2">{event.name}</CardTitle>


              {/* Edit */}
            <Button variant="primary" type="button" onClick={toggle}>
              <IconifyIcon icon="bx-restaurant" fontSize='20' />
            </Button>
            <Modal show={isTrue} onHide={toggle} size='xl'> 
              <ModalHeader closeButton>
                <ModalTitle>{event.name}</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <EventModalBody event={event} onUpdate={updateEvent} />
              </ModalBody>
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
                    // if (onDelete) onDelete() // Call the onDelete prop to notify parent
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
            <small>Created: {new Date(event.created_at).toLocaleDateString()}</small>
          </CardFooter>
        </Card>
      </Col>
    </>
  )
}

export default EventCard