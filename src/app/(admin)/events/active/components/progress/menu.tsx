'use client'
// React
import { useEffect, useState } from 'react'
import Link from 'next/link'

// Icons
import IconifyIcon from '@/components/wrappers/IconifyIcon'
// Bootstrap
import { 
  Col, 
  Row,
  Card
} from 'react-bootstrap'

// Types
import { Dish } from '@/types/event'


export interface EventMenuProps {
  event: any;
  onUpdate: () => void; // Callback function to handle update
}
const EventsCard = ({ event, onUpdate = () => {} }: EventMenuProps) => {



  console.log('Edit Menu here...', event?.menu ? event.menu : null)

  // Fetch menu from /api/menus/[id] endpoint
  const [menu, setMenu] = useState<any>(null)   
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (event?.menu) {
      try {
        fetch(`/api/menus/${event.menu.id}`)
          .then((res) => res.json())
          .then((data) => {
            console.log('Fetched menu data:', data)
            setMenu(data?.menu || null)
            setDishes(data?.dishes || [])
            setLoading(false)
          })
          .catch((error) => {
            console.error('Error fetching menu data:', error)
            setLoading(false)
          })
      } catch (error) {
        console.error('Error in useEffect fetching menu:', error)
      }
    }
  }, [event])


  return (
    <>
      {menu ? (
        <div>
           <Row className='m-3'>
            <Col>
              <Card className='shadow-sm'>
                <Card.Header>
                  <h4 className='mb-2'>Menu: {menu.name}</h4>
                  <p>{menu.description}</p>
                </Card.Header>
                <Card.Body>
                 {/* List menu items: */}
                 <ul className="list-unstyled">
                   {dishes.map((dish) => (
                     <li key={dish.id}>

                        <div className="d-flex flex-row justify-content-between align-items-center">

                          <div className="d-flex flex-row">
                            <IconifyIcon icon="mdi:food" className="me-2" />
                            <div className="d-flex flex-column">
                              <h5 className='mb-1'>{dish.name}</h5>
                              <p className="text-muted">{dish?.description} </p>
                            </div>
                          </div>

                          <div>

                          </div>
                          {/* <Link href={`/admin/menus/${menu.id}/dishes/${dish.id}`} className="btn btn-primary btn-sm">
                            Edit Dish
                          </Link> */}
                        </div>
                     </li>

                   ))}
                 </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      ) : (

        loading ? (
          <div className="text-center my-5">
            {/* Loading animation */}
            <IconifyIcon icon="mdi:loading" className="spinner-border text-primary" />
          </div>
        ) : (
          <div className="text-center">
            <p>No menu found for this event.</p>
          </div>
        )
      )}
    </>
  )
}

export default EventsCard