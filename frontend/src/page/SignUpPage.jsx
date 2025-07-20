import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from "react-router-dom";
import {
  Code,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Image as ImageIcon,
  X
} from "lucide-react";
import { z } from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(3, "Name must be greater than 3 characters"),
  // No image validation here; handled by manual check for preview.
});

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { signup, isSigninUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  // Handle image change for preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file);
    setValue("image", file); // Save in react-hook-form values
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Clear the selected image
  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setValue("image", null);
  };

  // Form submit
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (imageFile) formData.append("image", imageFile);

      await signup(formData);
    } catch (error) {
      console.error("SignUp failed:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-50 via-fuchsia-50 to-purple-100 dark:from-[#181824] dark:to-[#27293d] flex flex-col lg:flex-row">
      {/* Left: Hero */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative bg-transparent">
        <div
          className="absolute z-0 blur-3xl left-[-20%] top-[-10%] w-[36vw] h-[36vw] bg-fuchsia-400/30 rounded-full animate-pulse"
          aria-hidden="true"
        />
        <div className="z-10 flex flex-col items-center p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center shadow-lg">
              <Code className="w-10 h-10 text-primary" />
            </div>
            <span className="text-4xl font-extrabold text-primary tracking-tight drop-shadow">
              LeetLove
            </span>
          </div>
          <div className="bg-white/70 dark:bg-black/60 rounded-2xl px-8 py-10 shadow-lg backdrop-blur-2xl flex flex-col items-center space-y-5">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-blue-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg mb-2">
              Welcome!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-md">
              Join our platform to level-up your coding skills and prepare for job interviews with interactive coding problems and vibrant community features.
            </p>
            <div className="flex flex-row gap-2 items-center justify-center text-base-content/40 mt-4">
              <span className="text-lg font-medium">Already a member?</span>
              <Link to="/login" className="link link-primary text-md font-bold">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-col flex-1 justify-center items-center px-3 py-12 min-h-screen bg-none">
        <div className="w-full max-w-md bg-white/90 dark:bg-[#181824]/95 backdrop-blur-lg shadow-2xl rounded-2xl px-7 py-10 space-y-8 border border-primary/10">
          <div className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mt-2 text-primary">Sign Up</h1>
            <p className="text-base-content/60">Create your account to start solving</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" encType="multipart/form-data">
            {/* Avatar/Image Upload */}
            <div className="flex flex-col items-center gap-2 relative">
              <label className="text-sm font-medium text-primary flex flex-row gap-2 items-center mb-0.5">
                Profile Image
                <ImageIcon className="w-5 h-5" />
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-20 h-20 z-10"
                  id="image-upload"
                />
                <span
                  className={`w-20 h-20 rounded-full flex items-center justify-center border-2 border-primary/40 bg-base-200 overflow-hidden 
                  shadow hover:shadow-lg transition
                  ${
                    imagePreview
                      ? "ring ring-fuchsia-400 border-0"
                      : "hover:border-fuchsia-300/80"
                  }`}
                  tabIndex={0}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </span>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-[-7px] right-[-7px] bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-red-100 transition z-20"
                    aria-label="Clear"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Code className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  {...register("name")}
                  className={`input input-bordered w-full pl-10 transition-all ${
                    errors.name ? "input-error" : ""
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
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
              className="btn btn-primary btn-lg w-full transition-all font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0.5 duration-150"
              disabled={isSigninUp}
            >
              {isSigninUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="ml-2">Loading...</span>
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </form>
          {/* Footer */}
          <div className="text-center mt-3 text-base-content/60">
            <span>
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
