import React from 'react'

const CustomInput = (props) => {
  const {type, lable, i_id, i_class, name, val, onch} = props;
  return (
    <div className="form-floating mb-3">
      <input 
      type={type} 
      className={`form-control ${i_class}`} 
      id={i_id} placeholder={lable} name={name} value={val} onChange={onch} onBlur={onch}
      />
      <label htmlFor={lable}>{lable}</label>
    </div>
  )
}

export default CustomInput