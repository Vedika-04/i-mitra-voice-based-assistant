import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Complaint311Detail = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/v1/complaint311/${id}`,
          { withCredentials: true }
        );
        setComplaint(response.data.complaint);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load complaint details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          311 Complaint Details
        </h1>
        <div className="flex items-center space-x-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {complaint.category}
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{complaint.departmentName}</span>
        </div>
      </div>

      {/* Complaint Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Title</h3>
            <p className="text-gray-700">{complaint.title}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>

          {/* Media */}
          {complaint.media &&
            (complaint.media.images?.length > 0 ||
              complaint.media.videos?.length > 0) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Attachments
                </h3>

                {/* Images */}
                {complaint.media.images &&
                  complaint.media.images.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-md font-medium text-gray-800 mb-2">
                        Images
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {complaint.media.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Complaint image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {/* Videos */}
                {complaint.media.videos &&
                  complaint.media.videos.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-2">
                        Videos
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {complaint.media.videos.map((video, index) => (
                          <video
                            key={index}
                            controls
                            className="w-full h-48 rounded-lg border border-gray-200"
                          >
                            <source src={video} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Complaint311Detail;
