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
import updateNestedValue from '@/helpers/NestedFields'
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

  // States
    // Notes
      // data
  const [newNotes, setNewNotes] = useState(event.notes || '')
  const [editNotes, toggleEditNotes] = useState<boolean>(false)
  const toggleNotesEdit = () => { toggleEditNotes(!editNotes) }
      // Methods
  const editEventNotes = async () => {
    // console.log('neeewwwww', newNotes)
    console.log('editEventNotes')
    await fetch(`/api/events/update/${event?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes: newNotes })
    })
      .then(async (data) => {
        const new_notes_updated = await data.json()
        console.log('updated notes! ', new_notes_updated)
        onUpdate(new_notes_updated?.event)
        toggleNotesEdit()
      })
      .catch((error)=> {
        console.log('error updating Event notes: ', error)
      })
    
  }

    // Time
      // data
  const [timePosting, setTimePosting] = useState<boolean>(false)
  const [editingTime, setEditingTime] = useState<boolean>(false)
  const [startTime, setStartTime] = useState(event.start_time || '')
  const [endTime, setEndTime] = useState(event.start_time || '')
  const [date, setDate] = useState(event.date || '')
    // methods
  const updateTime = async () => {
    setTimePosting(true)
     fetch(`/api/events/update/${event?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        date, 
        start_time: startTime,
        end_time: endTime
      })
    })
      .then(async (data) => {
        const new_time = await data.json()
        console.log('updated notes! ', new_time)
        onUpdate(new_time?.event)
        // toggleNotesEdit()
        setTimePosting(false)
        setEditingTime(false)
      })
      .catch((error)=> {
        setTimePosting(false)
        setEditingTime(false)
        console.log('error updating Event time: ', error)
      })
  }
  


  return (
    <>
      <Card className='bg-light h-100'>
        <CardBody>
          <CardTitle className="text-lg font-semibold mb-2">
            Details &nbsp;
            <a href="#" className="text-primary cursor-hover" onClick={() => { setEditingTime(!editingTime)}}>
              <IconifyIcon icon="bx-edit" fontSize='20' className="me-2 text-primary cursor-hover" />
            </a>
          </CardTitle>
          {
            !editingTime ?

            <div>
              <p className='mb-1'>Time</p>
              <div className='d-flex flex-row align-items-center mb-2'>
                <IconifyIcon icon="bx-calendar" fontSize='20' className="me-2" />
                <p className='mb-0'>Date: { event?.date }</p>
              </div>
              
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
            </div>

            :

            <div className="d-flex flex-column fade-in mb-3">
              <p className='mb-1'>Edit Time</p>
              <div className="d-flex flex-row">
                <div className="d-flex flex-row align-items-center mb-1">
                  <IconifyIcon icon="bx-calendar" fontSize='20' className="me-2" />
                  <Col className='me-1'>
                  {/*  onChange={(e) => setCustomer({ ...customer, givenName: e.target.value }) } */}
                    <input type="date" 
                      className='form-control' defaultValue={ event?.date } 
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </Col>
                </div>
              </div>
              <div className="d-flex flex-row">
                <div className="d-flex flex-row align-items-center mb-1">
                  <IconifyIcon icon="bx-time" fontSize='20' className="me-2" />
                  <Col className='me-1'>
                  {/*  onChange={(e) => setCustomer({ ...customer, givenName: e.target.value }) } */}
                    <input type="time" 
                      className='form-control' defaultValue={ event?.start_time } 
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </Col>
                  <Col className='me-1'>
                  {/*  onChange={(e) => setCustomer({ ...customer, givenName: e.target.value }) } */}
                    <input type="time" 
                      className='form-control' defaultValue={ event?.end_time } 
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </Col>
                </div>
              </div>
              <div className="d-flex flex-row  justify-content-end align-items-end">
                { 
                  timePosting ? <IconifyIcon fontSize='10' icon="mdi:loading" className="spinner-border text-primary text-sm" />
                  :

                  <button className='rounded btn' onClick={updateTime}>
                    <IconifyIcon icon="bx-check" fontSize='20' className='text-success cursor-hover' />
                  </button>
                }
                
              </div>
            </div>
          }
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