
export const ProcessChart = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Processos por Status</h3>
        <div className="flex space-x-2">
          <button className="text-sm text-gray-500 hover:text-gray-700">Mensal</button>
          <button className="text-sm text-blue-600 font-medium">Anual</button>
        </div>
      </div>
      <div className="h-72 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded"></div>
          </div>
          <p className="text-gray-500">Gráfico de Processos</p>
          <p className="text-sm text-gray-400">Dados em tempo real</p>
        </div>
      </div>
    </div>
  );
};
