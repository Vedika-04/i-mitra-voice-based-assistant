import React from "react";

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-3 py-2">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-3 py-2">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </td>
    <td className="px-3 py-2">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-3 py-2">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    </td>
    <td className="px-3 py-2">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-3 py-2">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-3 py-2">
      <div className="h-6 bg-gray-200 rounded w-12"></div>
    </td>
  </tr>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
