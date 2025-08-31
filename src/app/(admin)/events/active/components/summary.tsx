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
import formatCurrency from '@/helpers/FormatCurrency'
import updateNestedValue from '@/helpers/NestedFields'

  // Interfaces + Types
import { Event } from '@/types/event'

export interface summaryPanelProps {
  event: Event;
  onUpdate: (event: Event) => void
//  onDelete: () => void; // Callback function to handle deletion
}
const SummaryPanel = ({
  event,
  onUpdate,
}: {
  event: Event
  onUpdate: (event: Event) => void
}) => { 

  // State
  const [summary, setSummary] = useState(event?.summary || {})
  const [editSummary, toggleEditSummary ] = useState<boolean>(false)
  const [summaryPosting, toggleSummaryPosting] = useState<boolean>(false)
  const toggleSummary = () => { toggleSummaryPosting(!summaryPosting) }
  const toggleSummaryEdit = () => { toggleEditSummary(!editSummary) }

  
  // Methods
  const editEventSummary = async () => {
    console.log('editEventSummary')
    await toggleSummaryPosting(true)



    const res = await fetch(`/api/events/update/${event?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ summary })
    })


    // Update total cost

    // update revenue

    // update profit


    const data = await res.json()
    console.log('updated event', data)
    await toggleSummaryPosting(false)
    toggleSummaryEdit()
    // return data
  }
  
  return (
    <>

<Card className='bg-light h-100'>
    <CardBody>
      <CardTitle className="text-lg font-semibold mb-2">
        Summary &nbsp;
        <a href="#" className="text-primary cursor-hover" onClick={toggleSummaryEdit}>
          <IconifyIcon icon="bx-edit" fontSize='20' className="me-2 text-primary cursor-hover" />
        </a>
      </CardTitle>
      
      { !editSummary && 
        <div className='fade-in'>
          <Row className='mb-3'>
            <Col>
              <h5 className='mb-1'>Total Guests</h5>
              <p className='mb-0'>{ summary?.production?.total_guests }</p>
            </Col>
            <Col>
              <h5 className='mb-1'>Total Cost</h5>
              <p className='mb-0'>{ formatCurrency(event?.default_currency, summary?.total_cost) }</p>
            </Col>
            {/* <Col>
              <h5 className='mb-1'>Price per Person</h5>
              <p className='mb-0'>{ formatCurrency(summary?.production?.price_per_person) }</p>
              
            </Col> */} 
          </Row>
          <Row className='mb-3'>
            
            <Col>
              <h5 className='mb-1'>Total Revenue</h5>
              <p className='mb-0'>{ formatCurrency(event?.default_currency, summary?.total_revenue) }</p>
            </Col>
            {/* <Col>
              <h5 className='mb-1'>Total Profit</h5>
              <p className='mb-0'>{ formatCurrency(summary?.total_profit) }</p>
            </Col> */}
          </Row>
        </div>
      }

      {
        editSummary && 
        <div>
          <Row>
            <Col className='me-1 mb-2 p-0'>
              <label htmlFor="total_guests">Total Guests</label>
              {/* onChange={(e) => { updateNestedValue('start_time', e.target.value, setNewEvent) }} */}
              <input type="number" id="total_guests" className="form-control" defaultValue={summary?.production?.total_guests} 
                onChange={(e) => { updateNestedValue('production.total_guests', e.target.value, setSummary) }}
              />
            </Col>
            <Col className='m-0 p-0'>
              {/* <label htmlFor="price_per_person">Price per Person</label>
              <input type="number" disabled id="price_per_person" className="form-control" defaultValue={summary?.production?.price_per_person} /> */}
              <label htmlFor="total_cost">Total Cost</label>
              <input type="number" disabled id="total_cost" className="form-control" defaultValue={summary?.total_cost} />
            </Col>
          </Row>
          <Row>
            <Col className='me-1 mb-2 p-0'>
              <label htmlFor="total_revenue">Total Revenue</label>
              <input type="number" disabled id="total_revenue" className="form-control" defaultValue={summary?.total_revenue} />
            </Col>
            <Col className='m-0 p-0'>
              
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col md={6}></Col>
            <Col md={6}>
              <div className="d-flex fex-row justify-content-end">

                { 
                  summaryPosting ? <IconifyIcon fontSize='10' icon="mdi:loading" className="spinner-border text-primary text-sm" />
                  :

                  <button className='rounded btn' onClick={editEventSummary}>
                    <IconifyIcon icon="bx-check" fontSize='20' className='text-success cursor-hover' />
                  </button>
                }
              </div>
            </Col>
          </Row>  
          <Row className='mb-3'>
            <Col>
              <h5 className='mb-1'>Total Profit</h5>
              <p className='mb-0'>{ formatCurrency(event?.default_currency, event?.summary?.total_profit) }</p>
            </Col>
          </Row>
        </div> 
      }
      
    </CardBody>
    <CardFooter>

    </CardFooter>
  </Card>

    </>
  )
}
export default SummaryPanel