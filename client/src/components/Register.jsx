import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [profileFile, setProfileFile] = useState(null); // state to store file

  const handleRegister = async (data) => {
    try {
      // phone format
      const phoneWithCode = `+91${data.phone}`;

      // create FormData for multipart upload
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", phoneWithCode);
      formData.append("password", data.password);
      formData.append("address", data.address);
      formData.append("zone", data.zone);
      formData.append("verificationMethod", data.verificationMethod);
      if (data.age) formData.append("age", data.age);
      if (data.aadhaarNo) formData.append("aadhaarNo", data.aadhaarNo);
      // file
      if (profileFile) {
        formData.append("profileimg", profileFile);
      }

      const res = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res.data.message);
      navigateTo(`/otp-verification/${data.email}/${phoneWithCode}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <form className="auth-form" onSubmit={handleSubmit(handleRegister)}>
        <h2>Register</h2>

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          required
          {...register("fullName")}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          required
          {...register("email")}
        />

        {/* Phone */}
        <div>
          <span>+91</span>
          <input
            type="number"
            placeholder="Phone"
            required
            {...register("phone")}
          />
        </div>

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          required
          {...register("password")}
        />

        {/* Address */}
        <input
          type="text"
          placeholder="Address"
          required
          {...register("address")}
        />

        {/* Zone (dropdown with fixed values) */}
        <select {...register("zone")} required>
          <option value="">Select Zone</option>
          <option value="Dr. Hedgewar (Kila Maidan) Zone">
            Dr. Hedgewar (Kila Maidan) Zone
          </option>
          <option value="Lal Bahadur Shastri (Raj Mohalla) Zone">
            Lal Bahadur Shastri (Raj Mohalla) Zone
          </option>
          <option value="Shaheed Bhagat Singh (Nagar Nigam) Zone">
            Shaheed Bhagat Singh (Nagar Nigam) Zone
          </option>
          <option value="Maharana Pratap (Sangam Nagar) Zone">
            Maharana Pratap (Sangam Nagar) Zone
          </option>
          <option value="Chandragupta Maurya (Sukhaliya) Zone">
            Chandragupta Maurya (Sukhaliya) Zone
          </option>
          <option value="Subhash Chandra Bose (Subhash Nagar) Zone">
            Subhash Chandra Bose (Subhash Nagar) Zone
          </option>
          <option value="Atal Bihari Vajpayee (Scheme No. 54) Zone">
            Atal Bihari Vajpayee (Scheme No. 54) Zone
          </option>
          <option value="Chandrashekhar Azad (Vijay Nagar) Zone">
            Chandrashekhar Azad (Vijay Nagar) Zone
          </option>
          <option value="Dr. Bhimrao Ambedkar (Pancham ki fel) Zone">
            Dr. Bhimrao Ambedkar (Pancham ki fel) Zone
          </option>
          <option value="Dr. Shyamaprasad Mukherjee (Saket Nagar) Zone">
            Dr. Shyamaprasad Mukherjee (Saket Nagar) Zone
          </option>
          <option value="Rajmata Scindia (Stadium) Zone">
            Rajmata Scindia (Stadium) Zone
          </option>
          <option value="Harsiddhi Zone">Harsiddhi Zone</option>
          <option value="Pt. Deendayal Upadhyay (Bilawali) Zone">
            Pt. Deendayal Upadhyay (Bilawali) Zone
          </option>
          <option value="Rajendra Dharkar (Hawa Bungalow) Zone">
            Rajendra Dharkar (Hawa Bungalow) Zone
          </option>
          <option value="Laxman Singh Gaud (David Nagar) Zone">
            Laxman Singh Gaud (David Nagar) Zone
          </option>
          <option value="Kushabhau Thackeray (Aerodrome Road) Zone">
            Kushabhau Thackeray (Aerodrome Road) Zone
          </option>
          <option value="Mahatma Gandhi (Narwal) Zone">
            Mahatma Gandhi (Narwal) Zone
          </option>
          <option value="Chhatrapati Shivaji (Krishi Vihar) Zone">
            Chhatrapati Shivaji (Krishi Vihar) Zone
          </option>
          <option value="Sardar Vallabhbhai Patel (Scheme No. 94) Zone">
            Sardar Vallabhbhai Patel (Scheme No. 94) Zone
          </option>
          <option value="Rajmata Jeejabai Zone">Rajmata Jeejabai Zone</option>
          <option value="Swatantra Veer Vinayak Damodar Sawarkar (Pragati Nagar Zone)">
            Swatantra Veer Vinayak Damodar Sawarkar (Pragati Nagar Zone)
          </option>
          <option value="Gen. Harisingh Nalwa (Bombay Hospital Water tank zone)">
            Gen. Harisingh Nalwa (Bombay Hospital Water tank zone)
          </option>
        </select>

        {/* Age (optional) */}
        <input
          type="number"
          placeholder="Age (optional)"
          {...register("age")}
        />

        {/* Aadhaar No (optional) */}
        <input
          type="text"
          placeholder="Aadhaar Number (optional)"
          {...register("aadhaarNo")}
        />

        {/* Profile Image upload */}
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setProfileFile(e.target.files[0])}
        />

        {/* Verification Method */}
        <div className="verification-method">
          <p>Select Verification Method</p>
          <div className="wrapper">
            <label>
              <input
                type="radio"
                name="verificationMethod"
                value={"email"}
                {...register("verificationMethod")}
                required
              />
              Email
            </label>
            <label>
              <input
                type="radio"
                name="verificationMethod"
                value={"phone"}
                {...register("verificationMethod")}
                required
              />
              Phone
            </label>
          </div>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
