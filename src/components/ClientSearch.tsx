
import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, User } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useClientsData } from '@/hooks/useClientsData';
import { cn } from '@/lib/utils';

interface ClientSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const ClientSearch = ({ value, onChange, placeholder = "Selecione um cliente", required = false }: ClientSearchProps) => {
  const [open, setOpen] = useState(false);
  const { clients } = useClientsData();

  // Filtrar apenas clientes ativos e ordenar alfabeticamente
  const activeClients = useMemo(() => {
    return clients
      .filter(client => client.status === 'Ativo' && !client.hidden)
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
  }, [clients]);

  const selectedClient = activeClients.find(client => client.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal"
        >
          {selectedClient ? (
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full bg-${selectedClient.color}-100 text-${selectedClient.color}-600 flex items-center justify-center text-xs font-medium mr-2`}>
                {selectedClient.initials}
              </div>
              <span>{selectedClient.name}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({selectedClient.type})
              </span>
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Pesquisar cliente..." className="h-9" />
          <CommandList>
            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
            <CommandGroup>
              {activeClients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={client.name}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center flex-1">
                    <div className={`w-6 h-6 rounded-full bg-${client.color}-100 text-${client.color}-600 flex items-center justify-center text-xs font-medium mr-3`}>
                      {client.initials}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-gray-500">
                        {client.type} • {client.location}
                      </div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === client.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
