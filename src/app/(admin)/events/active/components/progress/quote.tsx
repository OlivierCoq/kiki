'use client'
// React
import { useEffect, useState, useRef, memo } from 'react'
import Link from 'next/link'
import debounce from 'lodash.debounce'


// Icons
import IconifyIcon from '@/components/wrappers/IconifyIcon'
// Bootstrap
import { 
  Col, 
  Row,
  Card,
  FormCheck
} from 'react-bootstrap'

import dynamic from 'next/dynamic'
const ChoicesFormInput = dynamic(
  () => import('@/components/form/ChoicesFormInput'),
  { ssr: false }
)

// Types
import { Event } from '@/types/event'

interface QuotesProps {
  event: any;
  onUpdate: (newEvent: Event) => void
}
const ProgressQuote = ({
  event,
  onUpdate
}: QuotesProps) => {



  console.log('Edit Quotes here...')

  const updateQuotesStatus = async (e: any) => { 
    const newStatus = e.target.checked ? 'confirmed' : 'in_progress'
    
    const progress_obj = event?.progress
    ? { ...event.progress, data: [...event.progress.data] }
    : { data: [] }

    // Copy the specific item before mutating
    if (progress_obj.data[3]) {
      progress_obj.data[3] = { ...progress_obj.data[3], status: newStatus, date: new Date().toISOString() }
    }

    console.log('Progress Object:', progress_obj)


    const quotesIndex = progress_obj.data.findIndex((item: any) => item.label === 'Quote')
    if (quotesIndex !== -1) {
      progress_obj.data[quotesIndex].status = newStatus
      progress_obj.data[quotesIndex].date = new Date().toISOString()
    } else {
      progress_obj.data.push({ label: 'Quote', status: newStatus, date: new Date().toISOString() })
    }
    const updatedEvent = { ...event, progress: progress_obj }
    console.log('Updated Event:', updatedEvent)
    fetch(`/api/events/update/${event.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    }).then(response => response.json())
      .then(data => {
        console.log('Success:', data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })    
    
    onUpdate(updatedEvent)
  }


  return (
    <>
      <Card className="mb-3"> 
        <Card.Body>
          <Card.Title>Quotes</Card.Title>
          <p className="text-muted">Quotes have been sent and guest information is confirmed.</p>
          <div className="mb-3">
            <FormCheck
              type="checkbox"
              id="quotes-confirmed"
              label="Quotes Confirmed"
              checked={event?.progress?.data?.find((item: any) => item.label === 'Quote')?.status === 'confirmed'}
              onChange={(e) => {
                updateQuotesStatus(e)
              }}
            />
          </div>
        </Card.Body>
      </Card>   
    </>
  )
}

export default ProgressQuote