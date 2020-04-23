import React, { useState } from 'react'
import TextEditor from './TextEditor'
import './GoalEditor.css'

const InputText = ({ key, label, value, onChange }) => {
  return (
    <div className="form-group row">
      <label for={key} className="col-sm-3 col-form-label">{`${label} :`}</label>
      <div className="col sm-8">
        <input 
          className="form-control" 
          id={key}
          value={value}
          onChange={e => onChange(e.target.value)} />
      </div>
    </div>
  )
}
const OneDayInMSecs = 24 * 3600 * 1000
const OneWeekInMSecs = 7 * OneDayInMSecs

const nextSunday = (iter) => {

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

const InputDate = ({ key, label, value, onChange }) => {


  const getSunday = (weeksFromNow) =>
    new Date(nextSunday().valueOf() + weeksFromNow * OneWeekInMSecs)

  const isSelected = (date, idx) => {
    if (date) return date.valueOf() === nextSunday().valueOf()
    return idx === 4
  }

  const dates = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    .map((_, idx) => {
      const date = getSunday(idx - 4)
      return (
        <option
          key={idx}
          selected={isSelected(date, idx)}
        >{date.toDateString()}</option>
      )
    })
  
  return (
    <div className="form-group row">
      <label for={key} className="col-sm-3 col-form-label">{`${label} :`}</label>
      <div className="col sm-8">
        <select 
          id={key} 
          className="form-control"
          value={value}
          onChange={e => onChange(new Date(e.target.value))} >
          {dates}
        </select>
      </div>
    </div>
  )
}

const InputChoice = ({ key, label, choices }) => {
  return (
    <div className="form-group row">
      <label for={key} className="col-sm-3 col-form-label">{`${label} :`}</label>
      <div className="col sm-8">
        <select id={key} className="form-control">
          {
            choices.map(item => {
              return (
                <option key={item}>{item}</option>
              )
            })
          }
        </select>
      </div>
    </div>
  )
}

const GoalEditor = (props) => {

  const [title, setTitle] = useState()
  const [date, setDate] = useState()

  return (
    <div className="GoalEditor">
      <div>{date && date.toString()}</div>
      <div className="topNavigation">
        <InputText 
          key="title" 
          label="Title" 
          value={title}
          onChange={value => setTitle(value)}/>

        <InputDate 
          key="date" 
          label="Date"
          value={date}
          onChange={value => setDate(value)} />
      </div>
      
      <TextEditor
        width={props.width}
        height={props.height}
      />

      <div className="bottomNavigation">
        <InputChoice
          key="language"
          label="Language"
          choices={["Indonesia", "English", "Nederlands"]} />
        <button
          className="btn btn-success btn-sm"
        >Publish</button>
      </div>
    </div>
  )
}

export default GoalEditor