import React from 'react'

const OneDayInMSecs = 24 * 3600 * 1000
const OneWeekInMSecs = 7 * OneDayInMSecs

export const nextSunday = (iter) => {

  const getToday = () => {
    const today = new Date().valueOf()
    const time = today % OneDayInMSecs
    return new Date(today - time)
  }  

  if (!iter) return nextSunday(getToday())
  return iter.getDay() === 0
    ? iter
    : nextSunday(new Date(iter.valueOf() + OneDayInMSecs))
}

const InputDate = ({ id, label, value, onChange }) => {


  const getSunday = (weeksFromNow) =>
    new Date(nextSunday().valueOf() + weeksFromNow * OneWeekInMSecs)

  const dates = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    .map((_, idx) => {
      const date = getSunday(idx - 4)
      return (
        <option
          key={idx}
          value={date.valueOf()}
        >{date.toDateString()}</option>
      )
    })
  
  return (
    <div className="form-group row">
      <label htmlFor={id} className="col-sm-3 col-form-label">{`${label} :`}</label>
      <div className="col sm-8">
        <select 
          id={id} 
          className="form-control"
          value={value}
          onChange={e => onChange(parseInt(e.target.value))} >
          {dates}
        </select>
      </div>
    </div>
  )
}

export default InputDate