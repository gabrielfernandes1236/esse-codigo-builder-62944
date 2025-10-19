
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  publishDate: string;
  thumbnail: string;
  isFeatured?: boolean;
}

const VideoTutorialsSection = () => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const videoTutorials: VideoTutorial[] = [
    {
      id: "1",
      title: "Primeiros Passos no CRM Jurídico - Tutorial Completo",
      description: "Aprenda a navegar pela interface, configurar sua conta e realizar as principais operações do sistema. Este tutorial abrangente é perfeito para novos usuários.",
      category: "Cadastro",
      duration: "15:32",
      publishDate: "20/06/2025",
      thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=225&fit=crop&crop=center",
      isFeatured: true
    },
    {
      id: "2",
      title: "Como Cadastrar Clientes e Processos",
      description: "Passo a passo para adicionar novos clientes ao sistema e vincular processos jurídicos.",
      category: "Cadastro",
      duration: "8:45",
      publishDate: "18/06/2025",
      thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=225&fit=crop&crop=center"
    },
    {
      id: "3",
      title: "Gerenciando sua Agenda Jurídica",
      description: "Aprenda a organizar compromissos, audiências e prazos de forma eficiente.",
      category: "Agenda",
      duration: "12:20",
      publishDate: "15/06/2025",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop&crop=center"
    },
    {
      id: "4",
      title: "Integrações: WhatsApp e Gmail",
      description: "Configure e use as integrações com WhatsApp Business e Gmail para automatizar sua comunicação.",
      category: "Integrações",
      duration: "10:15",
      publishDate: "12/06/2025",
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop&crop=center"
    },
    {
      id: "5",
      title: "Relatórios Financeiros Avançados",
      description: "Gere relatórios detalhados de faturamento, despesas e análise financeira do escritório.",
      category: "Relatórios",
      duration: "14:30",
      publishDate: "10/06/2025",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop&crop=center"
    }
  ];

  const featuredVideo = videoTutorials.find(video => video.isFeatured);
  const otherVideos = videoTutorials.filter(video => !video.isFeatured);

  const handlePlayVideo = (videoId: string) => {
    setPlayingVideo(videoId);
    // Simular abertura do YouTube
    setTimeout(() => {
      alert(`Redirecionando para o YouTube para assistir ao tutorial...`);
      setPlayingVideo(null);
    }, 1000);
  };

  const VideoCard = ({ video, isLarge = false }: { video: VideoTutorial; isLarge?: boolean }) => (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group">
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className={`w-full object-cover ${isLarge ? 'h-64' : 'h-48'}`}
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200"></div>
        
        {/* Play Button */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Button
            onClick={() => handlePlayVideo(video.id)}
            className="w-16 h-16 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 text-blue-600 hover:text-blue-700 transition-all duration-200 group-hover:scale-110"
            disabled={playingVideo === video.id}
          >
            {playingVideo === video.id ? (
              <i className="ri-loader-2-line text-2xl animate-spin"></i>
            ) : (
              <i className="ri-play-fill text-2xl ml-1"></i>
            )}
          </Button>
        </div>
        
        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
            {video.category}
          </span>
          <h3 className={`font-medium text-gray-800 ${isLarge ? 'text-lg' : 'text-base'} line-clamp-2`}>
            {video.title}
          </h3>
          {isLarge && (
            <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <span>Publicado em {video.publishDate}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePlayVideo(video.id)}
              className="h-7 px-3 text-xs"
            >
              <i className="ri-youtube-line mr-1"></i>
              Assistir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
          <i className="ri-video-line text-red-600 mr-2"></i>
          Tutoriais em Vídeo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Vídeo em Destaque */}
        {featuredVideo && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <i className="ri-star-fill text-yellow-500 mr-2"></i>
              Vídeo em Destaque
            </h3>
            <VideoCard video={featuredVideo} isLarge={true} />
          </div>
        )}

        {/* Grid de Outros Vídeos */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Todos os Tutoriais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-center">
            <i className="ri-youtube-line text-4xl text-blue-600 mb-3"></i>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Quer mais conteúdo?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Visite nosso canal no YouTube para acessar a biblioteca completa de tutoriais e novidades.
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <i className="ri-external-link-line mr-2"></i>
              Visitar Canal YouTube
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoTutorialsSection;
