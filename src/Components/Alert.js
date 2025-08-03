import React from 'react'
import './chatbot/chatbot.css'
export default function Alert({alert , showAlert , loader , open ,isOpen}) {
  
  return (
    <div>
      <>
        {alert && open && <div  className={`alert alert-${alert.type} d-flex justify-content-between align-items-center`} role="alert">
            {alert.message}
            <button className='close-btn btn btn-sm btn-outline-light' onClick={()=> isOpen(false)}>❌</button>
        </div>}
        
      </>
    </div>
  )
}
