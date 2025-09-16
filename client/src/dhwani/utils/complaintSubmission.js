import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000/api/v1";

export class ComplaintSubmissionService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // Important for cookie authentication
      timeout: 30000, // 30 second timeout for file uploads
    });
  }

  async submitComplaint(complaintData) {
    try {
      // Validate data before submission
      this.validateComplaintData(complaintData);

      // Create FormData for multipart upload
      const formData = this.createFormData(complaintData);

      // Log form data contents for debugging
      this.logFormData(formData);

      const response = await this.apiClient.post(
        "/complaint/filecomplaint",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        return {
          success: true,
          complaint: response.data.complaint,
          message: response.data.message || "Complaint submitted successfully!",
        };
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Complaint submission error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit complaint. Please try again.";

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  validateComplaintData(data) {
    const required = ["title", "description", "category", "departmentName"];
    const missing = required.filter(
      (field) => !data[field] || data[field].trim() === ""
    );

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }

    // Validate location
    if (!data.location || (!data.location.lat && !data.location.location)) {
      throw new Error("Location information is required");
    }

    // Validate media limits
    if (data.media.images.length > 5) {
      throw new Error("Maximum 5 images allowed");
    }

    if (data.media.videos.length > 2) {
      throw new Error("Maximum 2 videos allowed");
    }

    // Calculate total file size
    const totalSize = [...data.media.images, ...data.media.videos].reduce(
      (acc, file) => acc + (file.size || 0),
      0
    );

    if (totalSize > 50 * 1024 * 1024) {
      // 50MB
      throw new Error("Total media size should not exceed 50 MB");
    }
  }

  createFormData(complaintData) {
    const formData = new FormData();

    // Add text fields
    formData.append("title", complaintData.title.trim());
    formData.append("description", complaintData.description.trim());
    formData.append("category", complaintData.category);
    formData.append("departmentName", complaintData.departmentName);

    // Add location data
    if (complaintData.location.lat && complaintData.location.lng) {
      formData.append("location[lat]", complaintData.location.lat.toString());
      formData.append("location[lng]", complaintData.location.lng.toString());
    }

    formData.append(
      "location[gmapLink]",
      complaintData.location.gmapLink || ""
    );
    formData.append(
      "location[location]",
      complaintData.location.location || ""
    );

    // Add media files
    complaintData.media.images.forEach((file) => {
      formData.append("images", file);
    });

    complaintData.media.videos.forEach((file) => {
      formData.append("videos", file);
    });

    return formData;
  }

  logFormData(formData) {
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
        );
      } else {
        console.log(`${key}: ${value}`);
      }
    }
  }
}

export default new ComplaintSubmissionService();
