import { useState } from "react"; // Add import statement for useState
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from "draft-js";

export const GiglistEditor = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    return (
        <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={setEditorState}
        />
    );
};
