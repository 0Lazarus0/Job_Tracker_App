"use client";

import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";

type Job = {
  company: string;
  role: string;
  status: string;
};

export default function Home() {
  // Core state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Load jobs from localStorage after hydration
  useEffect(() => {
    const saved = localStorage.getItem("jobs");
    if (saved) {
      setJobs(JSON.parse(saved));
    } else {
      setJobs([
        { company: "Google", role: "Frontend Intern", status: "Applied" },
        { company: "Amazon", role: "Software Engineer Intern", status: "Interview" },
        { company: "Meta", role: "Full Stack Intern", status: "Offer" },
      ]);
    }
  }, []);

  // Persist jobs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  // Add or edit a job
  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;

    const newJob: Job = { company, role, status };

    if (editIndex !== null) {
      const updatedJobs = [...jobs];
      updatedJobs[editIndex] = newJob;
      setJobs(updatedJobs);
      setEditIndex(null);
    } else {
      setJobs([...jobs, newJob]);
    }

    setCompany("");
    setRole("");
    setStatus("Applied");
    setShowForm(false);
  };

  // Delete a job
  const handleDelete = (index: number) => {
    const updatedJobs = jobs.filter((_, i) => i !== index);
    setJobs(updatedJobs);
  };

  // Edit a job
  const handleEdit = (index: number) => {
    const job = jobs[index];
    setCompany(job.company);
    setRole(job.role);
    setStatus(job.status);
    setEditIndex(index);
    setShowForm(true);
  };

  // Filtered jobs based on search & status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-gray-800">Job Tracker</h1>
        <p className="text-gray-600 mt-2 text-lg">Track and manage your job applications efficiently</p>
      </div>

      {/* Add/Edit Job Button */}
      <button
        className="mb-6 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow"
        onClick={() => setShowForm(!showForm)}
      >
        + {showForm ? "Cancel" : editIndex !== null ? "Edit Job" : "Add Job"}
      </button>

      {/* Job Form */}
      {showForm && (
        <form
          onSubmit={handleAddJob}
          className="mb-6 p-6 bg-white rounded-lg shadow-md space-y-4"
        >
          <div>
            <label className="block text-gray-700 font-semibold">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 p-3 border-2 border-blue-400 rounded w-full
                         focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500
                         bg-blue-50 text-gray-900 placeholder-gray-500 font-medium shadow"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 p-3 border-2 border-blue-400 rounded w-full
                         focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500
                         bg-blue-50 text-gray-900 placeholder-gray-500 font-medium shadow"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 p-3 border-2 border-blue-400 rounded w-full
                         focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500
                         bg-blue-50 text-gray-900 font-medium shadow"
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow"
          >
            {editIndex !== null ? "Update Job" : "Add Job"}
          </button>
        </form>
      )}

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-4">
        {/* Search by company */}
        <input
          type="text"
          placeholder="Search by company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2 md:mb-0 p-3 border-2 border-blue-500 rounded w-full md:w-1/2
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
                     bg-blue-50 text-gray-900 placeholder-gray-500 font-semibold shadow-lg"
        />

        {/* Filter by status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border-2 border-blue-500 rounded w-full md:w-1/4
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
                     bg-blue-50 text-gray-900 font-semibold shadow-lg"
        >
          <option>All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Job Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job, index) => (
          <JobCard
            key={index}
            company={job.company}
            role={job.role}
            status={job.status}
            onEdit={() => handleEdit(index)}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </div>
    </main>
  );
}