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

  // Interfaces + Types
import { Event } from '@/types/event'

export interface customerPanelProps {
  event: Event;
 onUpdate: (event: Event) => void
//  onDelete: () => void; // Callback function to handle deletion
}
const CustomerPanel = ({
  event,
  onUpdate,
}: {
  event: Event
  onUpdate: (event: Event) => void
}) => { 

  // State
  const [customer, updateCustomer ] = useState<any>(null)
  const [editingCustomer, toggleEditCustomer ] = useState<boolean>(false)
  const [loadingCustomer, setLoadingCustomer] = useState<boolean>(true)
  const toggleCustomerEdit = () => { toggleEditCustomer(!editingCustomer) }
  const updateNestedField = (key: any, value: any) => {
    updateCustomer((prev: any) => ({
      ...prev,
      address: {
        ...prev.address,
        [key]: value 
      }
    }))
  }
  const [customerPosting, toggleCustomerPosting] = useState<boolean>(false)
  const toggleCustomer = () => { toggleCustomerPosting(!customerPosting) }

    // Data
  useEffect(()=> {
    try {
      fetch(`/api/customers/${event?.customer}`)
        .then(async (data) => {
          const res = await data.json()
          // console.log('customer', res)
          updateCustomer(res?.customer?.square_data?.customer)
          setLoadingCustomer(false)
        })
    }
    catch (error) {
      console.error('Error in useEffect fetching customer:', error)
      setLoadingCustomer(false)
    }
  }, [])

  // Methods
  const editCustomer = async () => {

    await toggleCustomerPosting(true)
    let kiki_customer = event?.customer 
    kiki_customer.square_data = {customer}

    const res = await fetch(`/api/customers/update/${event?.customer?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ kiki_customer, square_customer: customer })
    })

    

    const data = await res.json()
    // console.log('resuklt', data)
    await toggleCustomerPosting(false)

    // Update square in backend:
    toggleCustomerEdit()
  }


  return (
    <>
      {
        loadingCustomer && 

        <Card className='bg-light h-100'>
          <CardBody>
            <IconifyIcon icon="mdi:loading" className="spinner-border text-primary" /> 
          </CardBody>
        </Card>
      }
      {
        !loadingCustomer &&

        <Card className='bg-light h-100'>
          <CardBody>
            <CardTitle className="text-lg font-semibold mb-2">
              Customer &nbsp;
              <a href="#" className="text-primary cursor-hover" onClick={toggleCustomerEdit}>
                <IconifyIcon icon="bx-edit" fontSize='20' className="me-2 text-primary cursor-hover" />
              </a>
            </CardTitle>

            {
              !editingCustomer ? 

              <div className="d-flex flex-column">
                <div className="mb-0 row">
                  <div className="col-12  d-flex flex-row ">
                    <IconifyIcon icon="bx-user" fontSize='20' className="me-2" />
                    <p>{customer?.givenName }</p> &nbsp;
                    <p>{customer?.familyName }</p>
                  </div>
                  <div className="col-12 d-flex flex-row align-items-center mb-2">
                    <IconifyIcon icon="bx-envelope" fontSize='20' className="me-2" />
                    <a href={`mailto:${customer?.emailAddress}`}>
                      {customer?.emailAddress}
                    </a>
                  </div>
                  <div className="col-12 d-flex flex-row align-items-center mb-2">
                    <IconifyIcon icon="bx-phone" fontSize='20' className="me-2" />
                    <a href={`tel:${customer?.phoneNumber}`}>
                      {customer?.phoneNumber}
                    </a>
                  </div>
                  <div className="col-12 d-flex flex-row">
                    <IconifyIcon icon="bx-map" fontSize='20' className="me-2" />
                    <p>
                      {customer?.address?.addressLine1} <br/>
                      {customer?.address?.addressLine2} <br/>
                      {customer?.address?.locality}, &nbsp;
                      {customer?.address?.administrativeDistrictLevel1} <br/>
                      {customer?.address?.postalCode} &nbsp;  
                      {customer?.address?.country}
                    </p>
                  </div>
                </div>
              </div>

              : 

              <div className="d-flex flex-column fade-in">
                <Row>
                  <Col>
                    <div className="d-flex flex-row align-items-center mb-1">
                      <IconifyIcon icon="bx-user" fontSize='20' className="me-2" />
                      <Col className='me-1'>
                        <input type="text" 
                          className='form-control' value={ customer?.givenName || ''} 
                          onChange={(e) => updateCustomer({ ...customer, givenName: e.target.value }) } />
                      </Col>
                      <Col>
                        <input type="text" 
                          className='form-control' value={ customer?.familyName || ''} 
                          onChange={(e) => updateCustomer({ ...customer, familyName: e.target.value }) } />
                      </Col>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                      <IconifyIcon icon="bx-envelope" fontSize='20' className="me-2" />
                      <input type="text" 
                        className='form-control' value={ customer?.emailAddress || ''} 
                        onChange={(e) => updateCustomer({ ...customer, emailAddress: e.target.value }) } />
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                      <IconifyIcon icon="bx-phone" fontSize='20' className="me-2" />
                      <input type="text" 
                        className='form-control' value={ customer?.phoneNumber || ''} 
                        onChange={(e) => updateCustomer({ ...customer, phoneNumber: e.target.value }) } />
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                      <IconifyIcon icon="bx-map" fontSize='20' className="me-2" />
                      <div className="d-flex flex-column w-auto">
                        <input type="text" 
                          style={{width: '15rem'}}
                          className='form-control ms-2' value={ customer?.address?.addressLine1 || ''} 
                          onChange={(e) => updateNestedField('addressLine1', e.target.value) } />
                        <input type="text" 
                          style={{width: '15rem'}}
                          className='form-control ms-2' value={ customer?.address?.addressLine2 || ''} 
                          onChange={(e) => updateNestedField('addressLine2', e.target.value) } />
                        <div className="w-full d-flex flex-row align-items-center justify-content-center">
                          <input type="text"  
                            style={{width: '10rem'}}
                            className='form-control ms-2' value={ customer?.address?.locality || ''} 
                            onChange={(e) => updateNestedField('locality', e.target.value) } />
                          <input type="text" 
                            style={{width: '5rem'}}
                            className='form-control' value={ customer?.address?.administrativeDistrictLevel1 || ''} 
                            onChange={(e) => updateNestedField('administrativeDistrictLevel1', e.target.value) } />
                        </div>
                        <div className="w-full d-flex flex-row align-items-start justify-content-start">
                          <input type="text" 
                            style={{width: '5rem'}}
                            className='form-control ms-2' value={ customer?.address?.postalCode || ''} 
                            onChange={(e) => updateNestedField('postalCode', e.target.value) } />
                          <input type="text" 
                            style={{width: '4rem'}}
                            className='form-control' value={ customer?.address?.country || ''} 
                            onChange={(e) => updateNestedField('country', e.target.value) } />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-row  justify-content-end align-items-end">
                      { 
                        customerPosting ? <IconifyIcon fontSize='10' icon="mdi:loading" className="spinner-border text-primary text-sm" />
                        :

                        <button className='rounded btn' onClick={editCustomer}>
                          <IconifyIcon icon="bx-check" fontSize='20' className='text-success cursor-hover' />
                        </button>
                      }
                      
                    </div>
                  </Col>
                </Row>
              </div>
            }
            
            
          </CardBody>
          <CardFooter>

          </CardFooter>
        </Card>
      }
    </>
  )
}
export default CustomerPanel