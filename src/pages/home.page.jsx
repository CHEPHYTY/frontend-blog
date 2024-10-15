import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component.jsx";

const HomePage = () => {
    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* latest blogs */}
                <div className="w-full">

                    <InPageNavigation routes={["home", "trending blogs"]}>

                    </InPageNavigation>
                </div>

                {/* filter and trending blogs */}

                <div>

                </div>


            </section>
        </AnimationWrapper>

    )
}

export default HomePage;