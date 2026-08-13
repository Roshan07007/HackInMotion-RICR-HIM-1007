import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit3,
  LogOut,
  FileText,
  Target,
  Activity,
  X,
  Check,
  Loader2,
  User,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { getInitials } from "../utils/getInitials";
import toast from "react-hot-toast";
import { useUiStore } from "../store/useUiStore";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface EditForm {
  name: string;
  phone: string;
}

// ---------------------------------------------------------------------------
// Profile page
// ---------------------------------------------------------------------------
const Profile = () => {
  const { user, logout, updateProfile, optimisticUpdate } = useAuthStore();

  // Avatar — simple local state approach
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null); // shown immediately on pick
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { setHeaderTitle } = useUiStore();

  // Edit modal
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EditForm>({ name: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setHeaderTitle("Profile");
    return () => {
      setHeaderTitle("");
    };
  }, []);

  if (!user) return null;

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------
  const handleAvatarClick = () => avatarInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show the image instantly from local memory
    const blobUrl = URL.createObjectURL(file);
    setLocalAvatar(blobUrl);

    // Upload in background
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const ok = await updateProfile(formData);
      if (ok) {
        toast.success("Profile picture updated!");
        // Keep showing localAvatar — it's the same image the server saved
      } else {
        toast.error("Failed to update profile picture");
        setLocalAvatar(null); // revert to old server avatar
      }
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const openEdit = () => {
    setForm({ name: user.name, phone: user.phone || "" });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    // Optimistic update
    optimisticUpdate({
      name: form.name.trim(),
      phone: form.phone.trim() || undefined,
    });
    setIsSaving(true);
    const ok = await updateProfile({
      name: form.name.trim(),
      phone: form.phone.trim() || undefined,
    });
    setIsSaving(false);
    if (ok) {
      toast.success("Profile updated!");
      setIsEditing(false);
    } else {
      toast.error("Failed to update profile");
    }
  };

  // localAvatar takes priority — it's the image the user just picked
  const displayAvatar = localAvatar ?? user.avatar?.url;

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* ---- Hidden file input ---- */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />

      {/* ---- Header Banner & Avatar ---- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl bg-base-100 border border-base-content/5 shadow overflow-hidden"
      >
        <div className="h-48 bg-gradient-to-r from-primary/80 to-secondary/80 relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            {/* Avatar */}
            <div className="relative group" onClick={handleAvatarClick}>
              <div className="w-32 h-32 rounded-full border-4 border-base-100 bg-base-300 flex items-center justify-center text-4xl font-bold text-base-content overflow-hidden shadow-2xl relative z-10 cursor-pointer">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="select-none">{getInitials(user.name)}</span>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                  {isUploadingAvatar ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
              <button
                type="button"
                aria-label="Change profile picture"
                className="absolute bottom-2 right-2 p-2 bg-base-100 rounded-full border border-base-content/10 text-base-content shadow-lg hover:bg-base-200 transition-colors z-20"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={openEdit}
                className="btn btn-outline border-base-content/20 hover:bg-base-content/5 text-base-content"
              >
                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
              </button>
              <button onClick={logout} className="btn btn-error btn-soft">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-base-content tracking-tight">
              {user.name}
            </h1>
            <p className="text-base-content/60 font-medium flex items-center gap-2 mt-1">
              <Shield className="w-4 h-4 text-primary" />
              {user.role === "admin" ? "Administrator" : "Standard User"}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* ---- Personal Information ---- */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-8"
        >
          <div className="bg-base-100 rounded-3xl p-8 border border-base-content/5 shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-base-content">
                Personal Information
              </h2>
              <button onClick={openEdit} className="btn btn-sm btn-ghost gap-2">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <InfoField
                  label="Full Name"
                  icon={<User className="w-4 h-4 text-base-content/40" />}
                  value={user.name}
                />
                <InfoField
                  label="Email Address"
                  icon={<Mail className="w-4 h-4 text-base-content/40" />}
                  value={user.email}
                />
                <InfoField
                  label="Phone Number"
                  icon={<Phone className="w-4 h-4 text-base-content/40" />}
                  value={user.phone || "Not provided"}
                />
                <InfoField
                  label="Member Since"
                  icon={<Calendar className="w-4 h-4 text-base-content/40" />}
                  value={
                    user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown"
                  }
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---- Activity & Stats ---- */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-base-100 rounded-3xl p-6 border border-base-content/5 shadow">
            <h2 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Activity Stats
            </h2>
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-base-content">
                    Resumes Analyzed
                  </span>
                </div>
                <span className="text-2xl font-bold text-primary">0</span>
              </div>
              <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="font-medium text-base-content">
                    Mock Interviews
                  </span>
                </div>
                <span className="text-2xl font-bold text-secondary">0</span>
              </div>
            </div>
          </div>

         
        </motion.div>
      </div>

      {/* ---- Edit Profile Modal ---- */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-base-300/60 backdrop-blur-sm"
              onClick={() => setIsEditing(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-base-100 rounded-3xl shadow-2xl w-full max-w-md p-8 z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Edit Profile</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Avatar section inside modal */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-base-200/50 rounded-2xl border border-base-content/5">
                <div
                  className="relative w-16 h-16 rounded-full bg-base-300 flex items-center justify-center overflow-hidden cursor-pointer shrink-0 group"
                  onClick={handleAvatarClick}
                >
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold select-none">
                      {getInitials(user.name)}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                    {isUploadingAvatar ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm">Profile Picture</p>
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar}
                    className="text-primary text-sm hover:underline mt-0.5 disabled:opacity-50"
                  >
                    {isUploadingAvatar ? "Uploading…" : "Change photo"}
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full rounded-xl"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="input input-bordered w-full rounded-xl"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+91 99999 99999"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input input-bordered w-full rounded-xl opacity-60 cursor-not-allowed"
                    value={user.email}
                    disabled
                  />
                  <p className="text-xs text-base-content/40 mt-1">
                    Email cannot be changed.
                  </p>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost flex-1 rounded-xl"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !form.name.trim()}
                  className="btn btn-primary flex-1 rounded-xl gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {isSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
const InfoField = ({
  label,
  icon,
  value,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
}) => (
  <div>
    <label className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 block">
      {label}
    </label>
    <div className="text-base-content font-medium bg-base-200 px-4 py-3 rounded-xl border border-base-content/5 flex items-center gap-3">
      {icon}
      {value}
    </div>
  </div>
);

export default Profile;
