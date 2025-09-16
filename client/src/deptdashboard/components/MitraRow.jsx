const MitraRow = ({ mitra }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={mitra.profileImg || "/api/placeholder/40/40"}
              alt={mitra.fullName}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {mitra.fullName}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{mitra.mobile}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{mitra.zone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {mitra.assignedComplaints?.length || 0} complaints
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            mitra.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {mitra.isActive ? "Active" : "Inactive"}
        </span>
      </td>
    </tr>
  );
};

export default MitraRow;
