import React from "react";
import { useJobStore } from "../../store/useJobStore";
import { Search, MapPin, X } from "lucide-react";

export const JobFilter = () => {
  const { filters, setFilters, clearFilters } = useJobStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ q: e.target.value });
  };

  return (
    <div className="bg-base-100 lg:bg-base-100 rounded-2xl shadow-sm border border-base-200 p-4 lg:p-6 lg:space-y-6 sticky top-0 z-10 mb-4 lg:mb-0">
      <div className="flex items-center justify-between mb-2 lg:mb-0">
        <h2 className="font-semibold text-lg ">Filters</h2>
        <button 
          onClick={clearFilters}
          className="btn btn-error btn-soft btn-xs "
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3 lg:gap-0 lg:space-y-4 pb-1 lg:pb-0">
        {/* Search */}
        <div className="w-full lg:space-y-2">
          <label className="text-sm font-medium hidden lg:block">Keywords</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input 
              type="text" 
              placeholder="Keywords..." 
              className="input input-bordered w-full pl-9 h-10 text-sm"
              value={filters.q || ""}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Location */}
        <div className="w-full lg:space-y-2">
          <label className="text-sm font-medium hidden lg:block">Location</label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input 
              type="text" 
              placeholder="Location..." 
              className="input input-bordered w-full pl-9 h-10 text-sm"
              value={filters.location === "All" ? "" : filters.location}
              onChange={(e) => setFilters({ location: e.target.value || "All" })}
            />
          </div>
        </div>

        <div className="hidden lg:block divider my-2"></div>

        {/* Experience */}
        <div className="w-full lg:space-y-2">
          <label className="text-sm font-medium hidden lg:block">Experience Level</label>
          <select 
            className="select select-bordered w-full select-sm h-10 text-sm"
            value={filters.experienceLevel}
            onChange={(e) => setFilters({ experienceLevel: e.target.value })}
          >
            <option value="All">All Levels</option>
            <option value="Entry level">Entry level</option>
            <option value="Junior">Junior</option>
            <option value="Mid level">Mid level</option>
            <option value="Senior">Senior</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Type */}
        <div className="w-full lg:space-y-2">
          <label className="text-sm font-medium hidden lg:block">Employment Type</label>
          <select 
            className="select select-bordered w-full select-sm h-10 text-sm"
            value={filters.employmentType}
            onChange={(e) => setFilters({ employmentType: e.target.value })}
          >
            <option value="All">All Types</option>
            <option value="Full time">Full time</option>
            <option value="Part time">Part time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>
    </div>
  );
};
