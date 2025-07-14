'use-client'
import { useEffect, useState } from 'react'
import { 
  Col, 
  Row 
} from 'react-bootstrap'

// Export toggleProgress function to allow toggling of progress steps


export const EventProgressBar = ({ progress }: { progress: any }) => {

  const [progress_obj, set_progress_obj] = useState({
    venue: true,
    tasting: false,
    menu: false,
    quote: false,
    contract: false,
    invites: false,
    ingredients: false,
    production: false,
    delivery: false
  })
  const progress_width = (milestone: any) => {
    switch(milestone?.status) {
      case null:
        return '0%'
        break;
      case "in_progress":
        return '50%'
        break;
      case "confirmed":
        return '100%'
        break;
      default:
        return '0%';
    }
  }
  const progress_class = (milestone: any) => {
    switch(milestone?.status) {
      case null:
        return ''
        break;
      case "in_progress":
        return 'bg-warning'
        break;
      case "confirmed":
        return 'bg-success'
        break;
      default:
        return '';
    }
  }
  const toggleProgress = (key: keyof typeof progress_obj) => {
    set_progress_obj(prev => {
      const allFalse = Object.keys(prev).reduce((acc, k) => {
        acc[k as keyof typeof progress_obj] = false
        return acc
      }, {} as typeof progress_obj)
  
      // If already selected, toggle off (set all false), else set only this one to true
      const isAlreadyTrue = prev[key]
      return isAlreadyTrue
        ? allFalse
        : { ...allFalse, [key]: true }
    })
  }
  const progress_db_obj = {
    "data": [
      {
        "label": "Venue",
        "status": null,
        "date": null,
        "action": "update_venue"
      },
      {
        "label": "Tasting",
        "status": null,
        "date": null
      },
       {
        "label": "Menu",
        "status": null,
        "date": null
      },
      {
        "label": "Quote",
        "status": null,
        "date": null
      },
      {
        "label": "Contract",
        "status": null,
        "date": null
      },
      {
        "label": "Invites",
        "status": null,
        "date": null
      },
      {
        "label": "Ingredients",
        "status": null,
        "date": null
      },
      {
        "label": "Production",
        "status": null,
        "date": null
      },
       {
        "label": "Delivery",
        "status": null,
        "date": null
      }
    ]
  }

  return (
    <Row>
      {
      progress?.data?.map((milestone: any, i: number)=> (
          <Col key={i} className='cursor-pointer' onClick={() => toggleProgress(milestone?.label?.toLowerCase())}>
            <div className="progress mt-3" style={{ height: 10 }} >
              
              <div
                className={`progress-bar progress-bar progress-bar-striped progress-bar-animated ${progress_class(milestone) }`}
                role="progressbar"
                style={{ width: progress_width(milestone) }}
                aria-valuenow={70}
                aria-valuemin={0}
                aria-valuemax={70}></div>
            </div>
            <small className='ms-1 cursor-pointer'>{ milestone?.label }</small>
          </Col>
        ))
      }
    </Row>
  )
}