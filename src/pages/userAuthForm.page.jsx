
import { Link } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { useContext, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";


const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const passwordRegex =
    /^(?=.{8,})((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;





const UserAuthForm = ({ type }) => {


    const authForm = useRef(null); // Ensure it's initialized to null


    let { userAuth: { accessToken, refreshToken, user }, setUserAuth } = useContext(UserContext);

    console.log("accessToken: " + accessToken)
    console.log("refreshToken: " + refreshToken)
    console.log("user: " + JSON.stringify(user))

    const userAuthThroughServer = (serverRoute, formData) => {
        axios
            .post(process.env.REACT_APP_URL + "/users" + serverRoute, formData)
            .then(({ data }) => {


                const { accessToken, refreshToken, user } = data.data;

                // Store each item in session storage
                storeInSession('accessToken', accessToken);
                storeInSession('refreshToken', refreshToken);
                storeInSession('user', JSON.stringify(user));

                console.log(sessionStorage);
                console.log(data);

                toast.success(data.message);
            })
            .catch(({ response }) => {
                toast.error(response.data.message);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Log the current form reference to debug the issue
        // console.log("authForm.current:", authForm.current);

        if (!authForm.current) {
            toast.error("Form reference is not assigned.");
            return;
        }

        let serverRoute = type === "sign-in" ? "/signin" : "/signup";
        let form = new FormData(authForm.current);

        let formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        const { fullname, email, password } = formData;
        const username = type !== "sign-in" ? formData.username : null;

        if (type !== "sign-in") {
            if (!username || !username.length) {
                return toast.error("Username is required");
            }

            else if (fullname && fullname.length < 3) {
                return toast.error("Fullname must be at least 3 letters long");
            }
        }

        else if (!email || !email.length) {
            return toast.error("Email is required");
        }
        else if (!emailRegex.test(email)) {
            return toast.error("Email is in invalid format");
        }
        else if (!password || !password.length) {
            return toast.error("Password is required");
        }
        else if (!passwordRegex.test(password)) {
            return toast.error(
                "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one number or special character"
            );
        }

        userAuthThroughServer(serverRoute, formData);
    };


    return (
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster />
                <form ref={authForm} onSubmit={handleSubmit} className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-14">
                        {type === "sign-in" ? "Welcome back" : "Join us today"}
                    </h1>

                    {type !== "sign-in" && (
                        <>
                            <InputBox
                                name="username"
                                type="text"
                                placeholder="Username"
                                icon="fi-rr-user"
                            />
                            <InputBox
                                name="fullname"
                                type="text"
                                placeholder="Full name"
                                icon="fi-rr-id-card-clip-alt"
                            />
                        </>
                    )}

                    <InputBox
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon="fi-rr-envelope"
                    />

                    <InputBox
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fi-rr-key"
                    />

                    <button className="btn-dark center mt-14 " type="submit">
                        {type.replace("-", " ")}
                    </button>

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p className="text-black">or</p>
                        <hr className="w-1/2 border-black" />
                    </div>

                    <button className="btn-dark flex items-center justify-center gap-4 w-[90% center">
                        <img src={googleIcon} alt="" className="w-5" />
                        continue with Google
                    </button>
                    {type === "sign-in" ? (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don't have an account ?
                            <Link to="/signup" className="underline text-black text-xl ml-1">
                                Join Us today
                            </Link>
                        </p>
                    ) : (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Already have an account ?
                            <Link to="/signin" className="underline text-black text-xl ml-1">
                                Create Account
                            </Link>
                        </p>
                    )}
                </form>
            </section>
        </AnimationWrapper>
    );

}

export default UserAuthForm;