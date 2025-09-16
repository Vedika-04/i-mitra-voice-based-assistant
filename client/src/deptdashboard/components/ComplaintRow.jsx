import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

const ComplaintRow = ({ complaint }) => {
  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
        <Link
          to={`/department/complaints/${complaint._id}`}
          className="hover:underline"
        >
          {complaint.title}
        </Link>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={complaint.status} />
      </td>
      <td className="px-6 py-4 capitalize">{complaint.priority}</td>
      <td className="px-6 py-4">
        <Link
          to={`/department/complaints/${complaint._id}`}
          className="text-blue-600 hover:underline font-medium"
        >
          Details
        </Link>
      </td>
    </tr>
  );
};

export default ComplaintRow;
