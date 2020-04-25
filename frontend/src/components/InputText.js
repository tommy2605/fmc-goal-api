import React from 'react'

const InputText = ({ id, label, value, onChange }) => {
  return (
    <div className="form-group row">
      <label htmlFor={id} className="col-sm-3 col-form-label">{`${label} :`}</label>
      <div className="col sm-8">
        <input 
          className="form-control" 
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)} />
      </div>
    </div>
  )
}

export default InputText