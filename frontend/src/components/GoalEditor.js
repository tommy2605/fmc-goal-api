import React, { useState } from 'react'
import franc from 'franc'
import TextEditor from './TextEditor'
import InputText from './InputText'
import InputDate, { nextSunday } from './InputDate'
import InputChoice from './InputChoice'

import './GoalEditor.css'

const GoalEditor = (props) => {

  const [title, setTitle] = useState()
  const [date, setDate] = useState(nextSunday().valueOf())
  const [content, setContent] = useState()
  const [lang, setLang] = useState()

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
        onChange={html => {
          setContent(html)
          const text = html.replace(/<\/?[a-z0-9]+>/g,' ')
          const lang = franc(text)
          if (['ind', 'nld', 'eng'].includes(lang)) setLang(lang)
        }}
      />

      <div className="bottomNavigation">
        <InputChoice
          key="language"
          label="Language"
          value={lang}
          onChange={newLang => setLang(newLang)}
          choices={["ind/Indonesia", "eng/English", "nld/Nederlands"]} />
        <button
          className="btn btn-success btn-sm"
          disabled={!canPublish()}
        >Publish</button>
      </div>
    </div>
  )
}

export default GoalEditor