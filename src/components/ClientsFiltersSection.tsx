
import React from 'react';
import { ClientsFilters } from './ClientsFilters';

interface ClientsFiltersSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onNewClientClick: () => void;
  onViewOldClientsClick: () => void;
}

export const ClientsFiltersSection = (props: ClientsFiltersSectionProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <ClientsFilters {...props} />
    </div>
  );
};
