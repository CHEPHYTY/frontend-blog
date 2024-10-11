import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
const Editor = () => {


    const [editorState, setEditorState] = useState(true);
    let { userAuth: { accessToken } } = useContext(UserContext);


    return (

        accessToken === null ?

            <Navigate to="/signin" /> :

            editorState === "editor" ?
                <h1>Blog Editor</h1> : <h1> Publish Form</h1>
    );
}

export default Editor;