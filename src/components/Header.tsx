
import { Search, Bell, ChevronDown, Menu } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center md:hidden">
          <button className="text-gray-500 focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-3 text-xl text-blue-600 font-bold">CRM Jurídico</h1>
        </div>
        
        <div className="relative w-64 hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-100 border-none text-sm rounded-lg pl-10 p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Pesquisar..."
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="relative">
            <button className="flex items-center space-x-2 focus:outline-none">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                alt="Foto de perfil"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">
                Dr. Ricardo Oliveira
              </span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
