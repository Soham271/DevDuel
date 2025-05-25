import React, { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const scrollRef = useRef(null);
  const leftImageRef = useRef(null);
  const rightImageRef = useRef(null);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
    });

    // Locomotive + ScrollTrigger setup
    setTimeout(() => {
      ScrollTrigger.scrollerProxy(scrollRef.current, {
        scrollTop(value) {
          return arguments.length
            ? scroll.scrollTo(value, 0, 0)
            : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: scrollRef.current.style.transform ? "transform" : "fixed",
      });

      ScrollTrigger.addEventListener("refresh", () => scroll.update());
      ScrollTrigger.refresh();
    }, 100);

    // Animate left image inward
    gsap.to(leftImageRef.current, {
      x: window.innerWidth / 3, // move right
      scrollTrigger: {
        trigger: "#scrollSection2",
        scroller: scrollRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });

    // Animate right image inward
    gsap.to(rightImageRef.current, {
      x: -window.innerWidth / 3, // move left
      scrollTrigger: {
        trigger: "#scrollSection2",
        scroller: scrollRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });

    return () => {
      scroll.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-24 text-center">
        <h1 className="text-4xl font-bold">
          Hello, Welcome to Home: {user?.fullName}
        </h1>
      </div>

      <div
        data-scroll-container
        ref={scrollRef}
        className="overflow-hidden font-sans"
      >
        {/* Section 1 */}
        <section
          data-scroll-section
          className="min-h-[150vh] bg-red-400 flex items-center justify-center"
        >
          <h1 className="text-white text-5xl font-bold">Section 1</h1>
        </section>

        {/* Section 2 */}
        <section
          id="scrollSection2"
          data-scroll-section
          className="min-h-[200vh] bg-blue-500 relative"
        >
          {/* Images pinned to left/right */}
          <img
            ref={leftImageRef}
            src="https://unsplash.com/photos/the-american-flag-hangs-in-a-window-83L4JedaBC8"
            alt="Left"
            className="absolute top-1/2 left-0 transform -translate-y-1/2"
          />
          <img
            ref={rightImageRef}
            src="https://unsplash.com/photos/womans-face-peeks-through-large-dark-leaves-mkSLfe1EvbA"
            alt="Right"
            className="absolute top-1/2 right-0 transform -translate-y-1/2"
          />
        </section>

        {/* Section 3 */}
        <section
          data-scroll-section
          className="min-h-[180vh] bg-green-500 flex items-center justify-center"
        >
          <h1 className="text-white text-5xl font-bold">Section 3</h1>
        </section>
      </div>
    </>
  );
};

export default Home;
