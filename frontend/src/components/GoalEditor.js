import React, { useState } from "react";
import franc from "franc";
import TextEditor from "./TextEditor";
import InputText from "./InputText";
import InputDate, { nextSunday } from "./InputDate";
import InputChoice from "./InputChoice";

import "./GoalEditor.css";

const processHtml = (html) => {
  return html
    .replace(/<h3>/g, '<h1>')
    .replace(/<\/h3>/g, '</h1>')
}

const getItem = (props) => {
  const empty = {
    publishDate: nextSunday(),
    title: "",
    content: "",
    culture: "id",

    get language() {
      switch (this.culture) {
        case "id":
          return "ind";
        case "nl":
          return "nld";
        case "en":
          return "eng";
        default:
          return "";
      }
    }
  };

  return props.item ? Object.assign(empty, props.item) : empty;
};

const toCulture = (lang) => {
  switch(lang) {
    case 'ind': return 'id';
    case 'eng': return 'en';
    case 'nld': return 'nl';
    default: return undefined;
  }  
}

const GoalEditor = (props) => {
  const item = getItem(props);
  const [title, setTitle] = useState(item.title);
  const [date, setDate] = useState(item.publishDate.valueOf());
  const [content, setContent] = useState(item.content);
  const [lang, setLang] = useState(item.language);

  const canPublish = () => {
    return title && title.length > 5 && content && content.length > 20;
  };

  const btnPublishClass = canPublish()
    ? 'btn-success'
    : 'btn-light'

  return (
    <div className="GoalEditor">
      <div className="topNavigation">
        <InputText
          id="title"
          label="Title"
          value={title}
          onChange={(value) => setTitle(value)}
        />

        <InputDate
          key="date"
          label="Date"
          value={date}
          onChange={(value) => setDate(value)}
        />
      </div>

      <TextEditor
        html={item.content}
        onChange={(html) => {
          setContent(html);
          const text = html.replace(/<\/?[a-z0-9]+>/g, " ");
          const lang = franc(text);
          setLang(["nld", "eng"].includes(lang) ? lang : "ind") 
        }}
      />

      <div className="bottomNavigation">
        <InputChoice
          key="language"
          label="Language"
          value={lang}
          onChange={(newLang) => setLang(newLang)}
          choices={["ind/Indonesia", "eng/English", "nld/Nederlands"]}
        />
        <button 
          className={`btn ${btnPublishClass} btn-sm`} 
          disabled={!canPublish()}
          onClick={() => {
            const newItem = Object.assign(props.item || {}, {
              publishDate: new Date(date),
              title,
              content: processHtml(content),
              culture: toCulture(lang)
            })
            props.onPublish(newItem)
          }}>Publish</button>
      </div>
    </div>
  );
};

export default GoalEditor;
