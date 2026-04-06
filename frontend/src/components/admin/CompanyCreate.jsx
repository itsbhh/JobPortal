import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState("");

  const registerNewCompany = async () => {
    try {
      const res = await api.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        navigate(`/admin/companies/${res.data.company._id}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="px-4 py-10">
        <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="font-bold text-xl sm:text-2xl">
              Your Company Name
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              What would you like to name your company? You can change this
              later.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input
              type="text"
              placeholder="JobHub, Microsoft, etc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => navigate("/admin/companies")}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={registerNewCompany}
              disabled={!companyName}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
