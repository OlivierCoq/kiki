'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

const MenusContext = createContext<any>(null)  

export function MenusProvider({ children }: { children: React.ReactNode }) {

  const [menus, setMenus] = useState<any[] | null>(null)

  const fetchMenus = async () => {
    const res = await fetch('/api/menus')
    const data = await res.json()
    console.log('CONTEXT MENUS!!!!!', data)
    setMenus(data)
  }



  return (
    <MenusContext.Provider value={{ 
        menus, 
        setMenus, 
        fetchMenus
      }}>
      {children}
    </MenusContext.Provider>
  )
}


export const useMenus = () => useContext(MenusContext )

