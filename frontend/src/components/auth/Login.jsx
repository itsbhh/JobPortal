import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await api.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div>
      <Navbar />

      {/* 👇 THIS IS THE FIX */}
      <div className="pt-20 flex items-center justify-center px-4 py-10">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8"
        >
          <h1 className="font-bold text-xl sm:text-2xl mb-6 text-center">
            Login to JobHub
          </h1>

          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="you@email.com"
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 my-6">
            <RadioGroup className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                />
                <Label>Student</Label>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                />
                <Label>Recruiter</Label>
              </div>
            </RadioGroup>
          </div>

          {loading ? (
            <Button className="w-full mt-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          )}

          <p className="text-sm text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
