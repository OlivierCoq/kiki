// EventContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

import { Event, Dish, Menu } from '@/types/event'

// type MenuItem = {
//   id: number;
//   name: string;
//   cost: number;
//   price: number;
// };

// type Event = {
//   id: number;
//   name: string;
//   menuId: number;
//   venueId: number;
// };

type EventContextType = {
  event: Event | null;
  menuItems: Dish[];
  setMenuItems: React.Dispatch<React.SetStateAction<Dish[]>>;
  totalCost: number;
  totalRevenue: number;
};



const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvent = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvent must be inside EventProvider");
  return ctx;
};

export const EventProvider = ({ children, event }: { children: React.ReactNode; event: Event }) => {
  const [menuItems, setMenuItems] = useState<Dish[]>([]);

  // Fetch event first
  useEffect(() => {
    const fetchEvent = async () => {

      const menuRes = await fetch(`/api/menus/${event?.menu}`);
      const menuData = await menuRes.json();
      // console.log('menuData', menuData)
      setMenuItems(menuData.menu?.dishes?.data); // assuming { items: [...] }
    };
    fetchEvent();
  }, [event?.id]);

  const totalCost = useMemo(
    () => menuItems?.reduce(
        (sum: number, item: any) => sum + (item.quantity * item.cost),
        0
      ),
    [menuItems]
  )

  console.log('totalCost', totalCost)

  const totalRevenue = useMemo(
    () => menuItems?.reduce(
        (sum: number, item: any) => sum + (item.quantity * item.price),
        0
      ),
    [menuItems]
  )

  return (
    // <EventContext.Provider value={{ event, menuItems, setMenuItems, totalCost, totalRevenue }}>
     <EventContext.Provider value={{ event, menuItems, setMenuItems, totalCost, totalRevenue }}>
      {children}
    </EventContext.Provider>
  ); 
};
