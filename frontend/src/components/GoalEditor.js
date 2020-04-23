import React, { useState } from 'react'
import TextEditor from './TextEditor'
import './GoalEditor.css'

const InputText = ({ key, label }) => {
  return (
    <div className="form-group row">
      <label for={key} className="col-sm-3 col-form-label">{`${label} :`}</label>
      <div className="col sm-8">
        <input className="form-control" id={key} />
      </div>
    </div>
  )
}

const InputDate = ({ key, label }) => {

  const OneDayInMSecs = 24 * 3600 * 1000
  const OneWeekInMSecs = 7 * OneDayInMSecs

  const getToday = () => {
    const today = new Date().valueOf()
    const time = today % OneDayInMSecs
    return new Date(today - time)
  }

  const nextSunday = (iter) => {
    if (!iter) return nextSunday(getToday())
    return iter.getDay() === 0
      ? iter
      : nextSunday(new Date(iter.valueOf() + OneDayInMSecs))
  }

  const getSunday = (weeksFromNow) =>
    new Date(nextSunday().valueOf() + weeksFromNow * OneWeekInMSecs)

  const dates = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    .map((_, idx) => {
      const date = getSunday(idx - 4)
      return (
        <option
          key={idx}
          selected={idx === 4}
        >{date.toDateString()}</option>
      )
    })

  return (
    <div className="form-group row">
      <label for={key} className="col-sm-3 col-form-label">{`${label} :`}</label>
      <div className="col sm-8">
        <select id={key} className="form-control">
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

  return (
    <div className="GoalEditor">
      <div className="topNavigation">
        <InputText key="title" label="Title" />
        <InputDate key="date" label="Date" />
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