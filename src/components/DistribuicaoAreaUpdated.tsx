
import { useProcessosByArea } from "@/hooks/useDashboardData";

export const DistribuicaoAreaUpdated = () => {
  const { data: areaData, isLoading } = useProcessosByArea();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Distribuição por Área</h3>
        <div className="space-y-3 animate-pulse">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 w-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-purple-500', 'bg-red-500'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Distribuição por Área</h3>
      <div className="space-y-3">
        {areaData?.map((area, index) => (
          <div key={area.area} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-2`}></div>
              <span className="text-sm text-gray-600">{area.area}</span>
            </div>
            <span className="text-sm font-medium">{area.percentual}%</span>
          </div>
        ))}
        
        {(!areaData || areaData.length === 0) && (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">Nenhum processo cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
};
