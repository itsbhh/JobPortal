import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import api from "@/api";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await api.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true }
        );
        dispatch(setAllApplicants(res.data.job));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllApplicants();
  }, [params.id, dispatch]);

  return (
    <div>
      <Navbar />

      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-bold text-lg sm:text-xl mb-4">
            Applicants{" "}
            <span className="text-gray-500">
              ({applicants?.applications?.length || 0})
            </span>
          </h1>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <ApplicantsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
