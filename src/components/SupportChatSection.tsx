
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SupportChatSection = () => {
  const [isOnline] = useState(true);

  const handleStartChat = () => {
    alert('Iniciando chat com o suporte. Um especialista irá atendê-lo em instantes.');
  };

  const handleScheduleAppointment = () => {
    alert('Redirecionando para agendamento de atendimento personalizado.');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
          <i className="ri-customer-service-2-line text-green-600 mr-2"></i>
          Chat de Suporte
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Status do suporte */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isOnline ? 'Suporte técnico online' : 'Suporte técnico offline'}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Horário de atendimento: Segunda a Sexta, 8h às 18h
          </p>
        </div>

        {/* Atendente disponível */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b043?w=48&h=48&fit=crop&crop=face" 
                  alt="Ana Beatriz" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                {isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">Ana Beatriz</p>
                <p className="text-sm text-gray-600">Especialista em Suporte</p>
                <p className="text-xs text-gray-500">
                  {isOnline ? 'Disponível agora' : 'Retorna às 8h'}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleStartChat}
              disabled={!isOnline}
              className={`${isOnline ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'} text-white`}
            >
              <i className="ri-chat-1-line mr-2"></i>
              {isOnline ? 'Iniciar Chat' : 'Offline'}
            </Button>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <i className="ri-time-line text-blue-600 mr-2"></i>
              <span className="text-sm font-medium text-blue-800">Tempo médio de resposta</span>
            </div>
            <p className="text-sm text-blue-700">Até 2 minutos durante horário de funcionamento</p>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleScheduleAppointment}
              variant="outline"
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <i className="ri-calendar-schedule-line mr-2"></i>
              Agendar Atendimento
            </Button>
            <Button 
              variant="outline"
              className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50"
              onClick={() => alert('Redirecionando para contato via email.')}
            >
              <i className="ri-mail-line mr-2"></i>
              Contato por Email
            </Button>
          </div>
        </div>

        {/* Avaliação do atendimento */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Nosso suporte tem avaliação média de 4.8/5 ⭐
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportChatSection;
