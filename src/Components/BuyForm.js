import React from 'react'
import {useForm} from 'react-hook-form'
export default function BuyForm({product , onClose}) {
  const {register , handleSubmit , reset , formState: {errors }} = useForm();
    const handleCreate=(data)=>{
        onClose()
    }
  return (
    <>
      <form onSubmit={handleSubmit(handleCreate)}>
        <h3>{product.title}</h3>
        <div className="mb-3">
            <label htmlFor="exampleInputName" className="form-label">Full Name</label>
            <input type="text" className="form-control" id="fullName" aria-describedby=""
             {...register("fullName",{required:"Full Name is required" , minLength:{value: 3 , message:"Minnimun 3 characters required"}})}/>
            
        </div>
        <div style={{color: "red"}}>{errors.fullName?.message}</div>
        <div className="mb-3">
            <label htmlFor="exampleEmailInput1" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" aria-describedby=""
            {...register("email",{required:"Email is required " , pattern:{
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address"
            } })}/>
            
        </div>
        <div style={{color: "red"}}>{errors.email?.message}</div>
        <div className="mb-3">
            <label htmlFor="exampleAddress" className="form-label">Address</label>
            <input type="text" className="form-control" id="address" aria-describedby=""
            {...register("address",{required:"Address is required"})}/>
            
        </div>
        <div style={{color: "red"}}>{errors.address?.message}</div>
        <div className="mb-3">
            <label htmlFor="exampleAddress" className="form-label">Password</label>
            <input type="text" className="form-control" id="password" aria-describedby=""
            {...register("Password",{required:"Password is required" , 
            pattern: {value: /^(?=.*[0-9]).{8,}$/, message:"Password must contain atleast one number"},
            minLength:{value: 8 , message: "Passwork must contain 8 characyers"}})}/>
            
        </div>
        <div style={{color: "red"}}>{errors.password?.message}</div>
        <h3>${product.price}</h3>

        <button type="submit" className="btn btn-secondary">Place Order</button>
        <button type="button" style={{marginLeft: '10px'}} className="btn btn-secondary"onClick={onClose}>Cancel</button>
         
      </form>  
    </>
  )
}
