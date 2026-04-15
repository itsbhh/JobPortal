import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const fitlerData = [
  {
    fitlerType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    fitlerType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    fitlerType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="w-full bg-white p-4 sm:p-5 rounded-md shadow-sm">
      <h1 className="font-bold text-base sm:text-lg">Filter Jobs</h1>
      <hr className="mt-3 mb-4" />

      <RadioGroup
        value={selectedValue}
        onValueChange={changeHandler}
        className="space-y-6"
      >
        {fitlerData.map((data, index) => (
          <div key={index}>
            <h2 className="font-semibold text-sm sm:text-base mb-2">
              {data.fitlerType}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {data.array.map((item, idx) => {
                const itemId = `id${index}-${idx}`;
                return (
                  <div
                    key={itemId}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={item} id={itemId} />
                    <Label
                      htmlFor={itemId}
                      className="text-sm sm:text-base cursor-pointer"
                    >
                      {item}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
