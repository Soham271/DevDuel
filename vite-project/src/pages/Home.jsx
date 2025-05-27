import React, { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import "@fontsource/inter/400.css"; // Regular
import "@fontsource/inter/600.css"; // SemiBold


gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const scrollRef = useRef(null);
  const heroRef = useRef(null);
  const taglineRef = useRef(null);
  const user = useSelector((state) => state.user.user);

  const aboutRef = useRef(null);
  const aboutImgRef = useRef(null);
  const featuresRef = useRef(null);
  const featuresImgRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.05,
    });



    if (scrollRef.current) {
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
    }


    ScrollTrigger.addEventListener("refresh", () => scroll.update());
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Hero animation
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
      }
    );

    // Tagline animation
    gsap.to(taglineRef.current, {
      opacity: 1,
      y: 0,
      delay: 1.2,
      duration: 1,
      ease: "power2.out",
    });

    // About image animation
    gsap.fromTo(
      aboutImgRef.current,
      { x: "-100%", opacity: 0 },
      {
        x: "0%",
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: aboutRef.current,
          scroller: scrollRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 0.5,
        },
      }
    );

    // Features image animation
    gsap.fromTo(
      featuresImgRef.current,
      { x: "100%", opacity: 0 },
      {
        x: "10%", // shifted more left
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          scroller: scrollRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 0.5,
        },
      }
    );

    return () => {
      scroll.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Navbar />
      <div
        data-scroll-container
        ref={scrollRef}
        className="bg-black text-white font-sans overflow-hidden"
      >
        {/* Hero Section */}
        <section
          data-scroll-section
          className="min-h-screen flex flex-col items-center justify-center text-center px-4"
        >
          <h1
            data-scroll
            ref={heroRef}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            Welcome to <span className="text-purple-500">DevDuels</span>
          </h1>
          <p data-scroll
            ref={taglineRef}
            className="text-lg md:text-2xl mt-6 opacity-0 wdxl-lubrifont-tc-regular text-gray-300"
          >
            Battle it out in real-time coding contests – Rank. Duel. Conquer.
          </p>
        </section>

        {/* About Section */}
        <section
          data-scroll-section
          ref={aboutRef}
          className="min-h-[100vh] px-6 py-24 md:px-20 bg-gray-900 flex flex-col md:flex-row items-center justify-between gap-10"
        >
          <div className="md:w-1/2">
            <h2 className="text-4xl font-semibold mb-6">What is DevDuels?</h2>
            <p className="text-lg leading-relaxed">
              DevDuels is a real-time competitive coding platform where you face
              other developers in head-to-head programming battles. Build your
              rank, improve your skills, and climb the leaderboard.
            </p>
          </div>
          <img
            ref={aboutImgRef}
            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61"
            alt="About DevDuels"
            className="md:w-1/2 rounded-xl shadow-xl object-cover h-80 w-full"
          />
        </section>

        {/* Features Section */}
        <section
          data-scroll-section
          ref={featuresRef}
          className="min-h-[100vh] px-6 py-24 md:px-20 bg-black flex flex-col md:flex-row-reverse items-center justify-between gap-10"
        >
          <div className="md:w-1/2 font-[Inter]">
            <h2 className="text-4xl font-semibold mb-6">Key Features</h2>
            <ul className="list-disc ml-6 text-lg space-y-3 leading-relaxed text-gray-200">
              <li>Live 1v1 Duels with Real-Time Feedback</li>
              <li>Multiple Languages and Difficulty Levels</li>
              <li>Built-in Code Editor and Timer</li>
              <li>Matchmaking and Custom Rooms</li>
              <li>Global Leaderboard and Rankings</li>
            </ul>
          </div>

          <img
            ref={featuresImgRef}
            src="https://images.unsplash.com/photo-1554306274-f23873d9a26c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Features"
            className="md:w-[40%] w-full rounded-xl shadow-xl object-cover h-80 mr-0 md:mr-6"
          />

        </section>
      </div>
    </>
  );
};

export default Home;
