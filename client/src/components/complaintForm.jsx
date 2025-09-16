import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import { getDeptAndCatJSON } from "../services/Aiservice";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

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
          ? "border-green-500 bg-green-50"
          : "border-dashed border-gray-300 hover:border-green-400"
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
        onSelect({ target: { files: droppedFiles } });
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

export default function CreateComplaintModal({ onClose }) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imgDragOver, setImgDragOver] = useState(false);
  const [vidDragOver, setVidDragOver] = useState(false);
  const imgInputRef = useRef(null);
  const vidInputRef = useRef(null);
  const promptedRef = useRef(false);

  const MAX_IMAGES = 5,
    MAX_VIDEOS = 2;
  const MAX_IMAGE_MB = 5,
    MAX_VIDEO_MB = 10,
    MAX_TOTAL_MB = 50;
  const bytesToMB = (bytes) => bytes / (1024 * 1024);
  const totalMB = () =>
    bytesToMB([...images, ...videos].reduce((s, f) => s + f.size, 0));

  useEffect(() => {
    if (!promptedRef.current) {
      promptedRef.current = true;
      toast.info("Tip: Location on karke 'Use my location' dabayein.");
    }
  }, []);

  const getLocation = async () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");

    try {
      if (navigator.permissions) {
        const perm = await navigator.permissions.query({ name: "geolocation" });
        if (perm.state === "denied")
          return toast.error(
            "Location blocked. Browser settings se enable karein."
          );
      }
    } catch {}

    setLoadingLocation(true);
    toast.info("Please allow location access...");

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
      (err) => {
        setLoadingLocation(false);
        if (err.code === err.PERMISSION_DENIED)
          toast.error("You denied location access.");
        else if (err.code === err.POSITION_UNAVAILABLE)
          toast.error("Location unavailable. Try again.");
        else if (err.code === err.TIMEOUT)
          toast.error("Location request timed out.");
        else toast.error("Location fetch failed");
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

    if (remainingSlots === 0) {
      return toast.error(
        isImage
          ? `Max ${MAX_IMAGES} images allowed`
          : `Max ${MAX_VIDEOS} videos allowed`
      );
    }

    let accepted = [],
      rejectedCount = 0;

    for (const file of files) {
      const isTypeOk = isImage
        ? file.type.startsWith("image/")
        : file.type.startsWith("video/");
      if (!isTypeOk) {
        rejectedCount++;
        continue;
      }

      const sizeMB = bytesToMB(file.size);
      if (sizeMB > perFileMB) {
        toast.error(
          isImage
            ? `Image ${file.name} exceeds ${MAX_IMAGE_MB}MB`
            : `Video ${file.name} exceeds ${MAX_VIDEO_MB}MB`
        );
        continue;
      }

      if (accepted.length >= remainingSlots) {
        rejectedCount++;
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

    if (accepted.length) {
      isImage
        ? setImages((prev) => [...prev, ...accepted])
        : setVideos((prev) => [...prev, ...accepted]);
      toast.success(`${accepted.length} file(s) added`);
    }

    if (rejectedCount > 0)
      toast.error(`${rejectedCount} file(s) ignored due to limits`);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!formData.title || !formData.description)
  //     return toast.error("Please fill all required fields");
  //   if (images.length === 0 && videos.length === 0)
  //     return toast.error("Please upload at least one photo or video");

  //   const { department, category } = await getDeptAndCatJSON({
  //     title: formData.title,
  //     description: formData.description,
  //   });

  //   const data = new FormData();
  //   data.append("title", formData.title);
  //   data.append("description", formData.description);
  //   data.append("category", category);
  //   data.append("departmentName", department);
  //   data.append("location[lat]", location.lat);
  //   data.append("location[lng]", location.lng);
  //   data.append("location[gmapLink]", location.gmapLink);
  //   data.append("location[location]", formData.manualLocation);
  //   images.forEach((img) => data.append("images", img));
  //   videos.forEach((vid) => data.append("videos", vid));

  //   try {
  //     const res = await fetch(
  //       "http://localhost:4000/api/v1/complaint/filecomplaint",
  //       {
  //         method: "POST",
  //         credentials: "include",
  //         body: data,
  //       }
  //     );
  //     const result = await res.json();
  //     if (result.success) {
  //       toast.success("Complaint submitted successfully!");
  //       setFormData({ title: "", description: "", manualLocation: "" });
  //       setLocation({ lat: null, lng: null, gmapLink: "", location: "" });
  //       setImages([]);
  //       setVideos([]);
  //       onClose?.();
  //     } else {
  //       toast.error(result.message || "Submission failed");
  //     }
  //   } catch (err) {
  //     toast.error("Something went wrong");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description)
      return toast.error("Please fill all required fields");
    if (images.length === 0 && videos.length === 0)
      return toast.error("Please upload at least one photo or video");

    setIsSubmitting(true); // Start loading

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

    try {
      const res = await fetch(
        "http://localhost:4000/api/v1/complaint/filecomplaint",
        {
          method: "POST",
          credentials: "include",
          body: data,
        }
      );
      const result = await res.json();
      if (result.success) {
        toast.success("Complaint submitted successfully!");
        setFormData({ title: "", description: "", manualLocation: "" });
        setLocation({ lat: null, lng: null, gmapLink: "", location: "" });
        setImages([]);
        setVideos([]);
        onClose?.();
      } else {
        toast.error(result.message || "Submission failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b">
          <h2 className="text-base sm:text-lg font-semibold text-green-700">
            File New Complaint
          </h2>
          <button
            onClick={() => {
              onClose?.(); // Close modal first
              navigate(-1); // Go back to previous page
            }}
            className="rounded-full p-1 sm:p-2 hover:bg-gray-100 text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-4 py-4 sm:px-6 sm:py-5 space-y-4"
        >
          <input
            type="text"
            placeholder="Title*"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-green-300"
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
                className="w-full rounded-xl bg-green-600 text-white py-3 hover:bg-green-700 transition"
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
            className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-green-300"
          />
          <p className="mt-1 text-xs text-gray-500">
            Tip: Agar GPS off ho to yahan address likh dein.
          </p>

          <textarea
            placeholder="Description*"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-green-300"
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
              if (imgInputRef.current) imgInputRef.current.value = "";
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
              if (vidInputRef.current) vidInputRef.current.value = "";
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
                onClose?.(); // Close modal first
                navigate(-1); // Go back to previous page
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
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                    fill="none"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    className="opacity-75"
                  />
                </svg>
              )}
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
