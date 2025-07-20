import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
import {
  Loader2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Image as ImageIcon,
  X,
} from "lucide-react";

const updateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Enter a valid email"),
  password: z.string().optional().or(z.literal("")),
});

export default function UpdateProfilePage() {
  const { authUser, updateProfile, isUpdating } = useAuthStore(); // Adjust for your store implementation
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(authUser?.image || null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: authUser?.name || "",
      email: authUser?.email || "",
      password: "",
    },
  });

  // Handle avatar image input
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file);
    setValue("image", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Clear chosen image
  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(authUser?.image || null); // revert to current
    setValue("image", null);
  };

  // Profile submit
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.password && data.password.length >= 6) {
        formData.append("password", data.password);
      }
      if (imageFile) formData.append("image", imageFile);
      await updateProfile(formData); // Make sure your store expects FormData for the image!
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-fuchsia-50 to-purple-100 dark:from-[#181824] dark:to-[#27293d] px-3 py-10">
      <div className="w-full max-w-lg rounded-2xl bg-white/90 dark:bg-[#181824]/95 shadow-2xl backdrop-blur-lg p-8 border border-primary/10 mx-2">
        <h2 className="text-3xl font-bold mb-6 text-primary text-center">
          Update Profile
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-7"
          encType="multipart/form-data"
        >
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2 relative mb-2">
            <label className="font-medium text-primary flex gap-2 mb-1">
              Profile Image <ImageIcon className="w-5 h-5" />
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-20 h-20 z-10"
                id="update-image-upload"
              />
              <span
                className={`w-20 h-20 rounded-full flex items-center justify-center border-2 border-primary/40 bg-base-200 overflow-hidden shadow hover:shadow-lg transition
                  ${imagePreview ? "ring ring-fuchsia-400 border-0" : "hover:border-fuchsia-300/80"}
                `}
                tabIndex={0}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="avatar"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </span>
              {imageFile && (
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
                <User className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="text"
                {...register("name")}
                className={`input input-bordered w-full pl-10 transition-all ${
                  errors.name ? "input-error" : ""
                }`}
                placeholder="Your name"
                autoComplete="off"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
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
                autoComplete="off"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">New Password<span className="text-gray-400 text-xs pl-1">(leave blank to keep current)</span></span>
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
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg w-full font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0.5 duration-150 transition-all"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="ml-2">Updating...</span>
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
