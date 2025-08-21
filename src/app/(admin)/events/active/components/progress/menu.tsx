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
import { Dish, Summary } from '@/types/event'

// Helpers
import updateNestedValue from '@/helpers/NestedFields'
import formatCurrency from '@/helpers/FormatCurrency'

interface EventMenuProps {
  event: any;
  parentData: any;
  onUpdate: (summary: any) => void | Promise<void>; // Callback function to handle update
}
const ProgressMenu = ({ event, parentData, onUpdate = () => {} }: EventMenuProps) => {


  // console.log('Edit Menu here...', event?.menu ? event.menu : null)

  // Fetch menu from /api/menus/[id] endpoint
  const [menu, setMenu] = useState<any>(null)   
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<Summary>(event.summary ? event.summary : null)

  const update_summary = async () => {
    onUpdate(summary)
  }

  const update_quantity = (dish: Dish, dishId: number, newQuantity: number) => {
    setSummary((prev: Summary) => {
      const newItems = prev.production.items.map((item: any) =>
        item.id === dishId ? { ...item, quantity: newQuantity } : item
      );
      // console.log('newItems', newItems)
      // Calculate new total_cost based on all items' quantity * cost
      const newTotalCost = newItems.reduce(
        (sum: number, item: any) => sum + (item.quantity * item.cost),
        0
      );

      const newTotalRevenue = newItems.reduce(
        (sum: number, item: any) => sum + (item.quantity * item.price),
        0
      )

      // console.log('new total cost', newTotalCost)
      return {
        ...prev,
        total_cost: newTotalCost,
        total_revenue: newTotalRevenue,
        production: {
          ...prev.production,
          items: newItems,
          total_guests: Number(parentData()?.production?.total_guests)
        },
      };
    });
  }


  // Detect changes to Summary and send up component line, then to db:
  useEffect(() => {
    console.log('summary updated:', summary);
    update_summary()
  }, [summary]);

  // Load data 

  // Detect changes in summary externally
  // useEffect(() => {

  // }, [parentData])


  useEffect(() => {
    if (event?.menu) {
      try {
        fetch(`/api/menus/${event.menu.id}`)
          .then((res) => res.json())
          .then(async (data) => {
            console.log('Fetched menu data:', data)
            setMenu(data?.menu || null)
            await setDishes(data?.dishes)

            /*

              {
                "production": {
                "total_guests": 0,
                "price_per_person": 0,
                "items": []
                },
                "total_cost": 0,
                "total_revenue": 0,
                "total_profit": 0
                }


              if (data?.venue_img_files?.length) {
                      updateNestedValue('venue.images', [...(newEvent.venue.images ?? []), ...data.venue_img_files], setNewEvent)
                      setStatus('Images uploaded successfully.')
                    } 

            */
           if(!summary.production.items.length) {
            // console.log('dishes empty: ', summary.production.items)
            if(data.dishes.length) {
              // console.log('dishes full', data?.dishes)
              // await updateNestedValue('production.items', data?.dishes, setSummary)
              updateNestedValue('production.items', data?.dishes, setSummary)
              setLoading(false)
            }
             
           }

            
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
                   {summary.production.items.map((dish) => (
                     <li key={dish.id}>

                        <div className="d-flex flex-row justify-content-between align-items-center mb-4">

                          <div className="d-flex flex-row w-75 w-sm-100">
                            <IconifyIcon icon="mdi:food" className="me-2" />
                            <div className="d-flex flex-column">
                              <h5 className='mb-1'>{dish.name}</h5>
                              <p className="text-muted">{dish?.description} </p>
                              <div className="w-full d-flex flex-row">
                                <div className="d-flex me-2">
                                  <p className="font-bold font-strong me-1 mb-0 ">Cost:</p>
                                  <small>{formatCurrency(dish?.cost)}</small>
                                </div>
                                <div className="d-flex">
                                  <p className="font-bold font-strong me-1 mb-0 ">Price:</p>
                                  <small>{formatCurrency(dish?.price)}</small>
                                </div>
                              </div>
                            </div> 
                          </div>

                          <div className=''>
                            {/* Number */}
                            <label>Quantity</label>
                            <input
                              type='number'
                              className='form-control'
                              onChange={(e) => { update_quantity(dish, dish.id, Number(e.target.value)) }}
                              value={dish.quantity}
                            />
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

export default ProgressMenu