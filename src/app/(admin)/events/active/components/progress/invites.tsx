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

interface InvitesProps {
  event: any;
  onUpdateEvent: (newEvent: Event) => void
}
const ProgressInvites = ({
  event,
  onUpdateEvent
}: InvitesProps) => {



  console.log('Edit Invites here...')

  const updateInvitesStatus = async (e: any) => { 
    const newStatus = e.target.checked ? 'confirmed' : 'in_progress'
    
    const progress_obj = event?.progress
    ? { ...event.progress, data: [...event.progress.data] }
    : { data: [] }

    // Copy the specific item before mutating
    if (progress_obj.data[2]) {
      progress_obj.data[2] = { ...progress_obj.data[2], status: newStatus, date: new Date().toISOString() }
    }


    const invitesIndex = progress_obj.data.findIndex((item: any) => item.label === 'Invites')
    if (invitesIndex !== -1) {
      progress_obj.data[invitesIndex].status = newStatus
      progress_obj.data[invitesIndex].date = new Date().toISOString()
    } else {
      progress_obj.data.push({ label: 'Invites', status: newStatus, date: new Date().toISOString() })
    }
    const updatedEvent = { ...event, progress: progress_obj }
    onUpdateEvent(updatedEvent)
  }


  return (
    <>
      <Card className="mb-3"> 
        <Card.Body>
          <Card.Title>Invites</Card.Title>
          <p className="text-muted">Invitations have been sent and guest information is confirmed.</p>
          <div className="mb-3">
            <FormCheck
              type="checkbox"
              id="invites-confirmed"
              label="Guest data complete"
              checked={event?.progress?.data?.find((item: any) => item.label === 'Invites')?.status === 'confirmed'}
              onChange={(e) => {
                updateInvitesStatus(e)
              }}
            />
          </div>
        </Card.Body>
      </Card>   
    </>
  )
}

export default ProgressInvites