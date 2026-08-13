import React from "react";
import { MapPin, Briefcase, IndianRupee, Bookmark, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useJobStore } from "../../store/useJobStore";

interface JobCardProps {
  job: any;
  isSaved?: boolean;
}

const JobCard = ({ job, isSaved = false }: JobCardProps) => {
  const { toggleSaveJob } = useJobStore();

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleSaveJob(job._id, isSaved);
    } catch (error) {
      // handled in store
    }
  };

  return (
    <Link 
      to={`/jobs/${job._id}`}
      className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md hover:border-primary/30 transition-all duration-300 group block relative"
    >
      <div className="card-body p-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="card-title text-lg mb-1 group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="font-medium text-base-content/80">{job.companyName}</p>
          </div>
          <div className="flex items-center gap-2 -mt-2 -mr-2">
            {job.source && job.source !== "Internal" && (
              <span className="badge badge-sm badge-primary badge-soft">{job.source}</span>
            )}
            <button 
              onClick={handleSave}
              className="btn btn-warning btn-soft btn-circle btn-sm"
            >
              {isSaved ? <BookmarkCheck size={20} className="fill-warning" /> : <Bookmark size={20} />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-base-content/70">
          <div className="flex items-center gap-1.5">
            <MapPin size={16} />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase size={16} />
            {job.employmentType}
          </div>
          {job.salaryRange && (
            <div className="flex items-center gap-1.5">
              <IndianRupee size={16} />
              {job.salaryRange}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {job.skills.slice(0, 4).map((skill: string) => (
            <span key={skill} className="badge badge-outline border-base-300 bg-base-200/50">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="badge badge-outline border-base-300 bg-base-200/50 text-base-content/50">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>

      </div>
    </Link>
  );
};

export default JobCard;
