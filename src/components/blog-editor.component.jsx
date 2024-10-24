
import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/aws";
import { useContext, useRef, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useIsomorphicLayoutEffect } from "framer-motion";

import { EditorContext } from "../pages/editor.pages"
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import { UserContext } from "../App";
import axios from "axios";


const BlogEditor = () => {

    // let blogBannerRef = useRef()
    let { blog, blog: { title, banner, content, tags, des }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext)
    let { userAuth: { accessToken } } = useContext(UserContext)

    let navigate = useNavigate()


    //use Effect
    useEffect(() => {
        const editor = new EditorJS({
            holder: "textEditor",
            data: content,
            tools: tools,
            placeholder: "Let's write an awesome story",
            onReady: () => {
                setTextEditor(editor); // Now the editor is ready
            },
        });

        return () => {
            if (editor && typeof editor.destroy === 'function') {
                editor.destroy();
            }
        };
    }, []);


    const handleBannerUpload = (e) => {

        let img = e.target.files[0];

        // console.log(img)

        if (img) {

            let loadingToast = toast.loading("Uploading....")

            uploadImage(img)
                .then((url) => {
                    if (url) {
                        toast.dismiss(loadingToast);
                        toast.success("Uploaded OK")
                        // blogBannerRef.current.src = url.toString()

                        setBlog({ ...blog, banner: url.toString() })
                    }
                })
                .catch(err => {
                    toast.dismiss(loadingToast);
                    return toast.error(err);
                })
        }
    }

    const handleTitleKeyDown = (e) => {
        // console.log(e);

        if (e.keyCode === 13 || e.code === "Enter") {
            e.preventDefault()
        }
    }
    const handleTitleChange = (e) => {
        // console.log(e);
        let input = e.target;

        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";
        setBlog({ ...blog, title: input.value })
    }

    const handelImageError = (e) => {
        let img = e.target;
        // console.log(img);
        img.src = defaultBanner;
    }


    const handlePublishEvent = () => {
        if (!banner.length) {
            return toast.error("Upload a blog banner to publish it")
        }
        if (!title.length) {
            return toast.error("Write a blog title to publish it")
        }
        if (textEditor.isReady) {
            textEditor.save().then(data => {
                if (data.blocks.length) {
                    setBlog({ ...blog, content: data })
                    setEditorState("publish")
                }
                else {
                    return toast.error("Write something in your blog to publish it.")
                }

            })
                .catch((err) => {
                    console.log(err)
                })
        }
    }


    const handleSaveDraft = (e) => {

        if (e.target.className.includes("disable")) {
            return;
        }
        if (!title.length) {
            toast.error("Write the blog before saving it as draft")
        }


        let loadingToast = toast.loading("Saving Draft...")

        e.target.classList.add("disable")

        if (textEditor.isReady) {
            textEditor.save().then(content => {

                let blogObj = {
                    title, banner, des, content, tags, draft: true
                }

                axios.post(process.env.REACT_APP_URL + "/blog/create-blog", blogObj, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then(() => {
                        e.target.classList.remove('disable')
                        toast.dismiss(loadingToast)
                        toast.success("Drafted");

                        setTimeout(() => {
                            navigate("/")
                        }, 500)
                    })
                    .catch(({ response }) => {
                        e.target.classList.remove('disable');
                        toast.dismiss(loadingToast);

                        return toast.error(response.data.error);
                    })
            })
        }



    }
    return (
        <>

            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} className="" alt="" />
                </Link>

                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title.length ? title.toString() : "New Blog"}
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2"
                        onClick={handlePublishEvent}>
                        Publish
                    </button>
                    <button className="btn-light py-2"
                        onClick={handleSaveDraft}
                    >
                        Save Draft
                    </button>
                </div>
            </nav>
            <Toaster />
            <AnimationWrapper>

                <section>
                    <div className="mx-auto max-w-[900px] w-full">

                        <div className="relative aspect-video hover:opacity-80  bg-white border-4 border-grey ">
                            <label htmlFor="uploadBanner">
                                <img
                                    // ref={blogBannerRef}

                                    src={banner}
                                    alt=""
                                    className="z-20"
                                    onError={handelImageError}
                                />
                                <input
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png, .jpg, .jpeg, .avif,.webp"
                                    hidden
                                    onChange={handleBannerUpload}
                                // className="absolute top-0 bottom-0 right-0 left-0 z-30"
                                />
                            </label>
                        </div>



                        <textarea
                            defaultValue={title}
                            placeholder="Blog Title"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        ></textarea>


                        <hr className="w-full opacity-10 my-5" />

                        <div id="textEditor" className="font-gelasio"></div>
                    </div>
                </section>
            </AnimationWrapper>
        </>

    );
}

export default BlogEditor;