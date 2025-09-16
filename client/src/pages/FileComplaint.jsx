import { useState } from "react";
import { toast } from "react-toastify";
import { createComplaint } from "../services/complaintApi";
import { getDeptAndCatJSON } from "../services/Aiservice";
import { useNavigate } from "react-router-dom";

const FileComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    addressManual: "",
    gmapLink: "",
    images: [],
    videos: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const onFilesChange = (e) => {
    const { name, files } = e.target;
    setForm((f) => ({ ...f, [name]: Array.from(files) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    try {
      setSubmitting(true);
      // Client-side AI classification
      const ai = await getDeptAndCatJSON({
        title: form.title,
        description: form.description,
      });

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (form.addressManual)
        fd.append("location[addressManual]", form.addressManual);
      if (form.gmapLink) fd.append("location[gmapLink]", form.gmapLink);
      (form.images || []).forEach((f) => fd.append("images", f));
      (form.videos || []).forEach((f) => fd.append("videos", f));
      fd.append("aiSuggestion", JSON.stringify(ai)); // server trusts client AI (as per your decision)

      await createComplaint(fd);
      toast.success("Complaint filed");
      navigate("/citizendashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-xl border bg-white p-5">
      <h2 className="mb-4 text-xl font-semibold">File a Complaint</h2>
      <form onSubmit={submit} className="grid gap-3">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full rounded-md border px-3 py-2 text-sm"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          rows={6}
          className="w-full rounded-md border px-3 py-2 text-sm"
          required
        />
        <input
          type="text"
          placeholder="Address (optional)"
          value={form.addressManual}
          onChange={(e) =>
            setForm((f) => ({ ...f, addressManual: e.target.value }))
          }
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Google Maps link (optional)"
          value={form.gmapLink}
          onChange={(e) => setForm((f) => ({ ...f, gmapLink: e.target.value }))}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <div className="grid gap-1">
          <label className="text-sm text-gray-700">Images</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={onFilesChange}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm text-gray-700">Videos</label>
          <input
            type="file"
            name="videos"
            multiple
            accept="video/*"
            onChange={onFilesChange}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileComplaint;
