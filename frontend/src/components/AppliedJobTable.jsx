import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableCaption className="text-sm">
          A list of your applied jobs
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Date</TableHead>
            <TableHead className="whitespace-nowrap">Job Role</TableHead>
            <TableHead className="whitespace-nowrap hidden sm:table-cell">
              Company
            </TableHead>
            <TableHead className="text-right whitespace-nowrap">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-gray-500 py-6"
              >
                You haven&apos;t applied for any job yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell className="whitespace-nowrap text-sm">
                  {appliedJob?.createdAt?.split("T")[0]}
                </TableCell>

                <TableCell className="font-medium text-sm">
                  {appliedJob.job?.title}
                </TableCell>

                <TableCell className="hidden sm:table-cell text-sm">
                  {appliedJob.job?.company?.name}
                </TableCell>

                <TableCell className="text-right">
                  <Badge
                    className={`text-xs sm:text-sm px-2 py-1 ${
                      appliedJob?.status === "rejected"
                        ? "bg-red-400"
                        : appliedJob?.status === "pending"
                        ? "bg-gray-400"
                        : "bg-green-400"
                    }`}
                  >
                    {appliedJob.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
