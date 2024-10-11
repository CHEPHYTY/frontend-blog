import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { UserContext } from "../App";
import { lookInSession, removeFromSession } from "../common/session";

const UserNavigationPanel = () => {


    // const { userAuth: { user }, setUserAuth } = useContext(UserContext)
    const { setUserAuth } = useContext(UserContext)
    const user = JSON.parse(lookInSession("user"))
    const username = user.username
    // const username = user.username;


    const signOutUser = () => {
        removeFromSession("accessToken")
        removeFromSession("refreshToken")
        removeFromSession("user")

        setUserAuth({ accessToken: null })
    }
    return (
        <AnimationWrapper
            className="absolute right-0 z-50"
            transition={{ duration: 0.2 }}
        >
            <div className="bg-white absolute right-0 border border-grey w-60 overflow-hidden duration-200">

                <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
                    <i className="fi fi-rr-file-edit" />
                    <p>Write</p>
                </Link>

                <Link to={`/user/${username}`} className="link pl-8 py-4">
                    Profile
                </Link>
                <Link to="/dashboard/blogs" className="link pl-8 py-4">
                    Dashboard
                </Link>
                <Link to="/setting/edit-profile" className="link pl-8 py-4">
                    Setting
                </Link>


                <span className="absolute border-t border-grey w-[100%] ">
                </span>

                <button className="text-left p-4 hover:bg-grey w-full pl-8"
                    onClick={signOutUser}
                >
                    <h1 className="font-bold textxl mg-1">Sign Out</h1>
                    <p className="text-dark-grey">@{username}</p>
                </button>
            </div>

        </AnimationWrapper>


    )
}

export default UserNavigationPanel;