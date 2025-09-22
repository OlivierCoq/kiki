'use client'
// React
import { useEffect, useState, useRef, memo } from 'react'
import Link from 'next/link'
import debounce from 'lodash.debounce'


// Icons
import IconifyIcon from '@/components/wrappers/IconifyIcon'
// Bootstrap
import { 
  Col, 
  Row,
  Card
} from 'react-bootstrap'

import dynamic from 'next/dynamic'
const ChoicesFormInput = dynamic(
  () => import('@/components/form/ChoicesFormInput'),
  { ssr: false }
)

// Types
import { Dish, Menu, Summary, Event } from '@/types/event'

// Helpers
import updateNestedValue from '@/helpers/NestedFields'
import formatCurrency from '@/helpers/FormatCurrency'

// Context
import { useEvent } from "@/context/useEventContext";
import { update } from 'lodash'



interface EventMenuProps {
  event: any;
  parentData: any;
  onUpdateEvent: (newEvent: Event) => void
}
const ProgressMenu = ({
  event,
  onUpdate,
}: {
  event: Event
  onUpdate: (event: Event) => void
}) => {

  console.log('Editing BEO:', event?.menu)

  // Context

  // Main Menu
    // State
  const [menu, setMenu] = useState<any>(null)
  const [loadingMenu, setLoadingMenu] = useState<boolean>(true) 
  const [postingMenu, setPostingMenu] = useState<boolean>(false) 
  
    // Context
  const { menuItems, setMenuItems } = useEvent();
  // console.log('E: ', menuItems)
    // Methods
      // fetch main menu
  useEffect(() => {
    setLoadingMenu(true)
    try {
      fetch(`/api/menus/${event?.menu}`)
        .then(async(data)=> {
          const new_menu = await data.json()
          // console.log('whaaaaa', new_menu)
          setMenu(new_menu?.menu)
          setLoadingMenu(false)
        })
    }
    catch (error) {
      console.error('Error in useEffect fetching menu:', error)
    } 
  }, [])
  const updateMenu = async (e: any) => {
    
    
    const target_menu = menus?.find((m: any) => m?.id === Number(e))
    
    setMenu(target_menu)



    // update db
    await fetch(`/api/events/update/${event?.id}`, {
       method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ menu: target_menu?.id })
    })
     .then(async (data) => {
        // console.log('target_menu', target_menu)
        const event_update = await data.json()
        
        console.log('event update', event_update)
        onUpdate(event_update?.event)
     })
  }
  
  // Multiple Menus (For selecting and stuff)
    // State
  const [menus, setMenus] = useState<any>(null)
  const [postingMenus, setPostingMenus] = useState<boolean>(false) 
    // Methods
  useEffect(() => {
    setPostingMenus(true)
    if(!menus || !menus.length) {
        try {
        fetch(`/api/menus`)
          .then((res) => res.json())
          .then(async (data) => {
            setMenus(data?.menus)
            setPostingMenus(false)
            // console.log('menus', menu)
          })
        
      } catch (error) {
          console.error('Error in useEffect fetching menus:', error)
        }
    } 
  }, [menus])

  // New Menu
    // State
  const [newMenu, setNewMenu] = useState<boolean>(false) 
  const [postingNewMenu, setPostingNewMenu] = useState<boolean>(false) 
  const [newMenuObj, setNewMenuObj] = useState<any>({
    archived: false,
    name: '',
    description: '',
    dishes: [],
    is_public: true,
    packages: {
      data: []
    },
    price_per_person: 0,
    tags: [] 
  })
    // Methods

  // Dishes
    // Methods
    // Components
  const [addingDish, setAddingDish] = useState(false)
  const [postingNewDish, setPostingNewDish] = useState(false)
  const [newDish, setNewDish] = useState<any>({
    name: '',
    category: '',
    description: '',
    menu: event?.menu,
    position: 0,
    price: 0,
    quantity: 0,
    tags: [],
    updating: false
  })

  const saveQuantity = async (dish: Dish, quantity: number) => {

    let menuObj = menu
    console.group('saveQuantity', dish, quantity)
    menuObj.dishes = menuItems

    try {
      await fetch(`/api/menus/update/${dish?.menu}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuObj),
      });
    } catch (err) {
      console.error('Failed to save quantity:', err);
    }
  }
  const debouncedSaveQuantity = debounce(saveQuantity, 500)

  const update_quantity = async (dish: Dish, newQuantity: number) => {

    // if BEO status is confirmed, change to in_progress
    if(event?.progress?.data[1]?.status === 'confirmed' || event?.progress?.data[1]?.status === null) {
      updateBEOStatus('in_progress')
    }

    setMenuItems((prev: Dish[]) =>
      prev.map(d =>
        d.id === dish.id ? { ...d, quantity: newQuantity } : d
      )
    )
    debouncedSaveQuantity(dish, newQuantity)
  }
  const confirmAddDish = async () => {
    setPostingNewDish(true)
    // Validate:
    if(!newDish.name) {
      // setPostingNewDish(false)
      return 
    } else {

      fetch('/api/dishes/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( newDish )
      })
        .then(async (data) => {
          let new_dish_obj = await data.json()
          console.log('added dish to db', new_dish_obj)
          
          let menuObj = menu

          menuObj?.dishes?.push(new_dish_obj?.dish)
          console.log('updating menu dishes: ', menuObj.dishes.data)
          await fetch(`/api/menus/update/${event?.menu}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify( menuObj )
          })
            .then(async (data) => {
              let updated_menu_data = await data.json()
              console.log('updated menu', updated_menu_data)

              
              await update_quantity(new_dish_obj?.dish, 1)
              
              
              setPostingNewDish(false)
              setAddingDish(false)
              onUpdate(event)


              // push to menuItems in UI as well:
              setMenuItems((prev: Dish[]) => [...prev, new_dish_obj?.dish] )
              // setMenu(updated_menu_data?.menu)
            })
        })
    }
  }
  interface DishItemProps {
    dish: Dish;
    onDishUpdate: (updatedDish: Dish) => void;
  }

  // Dish item sub-component
  const DishItem = memo(({ dish, onDishUpdate }: DishItemProps) => {

    const [updating, setUpdating] = useState(false);
    const [dishItem, setDishItem] = useState<Dish>(dish)
    const [deleting, setDeleting] = useState<boolean>(false)
    const [posting, setPosting] = useState<boolean>(false)

    // Local quantity to fix that annoying ass re-render
    const [localQuantity, setLocalQuantity] = useState(dish.quantity)
    useEffect(() => {
      setLocalQuantity(dish.quantity);
    }, [dish.quantity])

    // console.log('default dishItem', dishItem.quantity)

    const quantityInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (quantityInputRef.current && document.activeElement === quantityInputRef.current) {
        quantityInputRef.current.focus();
      }
    }, [dishItem.quantity])

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

          menuObj.dishes.data =  menu?.dishes?.map((dish: any) =>
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

              setUpdating(false)
              setPosting(false)
              onUpdate(event)
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

    const confirmDeleteDish = async (dish: Dish) => {
      /* 
      - delete dish in db
      - merge dish to dishes array via setDishes
      - Update each quantity via update_quantity(dish, dish.id, dish.quantity)
      - update summary via setSummary
    */
      console.log('help', dish, dish.id)

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
                <IconifyIcon icon="bx:trash" className='text-danger cursor-pointer' fontSize={15} onClick={() => handleDelete()}   />
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
                <p>Do you really want to delete <strong>{dish?.name }</strong> ?</p>
              </div>
               <div className="d-flex flex-row justify-content-center align-items-center">
                <button className="btn btn-sm btn-secondary me-2" onClick={() => setDeleting(false)}>Cancel</button>
                <button className="btn btn-sm btn-danger" onClick={() => confirmDeleteDish(dish)}>Confirm</button>
               </div>
            </div>

         }
        
        

        

        <div className=''>
          {/* Number */}
          <label>Quantity</label>
          <input
            id={`quantity-input-${dishItem?.id}`}
            type='number'
            className='form-control'
            onChange={e => setLocalQuantity(Number(e.target.value))}
            onBlur={() => { update_quantity(dishItem, localQuantity) }}
            onFocus={e => e.target.select()}
            value={localQuantity}
          />
        </div>
        {/* <Link href={`/admin/menus/${menu.id}/dishes/${dish.id}`} className="btn btn-primary btn-sm">
          Edit Dish
        </Link> */}
      </div>
    )
  })

  const [postingBeoStatus, setPostingBeoStatus] = useState<boolean>(false)
  const updateBEOStatus = async (status: string) => {
      // for ui 
    setPostingBeoStatus(true)

    const progress_obj = event?.progress
    ? { ...event.progress, data: [...event.progress.data] }
    : { data: [] }

    if (progress_obj.data[1]) {
      progress_obj.data[1] = { ...progress_obj.data[1], status, date: new Date().toISOString() }
    }


    await fetch(`/api/events/update/${event?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: event?.id, progress: progress_obj })
    })
      .then(async (data) => {
        const event_update = await data.json()
        console.log('event update', event_update)
        onUpdate(event_update?.event)
        setPostingBeoStatus(false)
      })

  }

  return (
    <>
    

      {
        loadingMenu &&
        <div className="text-center my-5">
          {/* Loading animation */}
          <IconifyIcon icon="mdi:loading" className="spinner-border text-primary" />
        </div>
      }

        <Row className='m-3'>
          <Col md={6}></Col>
          <Col md={6}>
            <Row>
              <Col md={9}>
                {
                menus && (
                  // onChange={setMenu} once we figure out wtf is going on
                  <ChoicesFormInput className="form-control" data-choices id="choices-single-default" defaultValue={menu?.id} onChange={(e)=> {
                      updateMenu(e)
                  }}> 
                    { menus?.map((menu: any, i: number) => (
                      <option value={menu?.id} key={i}>{ menu?.name }</option>
                    ))}
                  </ChoicesFormInput>
                  )
                }
              </Col>
        
              <Col md={3}>
                <button className="btn btn-primary btn-sm mt-1" onClick={() => { setNewMenu(!newMenu)}}>
                  New Menu
                  <IconifyIcon icon="bx:plus" />
                </button>
              </Col>
            
            </Row>
    
          </Col>
        </Row>

      {
        loadingMenu &&
        <div className="text-center my-5">
          {/* Loading animation */}
          <IconifyIcon icon="mdi:loading" className="spinner-border text-primary" />
        </div>
      }

      {
        !loadingMenu && menu && menuItems.length > 0 && !newMenu &&

        <Row className='m-3'>
          <Col>
            <Card className='shadow-sm'>
              <Card.Header>
                <h4 className='mb-2'>Menu: {menu.name}</h4>
                <p>{menu.description}</p>
              </Card.Header>
              <Card.Body className='overflow-y-scroll' style={{'height': '40vh'}}>
                {/* List menu items: */}

                <ul className="list-unstyled">
                  {menuItems?.map((dish: Dish) => (
                    <DishItem key={dish?.id} dish={dish} onDishUpdate={updatedDish => {
                        
                        // Optionally, call your API here to update the summary in the DB
                        update_quantity(updatedDish, updatedDish?.quantity) 
                      }} />

                  ))}
                </ul>

                {
                  addingDish &&

                  <div className="d-flex flex-row w-75 w-sm-100">
                    <IconifyIcon icon="mdi:food" className="me-2" />
                    <div className="d-flex flex-column" style={{ width: '90%' }}>
                      <input className='form-control fade-in mb-1' type='text' defaultValue={newDish?.name} placeholder='Dish Name'
                        onChange={(e) => { updateNestedValue('name', e.target.value, setNewDish) }}
                      />
                      {
                        !newDish.name && postingNewDish &&

                        <small className='text-danger'>Please add a name</small>
                      }
                      <textarea className='form-control fade-in mb-1' rows={3} defaultValue={newDish?.description} placeholder='Dish Description'
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
                        <IconifyIcon icon="bx:plus" className="m-2 cursor-pointer" fontSize={15}    />
                      </button>
                      <IconifyIcon 
                        icon={ postingNewDish ? "mdi:loading" : "bx:check"}
                        className={(!newDish.name && postingNewDish) ? "mb-4 text-neutral" : "mb-4 text-success cursor-pointer"}
                        fontSize={20} 
                        onClick={() => confirmAddDish()}   />
                        {/* <IconifyIcon icon="mdi:loading" className="spinner-border text-primary" />  */}
                      <IconifyIcon icon="bx:x" className='text-danger cursor-pointer' fontSize={20} onClick={() => setAddingDish(false)}   />
                    </div>
                  </div>
                }

                <div className="d-flex flex-column justify-content-end align-items-end w-25 ms-auto">
                  <button 
                    className="btn btn-primary mb-2"
                    onClick={() => { setAddingDish(true)}}
                  >
                    Add dish
                  </button>
                  <button 
                    className="btn btn-success"
                    onClick={() => { updateBEOStatus('confirmed') }}
                    disabled={postingBeoStatus || event?.progress?.data[1]?.status === 'confirmed'}
                  >
                    Complete BEO
                  </button>
                </div>
                

              </Card.Body>
            </Card>
          </Col>
        </Row>
      }

      {
        !loadingMenu && menu && !menuItems.length && !newMenu &&

        <Row>
          {
            addingDish ? 

            <Col md={8} className="mx-auto">
              <Card className='shadow-sm'>
                <Card.Header>
                  <h4 className='mb-2'>Add New Dish</h4>
                  <p>This menu has no dishes yet. Start by adding a dish.</p>
                  <div className="d-flex flex-row w-75 w-sm-100">
                    <IconifyIcon icon="mdi:food" className="me-2" />
                    <div className="d-flex flex-column" style={{ width: '90%' }}>
                      <input className='form-control fade-in mb-1' type='text' defaultValue={newDish?.name} placeholder='Dish Name'
                        onChange={(e) => { updateNestedValue('name', e.target.value, setNewDish) }}
                      />
                      {
                        !newDish.name && postingNewDish &&

                        <small className='text-danger'>Please add a name</small>
                      }
                      <textarea className='form-control fade-in mb-1' rows={3} defaultValue={newDish?.description} placeholder='Dish Description'
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
                        <IconifyIcon icon="bx:plus" className="m-2 cursor-pointer" fontSize={15}    />
                      </button>
                      <IconifyIcon 
                        icon={ postingNewDish ? "mdi:loading" : "bx:check"}
                        className={(!newDish.name && postingNewDish) ? "mb-4 text-neutral" : "mb-4 text-success cursor-pointer"}
                        fontSize={20} 
                        onClick={() => confirmAddDish()}   />
                        {/* <IconifyIcon icon="mdi:loading" className="spinner-border text-primary" />  */}
                      <IconifyIcon icon="bx:x" className='text-danger cursor-pointer' fontSize={20} onClick={() => setAddingDish(false)}   />
                    </div>
                  </div>
                </Card.Header>
              </Card>
            </Col>

            :

            <Col md={12}>
              <div className="text-center my-5">
                <p>No dishes in this menu yet.</p>
                <button
              className="btn btn-primary mb-2"
              onClick={() => { setAddingDish(true) }}
              >
                Add dish
              </button>
              </div>
            </Col>
          }
        </Row>
          
      }



    </>
  )
 }
export default ProgressMenu