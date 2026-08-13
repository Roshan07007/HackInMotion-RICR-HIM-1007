import React, { useState, useEffect, KeyboardEvent, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import {
  X,
  Save,
  Plus,
  Settings,
  Briefcase,
  Code,
  Monitor,
  Mic,
} from "lucide-react";
import Loading from "../components/common/Loading";
import { setHeader } from "../utils/setHeader";

const TagInput = ({
  label,
  icon: Icon,
  tags,
  setTags,
  placeholder,
  suggestions = [],
}: {
  label: string;
  icon: any;
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder: string;
  suggestions?: string[];
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const unusedSuggestions = suggestions.filter((s) => !tags.includes(s));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold flex items-center gap-2 text-base-content/80">
        <Icon size={16} className="text-primary" />
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:bg-primary/20 p-0.5 rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input input-bordered w-full rounded-2xl bg-base-200/50 focus:bg-base-100 transition-colors pl-4 pr-10"
        />
        <button
          type="button"
          onClick={() => {
            if (inputValue.trim() && !tags.includes(inputValue.trim())) {
              setTags([...tags, inputValue.trim()]);
              setInputValue("");
            }
          }}
          className="absolute right-2 text-base-content/40 hover:text-primary transition-colors p-1"
        >
          <Plus size={20} />
        </button>
      </div>

      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="text-xs text-base-content/50 my-auto font-medium">
            Suggestions:
          </span>
          {unusedSuggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setTags([...tags, s])}
              className="badge badge-outline badge-sm cursor-pointer hover:bg-base-300 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Personalize = () => {
  const { user, updateProfile, loading } = useAuthStore();

  const [skills, setSkills] = useState<string[]>([]);
  const [desiredJobs, setDesiredJobs] = useState<string[]>([]);
  const [desiredCompanies, setDesiredCompanies] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("intermediate");
  const [aiCommunicationStyle, setAiCommunicationStyle] = useState("casual");
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);

  // Keep a ref to the latest state so handleSave doesn't need to be a dependency
  // of the setHeader effect, avoiding closure issues.
  const stateRef = useRef({
    skills,
    desiredJobs,
    desiredCompanies,
    experienceLevel,
    aiCommunicationStyle,
    cameraEnabled,
    microphoneEnabled,
  });

  useEffect(() => {
    stateRef.current = {
      skills,
      desiredJobs,
      desiredCompanies,
      experienceLevel,
      aiCommunicationStyle,
      cameraEnabled,
      microphoneEnabled,
    };
  }, [
    skills,
    desiredJobs,
    desiredCompanies,
    experienceLevel,
    aiCommunicationStyle,
    cameraEnabled,
    microphoneEnabled,
  ]);

  const handleSave = async () => {
    const preferences = stateRef.current;
    const success = await updateProfile({ preferences } as any);
    if (success) {
      toast.success("Preferences saved successfully!");
    }
  };

  useEffect(() => {
    setHeader(
      "Personalize",
      <button
        onClick={handleSave}
        disabled={loading}
        className="btn btn-primary btn-sm rounded-full shadow-lg"
      >
        {loading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <Save size={16} />
        )}
        <span className="font-bold ml-1">Save</span>
      </button>,
    );

    return () => {
      setHeader();
    };
  }, [loading]); // Only rebind header if loading state changes

  // Initialize state from user data
  useEffect(() => {
    if (user?.preferences) {
      setSkills(user.preferences.skills || []);
      setDesiredJobs(user.preferences.desiredJobs || []);
      setDesiredCompanies(user.preferences.desiredCompanies || []);
      setExperienceLevel(user.preferences.experienceLevel || "intermediate");
      setAiCommunicationStyle(
        user.preferences.aiCommunicationStyle || "casual",
      );
      setCameraEnabled(user.preferences.cameraEnabled ?? true);
      setMicrophoneEnabled(user.preferences.microphoneEnabled ?? true);
    }
  }, [user]);

  if (!user) return <Loading />;

  return (
    <div className=" mx-auto p-4 md:p-6 pb-20 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (70%): Career Preferences */}
        <div className="md:col-span-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-base-200/40 rounded-3xl p-6 md:p-8 border border-base-300/50 shadow backdrop-blur-sm min-h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Briefcase className="text-primary" size={20} />
              Career Details
            </h2>

            <div className="space-y-8">
              <TagInput
                label="Your Skills"
                icon={Code}
                tags={skills}
                setTags={setSkills}
                placeholder="e.g. React, Node.js, Python..."
                suggestions={[
                  "React",
                  "Node.js",
                  "Python",
                  "TypeScript",
                  "UI/UX",
                  "Java",
                ]}
              />
              <div className="divider opacity-30 my-0"></div>
              <TagInput
                label="Desired Job Roles"
                icon={Briefcase}
                tags={desiredJobs}
                setTags={setDesiredJobs}
                placeholder="e.g. Frontend Developer, Data Scientist..."
                suggestions={[
                  "Frontend Developer",
                  "Backend Developer",
                  "Full Stack Engineer",
                  "Product Manager",
                ]}
              />
              <div className="divider opacity-30 my-0"></div>
              <TagInput
                label="Target Companies"
                icon={Monitor}
                tags={desiredCompanies}
                setTags={setDesiredCompanies}
                placeholder="e.g. Google, Stripe, Notion..."
                suggestions={[
                  "Google",
                  "Stripe",
                  "Netflix",
                  "Amazon",
                  "Microsoft",
                  "Meta",
                ]}
              />
            </div>
          </div>
        </div>

        {/* Right Column (30%): AI Style & Defaults */}
        <div className="md:col-span-1 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-base-200/40 rounded-3xl p-6 md:p-8 border border-base-300/50 shadow backdrop-blur-sm min-h-full flex flex-col gap-8">
            <div>
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Settings className="text-primary" size={18} />
                AI Profile & Style
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-base-content/80">
                    Experience Level
                  </label>
                  <select
                    className="select select-bordered w-full rounded-xl bg-base-100"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    <option value="beginner">Beginner (0-2 years)</option>
                    <option value="intermediate">
                      Intermediate (3-5 years)
                    </option>
                    <option value="expert">Expert (5+ years)</option>
                  </select>
                  <p className="text-xs text-base-content/50 mt-2">
                    Adjusts the complexity of AI explanations and mock interview
                    questions.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block text-base-content/80">
                    AI Mentor Tone
                  </label>
                  <select
                    className="select select-bordered w-full rounded-xl bg-base-100"
                    value={aiCommunicationStyle}
                    onChange={(e) => setAiCommunicationStyle(e.target.value)}
                  >
                    <option value="formal">Formal & Professional</option>
                    <option value="casual">Casual & Friendly</option>
                    <option value="technical">Highly Technical</option>
                  </select>
                  <p className="text-xs text-base-content/50 mt-2">
                    Determines how the AI speaks to you during lessons and
                    chats.
                  </p>
                </div>
              </div>
            </div>

            <div className="divider opacity-30 my-0"></div>

            <div>
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Mic className="text-primary" size={18} />
                Hardware Defaults
              </h2>

              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-base-300/30 rounded-xl transition-colors border border-transparent hover:border-base-300/50">
                  <div>
                    <span className="font-semibold block text-sm">
                      Enable Camera by Default
                    </span>
                    <span className="text-xs text-base-content/50 block">
                      For AI mock interviews and peer programming.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={cameraEnabled}
                    onChange={(e) => setCameraEnabled(e.target.checked)}
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-base-300/30 rounded-xl transition-colors border border-transparent hover:border-base-300/50">
                  <div>
                    <span className="font-semibold block text-sm">
                      Enable Microphone by Default
                    </span>
                    <span className="text-xs text-base-content/50 block">
                      For voice conversations and oral exams.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={microphoneEnabled}
                    onChange={(e) => setMicrophoneEnabled(e.target.checked)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personalize;
