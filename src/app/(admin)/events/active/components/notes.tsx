'use client'
// React + Next.js
import { createContext, useContext, useState, useEffect } from "react"

// UI
import IconifyIcon from '@/components/wrappers/IconifyIcon'
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
  // Helpers
import formatText from '@/helpers/FormatText'
const time_convert = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const convertedHours = hours % 12 || 12; // Convert to 12-hour format
  return `${convertedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
} 

  // Interfaces + Types
import { Event } from '@/types/event'

export interface notesPanelProps {
  event: Event;
  onUpdate: (event: Event) => void
//  onDelete: () => void; // Callback function to handle deletion
}
const NotesPanel = ({
  event,
  onUpdate,
}: {
  event: Event
  onUpdate: (event: Event) => void
}) => { 

  // State
  const [newNotes, setNewNotes] = useState(event.notes || '')
  const [editNotes, toggleEditNotes] = useState<boolean>(false)
  const toggleNotesEdit = () => { toggleEditNotes(!editNotes) }


  // Methods
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

  return (
    <>
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
    </>
  )

}
export default NotesPanel