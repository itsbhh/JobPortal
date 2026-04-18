import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import api from "@/api";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  const { id: jobId } = useParams();
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await api.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [
            ...singleJob.applications,
            { applicant: user?._id },
          ],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await api.get(
          `${JOB_API_END_POINT}/get/${jobId}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <section className="w-full px-4 pt-24 pb-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-bold text-lg sm:text-xl">
              {singleJob?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge className="text-blue-700 font-bold" variant="ghost">
                {singleJob?.postion} Positions
              </Badge>
              <Badge className="text-[#F83002] font-bold" variant="ghost">
                {singleJob?.jobType}
              </Badge>
              <Badge className="text-[#7209b7] font-bold" variant="ghost">
                {singleJob?.salary} LPA
              </Badge>
            </div>
          </div>

          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`w-full sm:w-auto rounded-lg ${
              isApplied
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#7209b7] hover:bg-[#5f32ad]"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>
        </div>

        <h2 className="border-b border-gray-300 font-medium py-3 text-base sm:text-lg">
          Job Description
        </h2>

        <div className="flex flex-col gap-2 text-sm sm:text-base">
          <p className="font-semibold">
            Role:
            <span className="pl-2 font-normal text-gray-800">
              {singleJob?.title}
            </span>
          </p>
          <p className="font-semibold">
            Location:
            <span className="pl-2 font-normal text-gray-800">
              {singleJob?.location}
            </span>
          </p>
          <p className="font-semibold">
            Description:
            <span className="pl-2 font-normal text-gray-800">
              {singleJob?.description}
            </span>
          </p>
          <p className="font-semibold">
            Experience:
            <span className="pl-2 font-normal text-gray-800">
              {singleJob?.experience} yrs
            </span>
          </p>
          <p className="font-semibold">
            Salary:
            <span className="pl-2 font-normal text-gray-800">
              {singleJob?.salary} LPA
            </span>
          </p>
          <p className="font-semibold">
            Total Applicants:
            <span className="pl-2 font-normal text-gray-800">
              {singleJob?.applications?.length}
            </span>
          </p>
          <p className="font-semibold">
            Posted Date:
            <span className="pl-2 font-normal text-gray-800">
              {singleJob?.createdAt?.split("T")[0]}
            </span>
          </p>
        </div>

      </div>
    </section>
  );
};

export default JobDescription;
