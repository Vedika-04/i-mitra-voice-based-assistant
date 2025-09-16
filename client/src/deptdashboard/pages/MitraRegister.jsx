import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MitraRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    zone: "",
  });
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const ZONES = [
    "Dr. Hedgewar (Kila Maidan) Zone",
    "Lal Bahadur Shastri (Raj Mohalla) Zone",
    "Shaheed Bhagat Singh (Nagar Nigam) Zone",
    "Maharana Pratap (Sangam Nagar) Zone",
    "Chandragupta Maurya (Sukhaliya) Zone",
    "Subhash Chandra Bose (Subhash Nagar) Zone",
    "Atal Bihari Vajpayee (Scheme No. 54) Zone",
    "Chandrashekhar Azad (Vijay Nagar) Zone",
    "Dr. Bhimrao Ambedkar (Pancham ki fel) Zone",
    "Dr. Shyamaprasad Mukherjee (Saket Nagar) Zone",
    "Rajmata Scindia (Stadium) Zone",
    "Harsiddhi Zone",
    "Pt. Deendayal Upadhyay (Bilawali) Zone",
    "Rajendra Dharkar (Hawa Bungalow) Zone",
    "Laxman Singh Gaud (David Nagar) Zone",
    "Kushabhau Thackeray (Aerodrome Road) Zone",
    "Mahatma Gandhi (Narwal) Zone",
    "Chhatrapati Shivaji (Krishi Vihar) Zone",
    "Sardar Vallabhbhai Patel (Scheme No. 94) Zone",
    "Rajmata Jeejabai Zone",
    "Swatantra Veer Vinayak Damodar Sawarkar (Pragati Nagar Zone)",
    "Gen. Harisingh Nalwa (Bombay Hospital Water tank zone)",
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfileImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.mobile || !formData.zone) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!profileImg) {
      toast.error("Please select a profile image");
      return;
    }

    // Validate mobile number (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("mobile", formData.mobile);
      form.append("zone", formData.zone);
      form.append("profileImg", profileImg);

      const response = await axios.post(
        "http://localhost:4000/api/v1/department/mitra/register",
        form,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Mitra registered successfully!");
        navigate("/department/mitras");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error registering Mitra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Register New Mitra
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number *
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              pattern="[0-9]{10}"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter 10 digits only (without +91)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zone *
            </label>
            <select
              name="zone"
              value={formData.zone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Zone</option>
              {ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image *
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload a clear profile photo
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/department/mitras")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registering...
                </div>
              ) : (
                "Register Mitra"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MitraRegister;
