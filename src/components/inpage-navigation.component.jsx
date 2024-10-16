import { useEffect, useRef, useState } from "react";

const InPageNavigation = ({ routes }) => {


    let activeTabLineRef = useRef();
    let { inPageNavIndex, setInPageNavIndex } = useState()



    const changePageState = (btn, i) => {
        // console.log(btn, i)

        let { offsetWidth, offsetLeft } = btn;

        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";
    }



    useEffect(()=>{
changePageState(btn,i)
    },[])

    return (

        <>

            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">


                {
                    routes.map((route, i) => {
                        return (
                            <button key={i} className={"p-4 px-5 capitalize " + (inPageNavIndex === i ? "text-black" : "text-dark-grey")}
                                onClick={(e) => { changePageState(e.target, i) }}
                            >
                                {route}
                            </button>
                        )
                    })
                }

                <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
            </div >
        </>


    );
}


export default InPageNavigation