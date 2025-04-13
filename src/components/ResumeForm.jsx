import React, { useState } from 'react';

const ResumeForm = ({ onGenerate, loading }) => {
  const [form, setForm] = useState({
    name: '',
    jobTitle: '',
    experience: '',
    skills: '',
    generateFor: 'resume', // or 'coverLetter'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full px-3 py-2 border rounded"
        type="text"
        name="name"
        placeholder="Your Name"
        onChange={handleChange}
        required
      />
      <input
        className="w-full px-3 py-2 border rounded"
        type="text"
        name="jobTitle"
        placeholder="Job Title"
        onChange={handleChange}
        required
      />
      <textarea
        className="w-full px-3 py-2 border rounded"
        name="experience"
        placeholder="Your Experience"
        rows="3"
        onChange={handleChange}
      />
      <textarea
        className="w-full px-3 py-2 border rounded"
        name="skills"
        placeholder="Your Skills"
        rows="2"
        onChange={handleChange}
      />
      <select
        name="generateFor"
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="resume">Resume</option>
        <option value="coverLetter">Cover Letter</option>
      </select>

      {loading && (
        <p className="text-blue-600 font-semibold">
          {form.generateFor === 'resume' ? 'Creating Resume...' : 'Creating Cover Letter...'}
        </p>
      )}

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
    </form>

  );
};

export default ResumeForm;
