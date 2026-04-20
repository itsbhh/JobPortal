import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <section className="w-full px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:text-left">
          <span className="text-[#6A38C2]">Latest & Top </span>Job Openings
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {allJobs.length <= 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No Job Available
            </div>
          ) : (
            allJobs
              ?.slice(0, 6)
              .map((job) => (
                <LatestJobCards key={job._id} job={job} />
              ))
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;
