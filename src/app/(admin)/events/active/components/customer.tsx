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
  Row } from 'react-bootstrap'
    // Helpers
import updateNestedValue from '@/helpers/NestedFields'
import { USStates } from '@/assets/data/us-states'
import { worldCountries } from '@/assets/data/world-countries'

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
  const [customer, setCustomer ] = useState<any>(null)
  const [editingCustomer, toggleEditCustomer ] = useState<boolean>(false)
  const [loadingCustomer, setLoadingCustomer] = useState<boolean>(true)
  const [kikiCustomer, setKikiCustomer ] = useState<any>(null)
  const toggleCustomerEdit = () => { toggleEditCustomer(!editingCustomer) }
  const updateNestedField = (key: any, value: any) => {
    setCustomer((prev: any) => ({
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
          console.log('customer', res)
          setKikiCustomer(res?.customer)
          setCustomer(res?.customer?.square_data?.customer)
          setLoadingCustomer(false)
          // console.log('holup', customer)
        })
    }
    catch (error) {
      console.error('Error in useEffect fetching customer:', error)
      setLoadingCustomer(false)
    }
  }, [])

  // Methods
  const editCustomer = async () => {

    toggleCustomerPosting(true)

    const squarePostObj = {
        customerId: customer?.id,
        emailAddress: customer?.emailAddress,
        familyName: customer?.familyName,
        givenName: customer?.givenName,
        address: {
            addressLine1: customer?.address?.addressLine1,
            addressLine2: customer?.address?.addressLine2 ?? '',
            administrativeDistrictLevel1: customer?.address?.administrativeDistrictLevel1,
            country: customer?.address?.country,
            firstName: customer?.givenName,
            lastName: customer?.familyName,
        },
    }

    const kikiPostObj = {
      user: kikiCustomer?.user,
      email: customer?.emailAddress,
      square_data: customer
    }

    console.log('sending: ', squarePostObj)

    fetch(`/api/customers/update/${event?.customer}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ kiki_customer: kikiPostObj, square_customer: squarePostObj })
    })
      .then(async (data) => {
        const customer_update_result = await data.json()
        console.log('updated customer', customer_update_result)
        toggleCustomerPosting(false)
        toggleCustomerEdit()
      })
      .catch((error) => {
        console.log('Error updating customer: ', error)
      })
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
                      {/*  onChange={(e) => setCustomer({ ...customer, givenName: e.target.value }) } */}
                        <input type="text" 
                          className='form-control' defaultValue={ customer?.givenName} 
                          onChange={(e) => updateNestedValue('givenName', e.target.value, setCustomer)}
                          />
                      </Col>
                      <Col>
                        <input type="text" 
                          className='form-control' defaultValue={ customer?.familyName } 
                          onChange={(e) => updateNestedValue('familyName', e.target.value, setCustomer)} />
                      </Col>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                      <IconifyIcon icon="bx-envelope" fontSize='20' className="me-2" />
                      <input type="text" 
                        className='form-control' defaultValue={ customer?.emailAddress } 
                        onChange={(e) => updateNestedValue('emailAddress', e.target.value, setCustomer)} />
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                      <IconifyIcon icon="bx-phone" fontSize='20' className="me-2" />
                      <input type="text" 
                        className='form-control' defaultValue={ customer?.phoneNumber } 
                        onChange={(e) => updateNestedValue('phoneNumber', e.target.value, setCustomer)} />
                    </div>
                    <div className="d-flex flex-row align-items-center mb-1">
                      <IconifyIcon icon="bx-map" fontSize='20' className="me-2" />
                      <div className="d-flex flex-column w-auto">
                        <input type="text" 
                          style={{width: '15rem'}}
                          className='form-control ms-2' defaultValue={ customer?.address?.addressLine1 } 
                          onChange={(e) => updateNestedValue('address.addressLine1', e.target.value, setCustomer)} />
                        <input type="text" 
                          style={{width: '15rem'}}
                          className='form-control ms-2' defaultValue={ customer?.address?.addressLine2 } 
                          onChange={(e) => updateNestedValue('address.addressLine2', e.target.value, setCustomer)} />
                        <div className="w-full d-flex flex-row align-items-center justify-content-center">
                          <input type="text"  
                            style={{width: '10rem'}}
                            className='form-control ms-2' defaultValue={ customer?.address?.locality } 
                            onChange={(e) => updateNestedValue('address.locality', e.target.value, setCustomer)} />
                          {
                            customer?.address?.country === 'US' ? 

                              <select id="state" name="state" className="form-control mx-0" required
                                value={customer?.address?.administrativeDistrictLevel1} 
                                onChange={(e) =>  updateNestedValue('address.administrativeDistrictLevel1', e.target.value, setCustomer)} >
                                {USStates.map((state) => (
                                  <option key={state.abbreviation} value={state.abbreviation}>
                                    {state.abbreviation}  
                                  </option>   
                                ))}
                              </select>
                              : 

                              <input type="text" 
                                style={{width: '5rem'}}
                                className='form-control' defaultValue={ customer?.address?.administrativeDistrictLevel1 } 
                                onChange={(e) => updateNestedValue('address.administrativeDistrictLevel1', e.target.value, setCustomer)} 
                              />
                          }
                          
                        </div>
                        <div className="w-full d-flex flex-row align-items-start justify-content-start">
                          <input type="text" 
                            style={{width: '5rem'}}
                            className='form-control ms-2' defaultValue={ customer?.address?.postalCode } 
                            onChange={(e) => updateNestedValue('address.postalCode', e.target.value, setCustomer)} />
                          <select 
                            className='form-select ms-2' 
                            style={{width: '6rem'}}
                            defaultValue={ customer?.address?.country } 
                            onChange={(e) => { updateNestedValue('customer.square_data.customer.address.country', e.target.value, setCustomer) }}>
                            { worldCountries.map((country, index) => (
                              <option key={index} value={country.code}>{country.code}</option>
                            ))}
                          </select>
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