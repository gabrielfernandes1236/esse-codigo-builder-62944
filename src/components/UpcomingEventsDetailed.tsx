
import { Calendar, MapPin, Clock, User } from "lucide-react";

export const UpcomingEventsDetailed = () => {
  const events = [
    {
      id: 1,
      titulo: "Audiência de Conciliação",
      tipo: "audiencia",
      data: "20/06/2024",
      hora: "09:30",
      local: "Fórum Central - Sala 305",
      cliente: "Ana Beatriz Mendes",
      processo: "0123456-78.2023.8.26.0100",
      status: "confirmado"
    },
    {
      id: 2,
      titulo: "Reunião com Cliente",
      tipo: "reuniao",
      data: "20/06/2024",
      hora: "14:00",
      local: "Escritório - Sala de Reuniões",
      cliente: "Carlos Roberto Silva",
      processo: "",
      status: "pendente"
    },
    {
      id: 3,
      titulo: "Audiência de Instrução",
      tipo: "audiencia",
      data: "22/06/2024",
      hora: "10:00",
      local: "Fórum Trabalhista - Sala 201",
      cliente: "Ana Beatriz Mendes",
      processo: "0123456-78.2023.8.26.0100",
      status: "confirmado"
    },
    {
      id: 4,
      titulo: "Prazo para Contestação",
      tipo: "prazo",
      data: "25/06/2024",
      hora: "17:00",
      local: "",
      cliente: "Carlos Roberto Silva",
      processo: "0654321-87.2023.8.26.0100",
      status: "pendente"
    }
  ];

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'audiencia': return 'bg-blue-100 text-blue-800';
      case 'reuniao': return 'bg-green-100 text-green-800';
      case 'prazo': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Todos os Compromissos
        </h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{event.titulo}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {event.data} às {event.hora}
                    </span>
                    {event.local && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.local}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(event.tipo)}`}>
                    {event.tipo}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {event.cliente}
                </span>
                {event.processo && (
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {event.processo}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
