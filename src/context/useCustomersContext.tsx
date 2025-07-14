'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

const CustomersContext = createContext<any>(null)  

export function CustomersProvider({ children }: { children: React.ReactNode }) {

  const [customers, setCustomers] = useState<any[] | null>(null)

  const fetchCustomers = async () => {
    const res = await fetch('/api/customers')
    const data = await res.json()
    // console.log('CONTEXT!!!!!', data)
    setCustomers(data)
  }



  return (
    <CustomersContext.Provider value={{ 
        customers, 
        setCustomers, 
        fetchCustomers
      }}>
      {children}
    </CustomersContext.Provider>
  )
}


export const useCustomers = () => useContext(CustomersContext)

