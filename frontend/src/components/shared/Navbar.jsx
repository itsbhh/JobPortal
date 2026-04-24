import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "@/api";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await api.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="bg-white border-b fixed top-0 w-full z-50">
        <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
          <h1 className="text-2xl font-bold">
            Job<span className="text-[#F83002]">Hub</span>
          </h1>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-6 font-medium">
              {user?.role === "recruiter" ? (
                <>
                  <li><Link to="/admin/companies">Companies</Link></li>
                  <li><Link to="/admin/jobs">Jobs</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/jobs">Jobs</Link></li>
                  <li><Link to="/browse">Browse</Link></li>
                </>
              )}
            </ul>

            <div className="flex items-center gap-3">
              <a href="https://eduwizard.netlify.app" target="_blank" rel="noreferrer">
                <Button variant="outline" className="rounded-full px-5">
                  EduWizard
                </Button>
              </a>
              <a href="https://avia-ai.vercel.app/" target="_blank" rel="noreferrer">
                <Button className="rounded-full px-5 bg-black text-white hover:bg-white hover:text-black border transition-all">
                  Avia AI
                </Button>
              </a>
            </div>

            {!user ? (
              <div className="flex gap-2">
                <Link to="/login"><Button variant="outline">Login</Button></Link>
                <Link to="/signup">
                  <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src={user?.profile?.profilePhoto} />
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user?.fullname}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user?.profile?.bio}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    {user?.role === "student" && (
                      <Button variant="ghost" asChild>
                        <Link to="/profile">
                          <User2 className="mr-2 h-4 w-4" /> View Profile
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" onClick={logoutHandler}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden bg-white border-t px-4 py-6 space-y-6">
            <div className="flex flex-col space-y-4 font-medium">
              {user?.role === "recruiter" ? (
                <>
                  <Link to="/admin/companies" onClick={() => setOpen(false)}>Companies</Link>
                  <Link to="/admin/jobs" onClick={() => setOpen(false)}>Jobs</Link>
                </>
              ) : (
                <>
                  <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                  <Link to="/jobs" onClick={() => setOpen(false)}>Jobs</Link>
                  <Link to="/browse" onClick={() => setOpen(false)}>Browse</Link>
                </>
              )}
            </div>

            <div className="h-px bg-gray-200" />

            {!user ? (
              <div className="flex gap-3">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/signup" className="w-full">
                  <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {user?.role === "student" && (
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <User2 className="mr-2 h-4 w-4" /> View Profile
                    </Button>
                  </Link>
                )}
                <Button onClick={logoutHandler} variant="outline" className="w-full">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* 🔥 THIS FIXES ALL PAGES */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
