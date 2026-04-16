import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <section className="w-full pt-24 md:pt-28 px-4">
      <div className="text-center max-w-5xl mx-auto flex flex-col gap-6">

        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium text-xs sm:text-sm">
          No. 1 Job Hunt Website
        </span>

        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Search, Apply & <br />
          Get Your <span className="text-[#6A38C2]">Dream Jobs</span>
        </h1>

        <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
          Find the perfect opportunity that matches your skills and aspirations.
          Explore top companies, apply with ease, and take the next step in your
          career!
        </p>

        <div className="w-full flex justify-center">
          <div className="flex w-full max-w-xl sm:max-w-2xl shadow-lg border border-gray-200 pl-4 pr-1 py-1 rounded-full items-center gap-3">
            <input
              type="text"
              placeholder="Find your dream jobs"
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none border-none w-full py-3 text-sm sm:text-base"
            />
            <Button
              onClick={searchJobHandler}
              className="rounded-full bg-[#6A38C2] px-4 sm:px-5"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <a
            href="https://eduwizard.netlify.app"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              className="w-full sm:w-auto px-6 py-3"
            >
              Explore EduWizard
            </Button>
          </a>

          <a
            href="https://avia-ai.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              className="w-full sm:w-auto px-6 py-3 bg-black text-white hover:bg-white hover:text-black border transition-all"
            >
              Try Avia AI
            </Button>
          </a>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
