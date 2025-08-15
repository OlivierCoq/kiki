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



const ProgressMenu = ({ event }: { event: any }) => {

  console.log('Edit Menu here...', event?.menu ? event.menu : null)

  // Fetch menu from /api/menus/[id] endpoint
  const [menu, setMenu] = useState<any>(null)   
  const [dishes, setDishes] = useState<{ id: string | number; name: string }[]>([])

  useEffect(() => {
    if (event?.menu) {
      try {
        fetch(`/api/menus/${event.menu.id}`)
          .then((res) => res.json())
          .then((data) => {
            console.log('Fetched menu data:', data)
            setMenu(data?.menu || null)
            setDishes(data?.dishes || [])
          })
          .catch((error) => {
            console.error('Error fetching menu data:', error)
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

                        <div className="d-flex flex-row">
                          <IconifyIcon icon="mdi:food" className="me-2" />
                          <div className="d-flex flex-column">
                            <h5 className='mb-1'>{dish.name}</h5>
                            <p className="text-muted">{dish?.description} </p>
                          </div>
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
        <div className="text-center">
          <p>No menu available for this event.</p>
        </div>
      )}
    </>
  )
}

export default ProgressMenu