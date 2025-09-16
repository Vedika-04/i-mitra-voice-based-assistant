import React from "react";

const CitizenLayout = ({ header, sidebar, children, footer }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 text-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40">{header}</div>
      {/* Main grid */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-4 lg:gap-6">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-[68px] h-max">{sidebar}</aside>

          {/* Main content */}
          <main className="bg-white/80 backdrop-blur-md border border-emerald-100 shadow-sm rounded-2xl p-4 sm:p-6 lg:p-7">
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6">{footer}</div>
    </div>
  );
};

export default CitizenLayout;
