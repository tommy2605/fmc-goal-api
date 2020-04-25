import React from 'react'

const InputChoice = ({ id, label, value, choices, onChange }) => {
  return (
    <div className="form-group row">
      <label htmlFor={id} className="col-sm-3 col-form-label">{`${label} :`}</label>
      <div className="col sm-8">
        <select 
          id={id} 
          className="form-control" 
          value={value}
          onChange={e => onChange(e.target.value)} >
          {
            choices.map(item => {
              const keyText = item.match(/(.+)\/(.+)/)
              const key = keyText ? keyText[1] : item
              const text = keyText ? keyText[2] : item
              return (
                <option key={key} value={key}>{text}</option>
              )
            })
          }
        </select>
      </div>
    </div>
  )
}

export default InputChoice