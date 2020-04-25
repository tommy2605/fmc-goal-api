import React, { useState } from 'react';
import { Editor, EditorState, ContentState, RichUtils, convertToRaw, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import './TextEditor.css'

const TextEditor = ({html, onChange}) => {
    const blocksFromHTML = convertFromHTML(html)

    const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
    )

    const [editorState, setEditorState] = useState(EditorState.createWithContent(state))

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
