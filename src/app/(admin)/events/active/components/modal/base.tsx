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
    // Progress
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

}
export default EventModalBody