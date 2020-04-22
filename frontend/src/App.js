import React, {useState} from 'react';
import {Editor, EditorState, RichUtils,  convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html'

const App = () => {

  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
    }
  }

  const rawContentState = convertToRaw(editorState.getCurrentContent());

  const markup = draftToHtml(rawContentState)

  return (
    <div>
      <pre>{markup}</pre>
      <Editor 
      editorState={editorState}
      onChange={value => setEditorState(value)}
      handleKeyCommand={(cmd, state) => handleKeyCommand(cmd, state)}
      />
    </div>)
}

export default App;
