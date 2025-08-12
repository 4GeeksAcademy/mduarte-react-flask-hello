import useGlobalReducer from "../hooks/useGlobalReducer";
import {SignupForm } from "../components/SignupForm.jsx";

export const SignUp = () => {

    const {store,dispatch}=useGlobalReducer()

    return (
        <div className="text-center mt-5">
            <h1>SignUp</h1>
            <SignupForm/>
        </div>
    );
};