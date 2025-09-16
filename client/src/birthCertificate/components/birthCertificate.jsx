import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BirthCertificate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    fatherName: "",
    motherName: "",
    placeOfBirth: "",
    fatherAadhar: null,
    motherAadhar: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0], // file object save hoga
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // future me backend ko file bhejne ke liye FormData() use karenge
    // const data = new FormData();
    // Object.keys(formData).forEach(key => data.append(key, formData[key]));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Birth Certificate Application
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700">Father's Aadhaar</label>
              <input
                type="file"
                name="fatherAadhar"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-gray-700">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700">Mother's Aadhaar</label>
              <input
                type="file"
                name="motherAadhar"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-gray-700">Place of Birth</label>
              <input
                type="text"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h3 className="text-green-600 font-bold text-xl mb-2">
              ✅ Application Submitted!
            </h3>
            <p className="text-gray-700">
              Thank you, <b>{formData.name}</b>. Your Birth Certificate
              application has been recorded.
            </p>
            <p className="text-gray-500 mt-2 text-sm">
              (Aadhaar documents uploaded successfully)
            </p>
            <button onClick={() => navigate("/")} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg">
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
