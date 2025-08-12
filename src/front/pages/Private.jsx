import useGlobalReducer from "../hooks/useGlobalReducer";
import {PrivateContent } from "../components/PrivateContent.jsx";

export const Private = () => {

    const {store,dispatch}=useGlobalReducer()

    return (
        <div className="text-center mt-5">
            <h1>Private</h1>
            <PrivateContent/>
        </div>
    );
};