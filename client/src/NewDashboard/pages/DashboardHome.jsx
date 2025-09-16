// import React from "react";
// import StatsCards from "../components/StatsCards";
// import TopUnresolved from "../components/TopUnresolved";

// const DashboardHome = () => {
//   return (
//     <div className="space-y-5">
//       <header className="flex items-center justify-between">
//         <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
//           Citizen Dashboard
//         </h1>
//         <div className="text-sm text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
//           Live
//         </div>
//       </header>
//       <p className="text-gray-600">
//         Welcome back. Here’s a quick overview of your complaints and actions.
//       </p>

//       <StatsCards />

//       <TopUnresolved />
//     </div>
//   );
// };

// export default DashboardHome;

import React from "react";
import StatsCards from "../components/StatsCards";
import TopUnresolved from "../components/TopUnresolved";
import ZoneSnapshot from "../components/ZoneSnapshot";
import QuickActions from "../components/QuickActions";
import StatusChart from "../components/StatusChart";

const DashboardHome = () => {
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Citizen Dashboard
        </h1>
        <div className="text-sm text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
          Live
        </div>
      </header>

      <p className="text-gray-600">
        Welcome back. Here's a quick overview of your complaints and actions.
      </p>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TopUnresolved />
        </div>
        <div>
          <ZoneSnapshot />
        </div>
      </div>

      {/* Status Chart and Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatusChart />
        <div className="grid grid-cols-1 gap-4">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
