
'use client'

import { Card, Col, Row } from 'react-bootstrap'
import Link from 'next/link'

// Logos
import logoDark from '@/assets/images/kiki_logo_dark.png'
import logoLight from '@/assets/images/kiki_logo_light.png'
import Image from 'next/image'

import { useState } from 'react'

// UI
import { USStates } from '@/assets/data/us-states'
import { worldCountries } from '@/assets/data/world-countries'

// Actions
import { login, signup } from './actions'

const Login = () => {


  const [loginMode, setLoginMode] = useState(true)
  const toggleLoginMode = () => {
    loginMode ? setLoginMode(false) : setLoginMode(true)
  }



  // Form UI:

  return (
    <div className="d-flex flex-column vh-100 p-3">
      <div className="d-flex flex-column flex-grow-1">
        <Row className="h-100">
          <Col xxl={7}>
            <Row className="justify-content-center h-100">
              <Col lg={6} className="py-lg-5">
                <div className="d-flex flex-column h-100 justify-content-center">
                  <div className="auth-logo mb-4">
                    <Link href="/customers/dashboard" className="logo-dark">
                      <Image src={logoDark} height={24} alt="logo dark" />
                    </Link>
                    <Link href="/customers/dashboard" className="logo-light">
                      <Image src={logoLight} height={24} alt="logo light" />
                    </Link>
                  </div>
                  <h2 className="fw-bold fs-24">{ loginMode? 'Sign In' : 'Sign Up' }</h2>
                  <p className="text-muted mt-1 mb-4">Enter your email address and password to access admin panel.</p>
                  <div className="mb-5">
                    {/* <LoginForm /> */}
                    <form className="display-block">
                      <div className="mb-3">
                        <label htmlFor="emailAddress">Email:</label>
                        <input id="emailAddress" name="emailAddress" type="emailAddress" className="form-control" required />
                      </div>
                      {/* loginMode only fields: */}
                      {!loginMode && (
                        <div className="mb-3 row">
                          <div className="col-6">
                            <label htmlFor="givenName">First Name:</label>
                            <input id="givenName" name="givenName" type="text" className="form-control" placeholder='John' required />
                          </div>
                          <div className="col-6">
                            <label htmlFor="familyName">Last Name:</label>
                            <input id="familyName" name="familyName" type="text" className="form-control" placeholder='Doe' required />
                          </div>
                        </div>
                      )}
                      {/* {!loginMode && ( )} */}
                      {!loginMode && ( 
                        <div className="mb-3 row">
                          <div className="col-5">
                            <label htmlFor="phoneNumber">Phone:</label>
                            <input id="phoneNumber" name="phoneNumber" type="tel" className="form-control" placeholder='+1-123-456-7890' required />
                          </div>
                          <div className="col-7">
                            <label htmlFor="company">Company Name:</label>
                            <input id="company" name="company" type="text" className="form-control" placeholder='ACME Co' required />
                          </div>
                        </div>
                      )}
                      {!loginMode && (
                        <div className="mb-3 row"> <h4>Address</h4></div>
                      )}
                      {!loginMode && (
                        <div className="mb-3 row">
                          <div className="col-12">
                            <label htmlFor="addressLine1">Line 1:</label>
                            <input id="addressLine1" name="addressLine1" type="text" className="form-control" placeholder='123 Main Street' required />
                          </div>
                        </div>
                       )}
                       {!loginMode && (
                        <div className="mb-3 row">
                          <div className="col-12">
                          <label htmlFor="addressLine2">Line 2:</label>
                          <input id="addressLine2" name="addressLine2" type="text" className="form-control" placeholder='Apt 123'  />
                        </div>
                      </div>
                      )} 
                      {!loginMode && ( 
                        <div className="mb-3 row">
                          <div className="col-6">
                            <label htmlFor="locality">City:</label>
                            <input id="locality" name="locality" type="text" className="form-control" placeholder='New York' required />
                          </div>
                          <div className="col-6">
                            <label htmlFor="administrativeDistrictLevel1">State:</label>
                            <select id="administrativeDistrictLevel1" name="administrativeDistrictLevel1" className="form-control" required>
                              {USStates.map((state) => (
                                <option key={state.abbreviation} value={state.abbreviation}>
                                  {state.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                      {!loginMode && (
                        <div className="mb-3 row">
                          <div className="col-3">
                            <label htmlFor="postalCode">Zip Code:</label>
                            <input id="postalCode" name="postalCode" type="text" className="form-control" placeholder='10001' required />
                          </div>
                          <div className="col-9">
                            <label htmlFor="country">Country:</label>
                              <select id="country" name="country" className="form-control" required>
                                {worldCountries.map((country) => (
                                  <option key={country.code} value={country.code}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                          </div>
                        </div> 

                      )}
                      {!loginMode && (
                        <div className="mb-3 row">
                          <div className="col-12">
                            <label htmlFor="initPassword">Password:</label>
                            <input id="initPassword" name="initPassword" type="password" className="form-control" required />
                          </div>
                        </div>
                      )}
                      <div className="mb-3">
                        <label htmlFor="password">{loginMode ? 'Password:' : 'Confirm Password:'}</label>
                        <input id="password" name="password" type="password" className="form-control" required />
                      </div>
                      <div className="mb-1 text-center d-grid">
                        <button formAction={loginMode ? login : signup} className="btn btn-red">{ loginMode ?  'Log In' : 'Sign Up'}</button>
                        <span className="my-2">Or <strong className="cursor-pointer" onClick={toggleLoginMode}>{ loginMode ?  'Sign Up' : 'Log In'}</strong></span>
                      </div>
                    </form>

                  </div>
                  <p className="text-danger text-center">
                    Admin, sign in here:{' '}
                    <Link href="/admin-login" className="text-dark fw-bold ms-1">
                      Sign In
                    </Link>
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xxl={5} className="d-none d-xxl-flex">
            <div className="w-100 h-100 bg-center rounded-3" style={{ backgroundImage: `url('https://ybkqtujfzpfkfvgsdpmg.supabase.co/storage/v1/object/public/img//dinner_table.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: '30rem',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
             }}>

            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Login
