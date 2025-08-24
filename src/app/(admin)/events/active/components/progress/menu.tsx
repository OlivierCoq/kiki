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
import ChoicesFormInput from '@/components/form/ChoicesFormInput'

// Types
import { Dish, Menu, Summary } from '@/types/event'

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
  const [menu, setMenu] = useState<any>(event.menu ? event.menu : null)   
  const [menus, setMenus] = useState<any>(null)   
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<any>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [empty_result_msg, setEmpty_result_msg] = useState<string>('')

  // console.log('event summary default', event.summary.production.items[0])
 // Update handlers
  const update_summary = async () => {
    onUpdate(summary)
  }

  const update_quantity = async (dish: Dish, dishId: number, newQuantity: number) => {
    await setSummary((prev: Summary) => {
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
    // console.log('summary updated:', summary);
    if(summaryLoading) {
       update_summary()
    }
  }, [summary]);

  // Load all menus  
  useEffect(() => {
    if(!menus || !menus.length) {
        try {
        fetch(`/api/menus`)
          .then((res) => res.json())
          .then(async (data) => {
            setMenus(data?.menus)
            // console.log('menus', menu)
          })
        
      } catch (error) {
          console.error('Error in useEffect fetching menus:', error)
        }
    } 
  })

  // Load main data. This is some fresh bullshit, but I don't like React
  useEffect(() => { 
    if(!summary) {
      setLoading(true)
      fetch(`/api/events/${event.id}`)
        .then((res) => res.json())
        .then(async (data) => {
          // console.log('smell my asshole', data)
          setSummary(data?.event?.summary)
          setLoading(false)
        })
      }
  })

  useEffect(() => { 
    if(!event.menu) {
      setEmpty_result_msg("No menu found for this event. Click the New Menu button to get started!")
      setLoading(false)
    }
  })
  
  // useEffect(() => {
  //   if (event?.menu) {
  //     try {
  //       fetch(`/api/menus/${event.menu.id}`)
  //         .then((res) => res.json())
  //         .then(async (data) => {
  //           setMenu(data?.menu || null)

  //           /*

  //             {
  //               "production": {
  //               "total_guests": 0,
  //               "price_per_person": 0,
  //               "items": []
  //               },
  //               "total_cost": 0,
  //               "total_revenue": 0,
  //               "total_profit": 0
  //               }
  //           */
  //          if(!event.summary.production.items.length) {
  //           // console.log('dishes empty: ', summary.production.items)
  //           // console.log('wtffff', data.menu)
  //           if(data?.menu?.dishes?.data?.length) {
              
  //               // console.log('dishes full', data?.dishes)
  //               // await updateNestedValue('production.items', data?.dishes, setSummary)
  //               await updateNestedValue('production.items', data?.menu?.dishes?.data, setSummary)
  //               await update_summary()
  //               setLoading(false)
  //             }
            
  //          }
           
  //           setLoading(false)
  //         })
  //         .catch((error) => {
  //           console.error('Error fetching menu data:', error)
  //           setLoading(false)
  //         })
  //         // setLoading(false)
  //     } catch (error) {
  //       console.error('Error in useEffect fetching menu:', error)
  //       setLoading(false)
  //     }
  //   } else {

  //     const timer = setTimeout(async() => {
  //     // Your code here (e.g., fetch data, update state, etc.)
  //       setLoading(false)
  //       setEmpty_result_msg("No menu found for this event. Click the New Menu button to get started!")
  //     }, 1000);

  //     return () => clearTimeout(timer)
  //   }
  // }, [event])


  // Update dishes
  
  const [addingDish, setAddingDish] = useState(false)
  const [postingNewDish, setPostingNewDish] = useState(false)
  const [newDish, setNewDish] = useState<any>({
    name: '',
    category: '',
    description: '',
    menu: event?.menu?.id,
    position: 0,
    price: 0,
    quantity: 0,
    tags: [],
    updating: false
  })
  const addDish = async () => {

    setAddingDish(true)
  }
  const confirmAddDish = async () => {

    setAddingDish(false)
  }
  interface DishItemProps {
    dish: Dish;
    onDishUpdate: (updatedDish: Dish) => void;
  }

  // Dish item sub-component
  const DishItem = ({ dish, onDishUpdate }: DishItemProps) => {

    const [updating, setUpdating] = useState(false);
    const [dishItem, setDishItem] = useState<Dish>(dish)
    const [deleting, setDeleting] = useState<boolean>(false)
    const [posting, setPosting] = useState<boolean>(false)

    // console.log('default dishItem', dishItem.quantity)

    const handleUpdate = async () => {
      setUpdating(true)
      setPosting(true)
      // Simulate async update
      /* 
        - Update dish in db
        - merge dish to dishes array via setDishes
        - Update each quantity via update_quantity(dish, dish.id, dish.quantity)
        - update summary via setSummary
      */
        // Update dish in DB
      fetch(`/api/dishes/update/${dishItem?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( dishItem )
      })
        .then(async (data)=> {
          let update_response = await data.json()
          // console.log('Updated dish: ', update_response)
          setDishItem(update_response?.data)

          // Merge dish with event.menu.dishes array
          // await setMenu(prev => ({
          //   ...prev,
          //   dishes: {
          //     data: prev.dishes.data.map(dish =>
          //       dish?.id === update_response?.data?.id ?  update_response : dish
          //     )
          //   }
          // }))
          let menuObj = menu 

          menuObj.dishes.data =  menu?.dishes?.data?.map((dish: any) =>
            dish?.id === update_response?.data?.id ?  update_response?.data : dish
          )

          await fetch(`/api/menus/update/${menu?.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(menuObj)
          })
            .then((res) => res.json())
            .then(async (data) => {
              // console.log('updated menu data:', data)
              onDishUpdate(update_response?.data)
              update_summary()
              onUpdate(summary)
              setUpdating(false)
              setPosting(false)
            })
            .catch((err)=> {
              console.log('error updating menu: ', err)
            })
          // await fetch(`/api/menus/${event.menu.id}`)
          //   .then((res) => res.json())
          //   .then(async (data: any) => {
          //     console.log('Refetched menu data:', data)
          //     setMenu(data?.menu || null)


          //     onDishUpdate(update_response?.data)
              // setUpdating(false)
              // setPosting(false)

          //   })
        })
        .catch((err)=> {
          console.log('error updating dish: ', err)
        })
    }

    const handleDelete = () => {
      setDeleting(true)
    }

    const confirmDelete = async () => {
      /* 
      - delete dish in db
      - merge dish to dishes array via setDishes
      - Update each quantity via update_quantity(dish, dish.id, dish.quantity)
      - update summary via setSummary
    */
    }
    
    return (
      <div className="d-flex flex-row justify-content-between align-items-center mb-4">

        
         {
          updating && !deleting &&

            <div className="d-flex flex-row w-75 w-sm-100">
              <IconifyIcon icon="mdi:food" className="me-2" />
              <div className="d-flex flex-column" style={{ width: '90%' }}>
                <input className='form-control fade-in mb-1' type='text' defaultValue={dishItem?.name} placeholder='Name'
                  onChange={(e) => { updateNestedValue('name', e.target.value, setDishItem) }}
                />
                <textarea className='form-control fade-in mb-1' rows={3} defaultValue={dishItem?.description} placeholder='Description'
                  onChange={(e) => { updateNestedValue('description', e.target.value, setDishItem) }}
                >
                </textarea>
                <div className="d-flex flex-row">
                  <div className="d-flex flex-column me-2">
                    <label htmlFor="">Cost</label>
                    <div className="d-flex flex-row align-items-center">
                      <small className='me-1'>{ event?.default_currency?.symbol }</small>
                      <input className='form-control fade-in mb-1' type='number' defaultValue={dishItem?.cost} placeholder='0' 
                      onChange={(e) => { updateNestedValue('cost', e.target.value, setDishItem) }}
                    />
                    </div>
                  </div>
                  <div className="d-flex flex-column">
                    <label htmlFor="">Price</label>
                    <div className="d-flex flex-row align-items-center">
                      <small className='me-1'>{ event?.default_currency?.symbol }</small>
                      <input className='form-control fade-in mb-1' type='number' defaultValue={dishItem?.price} placeholder='0'
                        onChange={(e) => { updateNestedValue('price', e.target.value, setDishItem) }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column justify-contents-center align-items-center">
                <button className='btn btn-xs p-0 bg-transparent btn-outline-transparent btn-outline-none' disabled={posting} onClick={() => setUpdating(false)}>
                  <IconifyIcon icon="bx:edit" className="m-2 cursor-pointer" fontSize={15}    />
                </button>
                <IconifyIcon 
                  icon={ posting ? "mdi:loading" : "bx:check"} 
                  className={posting ? 'mb-4 text-danger spinner-border' : 'mb-4 text-success cursor-pointer' } 
                  fontSize={15} 
                  onClick={() => handleUpdate()}   />
                  {/* <IconifyIcon icon="mdi:loading" className="spinner-border text-primary" />  */}
                <IconifyIcon icon="bx:trash" className='text-danger text-sm p-2 cursor-pointer' fontSize={15} onClick={() => handleDelete()}   />
              </div>
            </div>
         }
          
          
         {

          !updating && !deleting &&

            <div className="d-flex flex-row w-75 w-sm-100">
              <IconifyIcon icon="mdi:food" className="me-2" />
              <div className="d-flex flex-column">
                <h5 className='mb-1'>{dishItem.name} &nbsp; 
                  <IconifyIcon icon="bx:edit" className="me-2 cursor-pointer" onClick={() => setUpdating(true)}  />
                </h5>
                <p className="text-muted">{dishItem?.description} </p>
                <div className="w-full d-flex flex-row">
                  <div className="d-flex me-2">
                    <p className="font-bold font-strong me-1 mb-0 ">Cost:</p>
                    <small>{formatCurrency(event?.default_currency, dishItem?.cost)}</small>
                  </div>
                  <div className="d-flex">
                    <p className="font-bold font-strong me-1 mb-0 ">Price:</p>
                    <small>{formatCurrency(event?.default_currency, dishItem?.price)}</small>
                  </div>
                </div>
              </div> 
            </div>
         }

         {
          deleting &&

            <div className="d-flex flex-column fade-in">
              <div className="d-flex flex-row w-full">
                <p>Do you really want to delete {dish?.name } ?</p>
              </div>
               <div className="d-flex flex-row justify-content-center align-items-center">
                <button className="btn btn-sm btn-secondary me-2" onClick={() => setDeleting(false)}>Cancel</button>
                <button className="btn btn-sm btn-danger" onClick={() => confirmDelete}>Confirm</button>
               </div>
            </div>

         }
        
        

        

        <div className=''>
          {/* Number */}
          <label>Quantity</label>
          <input
            type='number'
            className='form-control'
            onChange={(e) => { 
              setSummaryLoading(true)
              update_quantity(dishItem, dishItem.id, Number(e.target.value))
             }}
            defaultValue={dishItem.quantity}
          />
        </div>
        {/* <Link href={`/admin/menus/${menu.id}/dishes/${dish.id}`} className="btn btn-primary btn-sm">
          Edit Dish
        </Link> */}
      </div>
    )
  }



  // New Menu
  const [newMenu, setNewMenu] = useState<boolean>(false) 
  const toggleNewMenu = () => {
    setNewMenu(!newMenu)
  }
  const submitNewMenu = async () => {

    try {

    }
    catch{
      (error: any) => {
        console.log('Error submitting new Menu', error)
      }
    }
  }


  return (
    <>
      <div>
        <Row className='m-3'>
          <Col md={6}></Col>
          <Col md={6}>
            <Row>
              <Col md={9}>
                {
                menus && (
                  // onChange={setMenu} once we figure out wtf is going on
                  <ChoicesFormInput className="form-control" data-choices id="choices-single-default" defaultValue={menu?.id} >
                    { menus?.map((menu: any, i: number) => (
                      <option value={menu?.id} key={i}>{ menu?.name }</option>
                    ))}

                    </ChoicesFormInput>

                  )
                }
              </Col>
        
            <Col md={3}>
              <button className="btn btn-primary btn-sm mt-1" onClick={toggleNewMenu}>
               New Menu
                <IconifyIcon icon="bx:plus" />
              </button>
            </Col>
            
            </Row>
    
          </Col>
        </Row>

      {
        loading &&
        <div className="text-center my-5">
          {/* Loading animation */}
          <IconifyIcon icon="mdi:loading" className="spinner-border text-primary" />
        </div>
       }

      
       {
         menu && !newMenu && 

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
                    {summary?.production?.items?.map((dish: Dish) => (
                     <DishItem key={dish.id} dish={dish} onDishUpdate={updatedDish => {
                          setSummary((prev: Summary) => ({
                            ...prev,
                            production: {
                              ...prev.production,
                              items: prev.production.items.map((item: any) =>
                                item.id === updatedDish.id ? updatedDish : item
                              ),
                            },
                          }));
                          // Optionally, call your API here to update the summary in the DB
                          update_quantity(updatedDish, updatedDish?.id, updatedDish?.quantity) 
                        }} />

                    ))}
                  </ul>

                  {
                    addingDish &&

                    <div className="d-flex flex-row w-75 w-sm-100">
                      <IconifyIcon icon="mdi:food" className="me-2" />
                      <div className="d-flex flex-column" style={{ width: '90%' }}>
                        <input className='form-control fade-in mb-1' type='text' defaultValue={newDish?.name} placeholder='Name'
                          onChange={(e) => { updateNestedValue('name', e.target.value, setNewDish) }}
                        />
                        <textarea className='form-control fade-in mb-1' rows={3} defaultValue={newDish?.description} placeholder='Description'
                          onChange={(e) => { updateNestedValue('description', e.target.value, setNewDish) }}
                        >
                        </textarea>
                        <div className="d-flex flex-row">
                          <div className="d-flex flex-column me-2">
                            <label htmlFor="">Cost</label>
                            <div className="d-flex flex-row align-items-center">
                              <small className='me-1'>{ event?.default_currency?.symbol }</small>
                              <input className='form-control fade-in mb-1' type='number' defaultValue={newDish?.cost} placeholder='0' 
                              onChange={(e) => { updateNestedValue('cost', e.target.value, setNewDish) }}
                            />
                            </div>
                          </div>
                          <div className="d-flex flex-column">
                            <label htmlFor="">Price</label>
                            <div className="d-flex flex-row align-items-center">
                              <small className='me-1'>{ event?.default_currency?.symbol }</small>
                              <input className='form-control fade-in mb-1' type='number' defaultValue={newDish?.price} placeholder='0'
                                onChange={(e) => { updateNestedValue('price', e.target.value, setNewDish) }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-column justify-contents-center align-items-center">
                        <button className='btn btn-xs p-0 bg-transparent btn-outline-transparent btn-outline-none' disabled={postingNewDish} onClick={() => setPostingNewDish(false)}>
                          <IconifyIcon icon="bx:edit" className="m-2 cursor-pointer" fontSize={15}    />
                        </button>
                        <IconifyIcon 
                          icon={ postingNewDish ? "mdi:loading" : "bx:check"} 
                          className={postingNewDish ? 'mb-4 text-danger spinner-border' : 'mb-4 text-success cursor-pointer' } 
                          fontSize={15} 
                          onClick={() => confirmAddDish()}   />
                          {/* <IconifyIcon icon="mdi:loading" className="spinner-border text-primary" />  */}
                        <IconifyIcon icon="bx:x" className='text-danger cursor-pointer' fontSize={20} onClick={() => setAddingDish(false)}   />
                      </div>
                    </div>
                  }

                  <div className="d-flex flex-row justify-content-end">
                    <button 
                      className="btn btn-primary"
                      onClick={addDish}
                    >
                      Add dish
                    </button>
                  </div>
                  

                </Card.Body>
              </Card>
            </Col>
          </Row>
       }

       

       {
        (!loading && !newMenu && !menu ) &&

        <div className="text-center">
          <p>{ empty_result_msg }</p>
        </div>

       }

      </div>

    </>
  )
}

export default ProgressMenu