import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector(
    (store) => store.job
  );

  const [filterJobs, setFilterJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = allAdminJobs?.filter((job) => {
      if (!searchJobByText) return true;
      return (
        job?.title
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase()) ||
        job?.company?.name
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filtered || []);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableCaption className="text-sm">
          A list of your recently posted jobs
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterJobs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-gray-500 py-6"
              >
                No jobs found
              </TableCell>
            </TableRow>
          ) : (
            filterJobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell className="font-medium">
                  {job?.company?.name}
                </TableCell>

                <TableCell>{job?.title}</TableCell>

                <TableCell className="hidden sm:table-cell text-gray-600">
                  {job?.createdAt.split("T")[0]}
                </TableCell>

                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger className="cursor-pointer">
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-36">
                      <div
                        onClick={() =>
                          navigate(`/admin/companies/${job._id}`)
                        }
                        className="flex items-center gap-2 cursor-pointer hover:text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </div>

                      <div
                        onClick={() =>
                          navigate(
                            `/admin/jobs/${job._id}/applicants`
                          )
                        }
                        className="flex items-center gap-2 cursor-pointer mt-2 hover:text-primary"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Applicants</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
