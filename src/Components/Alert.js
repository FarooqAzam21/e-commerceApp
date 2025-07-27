import React from 'react'
export default function Alert({alert , showAlert , loader}) {
  
  return (
    <div>
      <>
        {alert && <div className={`alert alert-${alert.type}`} role="alert">
            {alert.message}
        </div>}
        
      </>
    </div>
  )
}
