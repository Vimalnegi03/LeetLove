import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import {
  Code,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoggingIn } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      console.log("Login Data:", data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-50 via-fuchsia-50 to-purple-100 dark:from-[#181824] dark:to-[#27293d] flex flex-col lg:flex-row overflow-x-auto">
      {/* Left Side - Form */}
      <div className="flex flex-col flex-1 justify-center items-center px-3 py-12 min-h-screen">
        <div className="w-full max-w-md bg-white/90 dark:bg-[#181824]/95 backdrop-blur-lg shadow-2xl rounded-2xl px-7 py-10 space-y-8 border border-primary/10">
          <div className="flex flex-col items-center gap-2 group mb-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mt-2 text-primary">
              Welcome Back
            </h1>
            <p className="text-base-content/60">Sign in to your account</p>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`input input-bordered w-full pl-10 transition-all ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`input input-bordered w-full pl-10 transition-all ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-base-200/60 rounded-full p-1 transition"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label="Show/Hide password"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full font-bold transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0.5 duration-150"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="ml-2">Loading...</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-3 text-base-content/60">
            <span>
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary font-semibold">
                Create account
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern (shows only on large screens) */}
      <div className="flex-1 hidden lg:flex items-center justify-center bg-none">
        <AuthImagePattern
          title="Welcome back!"
          subtitle="Sign in to continue your journey with us. Don't have an account? Create one now."
        />
      </div>
    </div>
  );
};

export default LoginPage;
