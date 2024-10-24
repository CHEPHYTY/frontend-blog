import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation, { activeTabRef, activeTabLineRef } from "../components/inpage-navigation.component.jsx";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component.jsx";
import BlogPostCard from "../components/blog-post.component.jsx";
import MinimalBlogPost from "../components/nobanner-blog-post.component.jsx";
import NoDataMessage from "../components/nodata.component.jsx";
import { filterPaginationData } from "../common/filter-pagination-data.jsx";
import LoadMoreDataBtn from "../components/load-more.component.jsx";

const HomePage = () => {

    let [blogs, setBlog] = useState(null)


    /**
     * blogs = [{},{}.{}]
     * 
     * blogs = {
     * results :[{},{},{}],
     * page:1,
     * totalDocs:10,10-10!=0
     * }
     */


    let [trendingBlog, setTrendingBlog] = useState(null)
    let [pageState, setPageState] = useState("home")

    let categories = [
        "programming",
        "hollywood",
        "film making",
        "social media",
        "cooking",
        "tech",
        "finance",
        "travel"
    ]



    useEffect(() => {

        activeTabRef.current.click()
        if (pageState === "home") {
            fetchLatestBlogs({ page: 1 })
        }
        else {
            fetchBlogsByCategory({ page: 1 })
        }

        if (!trendingBlog) {
            fetchTrendingBlogs()
        }
    }, [pageState])




    const fetchLatestBlogs = async ({ page = 1 }) => {
        // await axios.post(process.env.REACT_APP_URL + "/blog/latest-blogs/", { page })
        //     .then(async (response) => {
        //         // Log the full response to check the structure
        //         // console.log(response);

        //         // Assuming that the blogs are inside the response's data property
        //         // const { blogs } = response.data;

        //         // console.log(response.data.blogs); 

        //         let formattedData = await filterPaginationData({
        //             state: blogs,
        //             data: response.data.blogs,
        //             page,
        //             countRoute: "/all-latest-blogs-count"

        //         })
        //         // console.log(formattedData)
        //         setBlog(formattedData)

        //     })

        //     .catch(err => {
        //         console.log({ ...err.message })
        //     })
        try {
            const response = await axios.post(process.env.REACT_APP_URL + "/blog/latest-blogs/", { page });
            const newBlogs = response.data.blogs;

            const formattedData = await filterPaginationData({
                state: blogs,
                data: newBlogs,
                page,
                countRoute: "/all-latest-blogs-count",

            });

            // Append new blogs to the existing state instead of replacing it
            setBlog((prevBlogs) => ({
                ...prevBlogs,
                results: [...(prevBlogs?.results || []), ...formattedData.results],
                page: formattedData.page,
                totalDocs: formattedData.totalDocs
            }));
        } catch (err) {
            console.log({ ...err.message });
        }
    }

    const fetchTrendingBlogs = async () => {
        await axios.get(process.env.REACT_APP_URL + "/blog/trending-blogs/")
            .then((response) => {

                const { blogs } = response.data;

                setTrendingBlog(blogs)
            })
            .catch(err => {
                console.log({ ...err.message })
            })
    }

    const fetchBlogsByCategory = async ({ page = 1 } = {}) => {
        try {
            const response = await axios.post(process.env.REACT_APP_URL + "/blog/search-blogs/", {
                tag: pageState.toLowerCase(),
                page
            });

            const { blogs } = response.data; // New blogs from response

            let formattedData = await filterPaginationData({
                state: blogs,   // This should likely be the existing state, not the new data
                data: blogs,    // The new data from response
                page,           // Current page number
                countRoute: "/search-blogs-count",
                data_to_send: { tag: pageState } // Send the current category (tag)
            });

            // Append new blogs to the existing state
            setBlog((prevBlogs) => ({
                ...prevBlogs,
                results: [...(prevBlogs?.results || []), ...formattedData.results],
                page: formattedData.page,
                totalDocs: formattedData.totalDocs
            }));
        } catch (err) {
            console.log({ ...err.message });
        }
    };



    const loadBlogByCategory = (e) => {
        let category = e.target.innerText;

        // Normalize the case for comparison
        const normalizedCategory = category.toLowerCase();
        const normalizedPageState = pageState.toLowerCase();

        setBlog(null);

        // console.log("Selected Category:", category);
        // console.log("Current Page State:", pageState);
        if (normalizedPageState === normalizedCategory) {
            setPageState("home");
        } else {
            setPageState(category);  // Set the clicked category as active
        }
    };


    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* latest blogs */}
                <div className="w-full">

                    <InPageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]} >


                        {/* <h1>Latest Blogs</h1> */}

                        <>
                            {
                                blogs === null ? <Loader /> : (
                                    blogs.results.length ?
                                        blogs.results.map((blog, i) => {
                                            return (
                                                <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }}>
                                                    <BlogPostCard
                                                        content={blog}
                                                        author={blog.author.personal_info} />

                                                </AnimationWrapper>

                                            )
                                        }) : <NoDataMessage message="No Blog Published" />

                                )
                            }
                            <LoadMoreDataBtn state={blogs} fetchDataFun={(pageState === "home" ? fetchLatestBlogs : fetchBlogsByCategory)} />
                        </>
                        <>



                            {
                                trendingBlog === null ? (<Loader />) : (
                                    trendingBlog.length ?
                                        trendingBlog.map((blog, i) => {
                                            return (
                                                <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }}>
                                                    <MinimalBlogPost
                                                        blog={blog} index={i} />

                                                </AnimationWrapper>

                                            )
                                        }) : <NoDataMessage message="No Trending Blog" />
                                )
                            }

                        </>

                    </InPageNavigation>
                </div>

                {/* filter and trending blogs */}

                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-5 pt-3 max-md:hidden">
                    <div className="flex flex-col gpa-10">

                        <div>
                            <h1 className="font-medium text-xl mb-8">Stories form all interests.</h1>

                            <div className="flex gap-3 flex-wrap">
                                {
                                    categories.map((category, i) => {
                                        return (
                                            <button
                                                className={"tag " + (pageState.toLowerCase() === category ? "bg-black text-white" : "")}
                                                onClick={loadBlogByCategory}
                                                key={i}
                                            >
                                                {category}
                                            </button>
                                        );
                                    })
                                }
                            </div>

                        </div>

                        <div className="mt-8">
                            <h1 className="font-medium text-xl mb-8">Trending <i className="fi fi-rr-arrow-trend-up"></i></h1>


                            {
                                trendingBlog === null ? <Loader /> : (
                                    trendingBlog.length ?
                                        trendingBlog.map((blog, i) => {
                                            return (
                                                <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }}>
                                                    <MinimalBlogPost
                                                        blog={blog} index={i} />

                                                </AnimationWrapper>

                                            )
                                        }) : <NoDataMessage message="No Trending Blog" />
                                )
                            }
                        </div>
                    </div>



                </div>


            </section>
        </AnimationWrapper>

    )
}

export default HomePage;