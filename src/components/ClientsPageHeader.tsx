
import React from 'react';
import { ChevronRight } from 'lucide-react';

export const ClientsPageHeader = () => {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <a href="/" className="hover:text-blue-600">Dashboard</a>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-gray-700 font-medium">Clientes</span>
      </div>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
      </div>
    </>
  );
};
