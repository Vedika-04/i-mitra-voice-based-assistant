import { useEffect, useRef, useState, useContext } from "react";
import { toast } from "react-toastify";
import { getDeptAndCatJSON } from "../services/Aiservice";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

// FileUploader Component
const FileUploader = ({
  type,
  files,
  setFiles,
  dragOver,
  setDragOver,
  inputRef,
  onSelect,
  maxCount,
  maxMB,
  totalMB,
  maxTotalMB,
}) => (
  <div>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
      <label className="font-semibold text-gray-800 mb-1 sm:mb-0">
        {type === "image" ? "Images" : "Videos"} (max {maxCount}, {maxMB}MB
        each)
      </label>
      <span className="text-xs text-gray-500">
        {files.length}/{maxCount} • Total: {totalMB.toFixed(1)} / {maxTotalMB}{" "}
        MB
      </span>
    </div>

    <div
      className={`border-2 rounded-xl p-4 sm:p-6 text-center transition cursor-pointer ${
        dragOver
          ? "border-blue-500 bg-blue-50"
          : "border-dashed border-gray-300 hover:border-blue-400"
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files || []);
        if (droppedFiles.length) {
          onSelect({ target: { files: droppedFiles } });
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={`${type}/*`}
        multiple
        className="hidden"
        onChange={onSelect}
      />
      <p className="text-gray-600">
        Click or drag <b>{type}s</b> here to upload
      </p>
    </div>

    {files.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
        {files.map((file, i) => (
          <div
            key={i}
            className={`relative ${
              type === "image" ? "w-20 sm:w-24" : "w-24 sm:w-32"
            }`}
          >
            {type === "image" ? (
              <img
                src={URL.createObjectURL(file)}
                alt={`img-${i}`}
                className="w-full h-20 sm:h-24 object-cover rounded-lg border"
              />
            ) : (
              <video
                src={URL.createObjectURL(file)}
                className="w-full h-16 sm:h-20 object-cover rounded-lg border"
                controls
              />
            )}
            <button
              type="button"
              onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 leading-5 sm:leading-6 text-center text-sm"
              aria-label={`remove ${type}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Main Complaint311Modal
export default function Complaint311Modal({ onClose }) {
  const navigate = useNavigate();
  const { user } = useContext(Context);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    manualLocation: "",
  });
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    gmapLink: "",
    location: "",
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imgDragOver, setImgDragOver] = useState(false);
  const [vidDragOver, setVidDragOver] = useState(false);
  const imgInputRef = useRef(null);
  const vidInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const MAX_IMAGES = 5,
    MAX_VIDEOS = 2;
  const MAX_IMAGE_MB = 5,
    MAX_VIDEO_MB = 10,
    MAX_TOTAL_MB = 50;

  const bytesToMB = (bytes) => bytes / (1024 * 1024);
  const totalMB = () =>
    bytesToMB([...images, ...videos].reduce((s, f) => s + f.size, 0));

  useEffect(() => {
    toast.info("Tip: Location on karke 'Use my location' dabayein.");
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
          gmapLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
          location: "",
        });
        setLoadingLocation(false);
        toast.success("Location fetched successfully");
      },
      () => {
        setLoadingLocation(false);
        toast.error("Failed to fetch location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const addFiles = (files, type) => {
    const isImage = type === "image";
    const current = isImage ? images : videos;
    const other = isImage ? videos : images;
    const limitCount = isImage ? MAX_IMAGES : MAX_VIDEOS;
    const perFileMB = isImage ? MAX_IMAGE_MB : MAX_VIDEO_MB;
    const remainingSlots = Math.max(0, limitCount - current.length);
    if (remainingSlots === 0)
      return toast.error(
        isImage
          ? `Max ${MAX_IMAGES} images allowed`
          : `Max ${MAX_VIDEOS} videos allowed`
      );

    let accepted = [],
      rejectedCount = 0;

    for (const file of files) {
      const typeOk = isImage
        ? file.type.startsWith("image/")
        : file.type.startsWith("video/");
      if (!typeOk) {
        rejectedCount++;
        continue;
      }
      const sizeMB = bytesToMB(file.size);
      if (sizeMB > perFileMB) {
        toast.error(`${file.name} exceeds ${perFileMB}MB`);
        continue;
      }
      const currentTotalBytes = [...current, ...other, ...accepted].reduce(
        (s, f) => s + f.size,
        0
      );
      if (bytesToMB(currentTotalBytes + file.size) > MAX_TOTAL_MB) {
        toast.error("Total file size exceeds 50MB");
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length)
      isImage
        ? setImages((prev) => [...prev, ...accepted])
        : setVideos((prev) => [...prev, ...accepted]);
    if (rejectedCount)
      toast.error(`${rejectedCount} file(s) ignored due to limits`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description)
      return toast.error("Please fill all required fields");
    if (images.length === 0 && videos.length === 0)
      return toast.error("Upload at least one image or video");

    setIsSubmitting(true);

    try {
      const { department, category } = await getDeptAndCatJSON({
        title: formData.title,
        description: formData.description,
      });

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", category);
      data.append("departmentName", department);
      data.append("location[lat]", location.lat);
      data.append("location[lng]", location.lng);
      data.append("location[gmapLink]", location.gmapLink);
      data.append("location[location]", formData.manualLocation);
      images.forEach((img) => data.append("images", img));
      videos.forEach((vid) => data.append("videos", vid));

      const res = await fetch(
        "http://localhost:4000/api/v1/complaint311/filecomplaint",
        { method: "POST", credentials: "include", body: data }
      );
      const result = await res.json();

      if (result.success) {
        toast.success("Complaint submitted successfully!");
        setFormData({ title: "", description: "", manualLocation: "" });
        setLocation({ lat: null, lng: null, gmapLink: "", location: "" });
        setImages([]);
        setVideos([]);
        onClose?.();
      } else toast.error(result.message || "Submission failed");
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-blue-50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-blue-700">
            File 311 Complaint
          </h2>
          <button
            onClick={() => {
              onClose?.();
              navigate(-1);
            }}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <input
            type="text"
            placeholder="Title*"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-300"
          />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-5 md:gap-2">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Auto Location Link
              </label>
              <input
                type="text"
                value={
                  loadingLocation ? "Fetching location..." : location.gmapLink
                }
                readOnly
                className="w-full rounded-xl border bg-gray-100 p-3 text-gray-700"
              />
            </div>
            <div className="md:col-span-2 flex items-end">
              <button
                type="button"
                onClick={getLocation}
                className="w-full rounded-xl bg-blue-600 text-white py-3 hover:bg-blue-700"
              >
                {loadingLocation ? "Locating..." : "Use my location"}
              </button>
            </div>
          </div>
          <input
            type="text"
            placeholder="Optional Manual Location (landmark/address)"
            value={formData.manualLocation}
            onChange={(e) =>
              setFormData({ ...formData, manualLocation: e.target.value })
            }
            className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-300"
          />
          <textarea
            placeholder="Description*"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-300"
          />
          <FileUploader
            type="image"
            files={images}
            setFiles={setImages}
            dragOver={imgDragOver}
            setDragOver={setImgDragOver}
            inputRef={imgInputRef}
            onSelect={(e) => {
              addFiles(Array.from(e.target.files || []), "image");
              imgInputRef.current.value = "";
            }}
            maxCount={MAX_IMAGES}
            maxMB={MAX_IMAGE_MB}
            totalMB={totalMB()}
            maxTotalMB={MAX_TOTAL_MB}
          />
          <FileUploader
            type="video"
            files={videos}
            setFiles={setVideos}
            dragOver={vidDragOver}
            setDragOver={setVidDragOver}
            inputRef={vidInputRef}
            onSelect={(e) => {
              addFiles(Array.from(e.target.files || []), "video");
              vidInputRef.current.value = "";
            }}
            maxCount={MAX_VIDEOS}
            maxMB={MAX_VIDEO_MB}
            totalMB={totalMB()}
            maxTotalMB={MAX_TOTAL_MB}
          />
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                onClose?.();
                navigate(-1);
              }}
              className="px-4 py-2 rounded-xl border hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 rounded-xl text-white transition flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
