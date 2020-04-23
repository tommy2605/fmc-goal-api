import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import './TextEditor.css'

const TextEditor = ({onChange}) => {

    const [editorState, setEditorState] = useState(EditorState.createEmpty())

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) setEditorState(newState)
    }

    const rawContentState = convertToRaw(editorState.getCurrentContent());

    const markup = draftToHtml(rawContentState)
        .replace(/[\r\n]/g, '')

    return (
        <div className="TextEditor">
            <Editor
                editorState={editorState}
                onChange={value => {
                    setEditorState(value)
                    if (onChange) onChange(markup)
                }}
                handleKeyCommand={(cmd, state) => handleKeyCommand(cmd, state)}
            />
        </div>)
}

export default TextEditor;
