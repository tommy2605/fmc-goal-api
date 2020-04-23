import React, { useState } from 'react'
import TextEditor from './TextEditor'
import InputText from './InputText'
import InputDate, { nextSunday } from './InputDate'
import InputChoice from './InputChoice'

import './GoalEditor.css'

const GoalEditor = (props) => {

  const [title, setTitle] = useState()
  const [date, setDate] = useState(nextSunday().valueOf())
  const [content, setContent] = useState()

  const canPublish = () => {
    return title && title.length > 5
    && content && content.length > 20
  }

  return (
    <div className="GoalEditor">
      <div className="topNavigation">
        <InputText 
          id="title" 
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
        onChange={html => setContent(html)}
      />

      <div className="bottomNavigation">
        <InputChoice
          key="language"
          label="Language"
          choices={["Indonesia", "English", "Nederlands"]} />
        <button
          className="btn btn-success btn-sm"
          disabled={!canPublish()}
        >Publish</button>
      </div>
    </div>
  )
}

export default GoalEditor