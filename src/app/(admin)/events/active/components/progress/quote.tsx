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
import { Dish, Menu, Summary, Event } from '@/types/event'

interface QuotesProps {
  event: any;
  onUpdateEvent: (newEvent: Event) => void
}
const ProgressQuotes = ({
  event,
  onUpdateEvent
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


    const quotesIndex = progress_obj.data.findIndex((item: any) => item.label === 'Quotes')
    if (quotesIndex !== -1) {
      progress_obj.data[quotesIndex].status = newStatus
      progress_obj.data[quotesIndex].date = new Date().toISOString()
    } else {
      progress_obj.data.push({ label: 'Quotes', status: newStatus, date: new Date().toISOString() })
    }
    const updatedEvent = { ...event, progress: progress_obj }
    onUpdateEvent(updatedEvent)
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

export default ProgressQuotes