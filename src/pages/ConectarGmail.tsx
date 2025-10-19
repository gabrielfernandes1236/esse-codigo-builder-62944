
import { Sidebar } from "@/components/Sidebar";
import { Shield, Clock, Lock, Settings, FileText, Search, Bell, ChevronDown, ArrowRight, Mail, CheckCircle, AlertCircle, Activity, LogOut, Edit, Eye, Calendar, Building, Target, Zap, TrendingUp, Bug, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGmailIntegration } from "@/hooks/useGmailIntegration";
import { useOfficeConfiguration } from "@/hooks/useOfficeConfiguration";
import { GoogleCredentialsModal } from "@/components/GoogleCredentialsModal";
import { OfficeConfigurationModal } from "@/components/OfficeConfigurationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export const ConectarGmail = () => {
  const { 
    connection, 
    isMonitoring, 
    connectGmail, 
    disconnectGmail,
    changeCredentials,
    hasCredentials,
    showCredentialsModal,
    setShowCredentialsModal,
    saveCredentials,
    monitoredEmails,
    emailStats,
    processAllRecentEmails,
    debugMode,
  } = useGmailIntegration();

  const { configuration, isConfigured } = useOfficeConfiguration();

  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [showOfficeConfigModal, setShowOfficeConfigModal] = useState(false);

  const handleConnect = () => {
    if (!hasCredentials()) {
      setShowCredentialsModal(true);
      return;
    }
    if (!isConfigured) {
      setShowOfficeConfigModal(true);
      return;
    }
    connectGmail();
  };

  // Função para obter cor da badge de prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              className="bg-gray-100 text-sm rounded-md pl-10 pr-4 py-2 w-full border-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
              placeholder="Pesquisar..."
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="relative p-1">
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</div>
                <Bell className="text-gray-500 w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="ml-2 flex items-center">
                <span className="text-sm font-medium">Dr. Ricardo Oliveira</span>
                <ChevronDown className="ml-1 text-gray-500 w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-blue-600">Dashboard</a>
            <ArrowRight className="mx-2 w-4 h-4" />
            <span className="text-gray-700">Integração Gmail</span>
          </div>
          
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Integração Gmail Avançada</h1>
            <p className="text-gray-600 mt-2">
              Configure e monitore emails em tempo real com automação inteligente para escritórios de advocacia
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="text-lg font-bold">
                      {connection.isConnected ? 'Conectado' : 'Desconectado'}
                    </p>
                  </div>
                  {connection.isConnected ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Emails Processados</p>
                    <p className="text-lg font-bold">{emailStats.totalProcessed}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Atualizações</p>
                    <p className="text-lg font-bold">{emailStats.processUpdates}</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Intervalo</p>
                    <p className="text-lg font-bold">{configuration.monitoringInterval}s</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuração Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status da Conexão */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Status da Conexão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {connection.isConnected ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        )}
                        <span className="font-medium">
                          {connection.isConnected ? 'Conectado' : 'Desconectado'}
                        </span>
                      </div>
                      <Badge variant={connection.isConnected ? 'default' : 'secondary'}>
                        {connection.isConnected ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>

                    {connection.isConnected ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm font-medium">Email conectado:</span>
                            <span className="text-sm ml-2">{connection.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm font-medium">Conectado em:</span>
                            <span className="text-sm ml-2">{connection.connectedAt}</span>
                          </div>
                          {isConfigured && (
                            <>
                              <div className="flex items-center">
                                <Building className="w-4 h-4 text-green-600 mr-2" />
                                <span className="text-sm font-medium">Escritório:</span>
                                <span className="text-sm ml-2">{configuration.firmName}</span>
                              </div>
                              <div className="flex items-center">
                                <Target className="w-4 h-4 text-green-600 mr-2" />
                                <span className="text-sm font-medium">Remetentes monitorados:</span>
                                <Badge variant="outline" className="ml-2">
                                  {configuration.monitoredSenders.length} emails
                                </Badge>
                              </div>
                            </>
                          )}
                          <div className="flex items-center">
                            <Activity className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm font-medium">Monitoramento:</span>
                            <Badge variant="outline" className="ml-2">
                              <div className={`w-2 h-2 rounded-full mr-1 ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                              {isMonitoring ? `Ativo (${configuration.monitoringInterval}s)` : 'Pausado'}
                            </Badge>
                          </div>
                          {emailStats.lastSync && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 text-green-600 mr-2" />
                              <span className="text-sm font-medium">Última verificação:</span>
                              <span className="text-sm ml-2">{emailStats.lastSync}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                            <span className="text-sm font-medium text-yellow-800">
                              {!hasCredentials() ? 'Configure as credenciais OAuth2' : 
                               !isConfigured ? 'Configure as informações do escritório' : 
                               'Pronto para conectar'}
                            </span>
                          </div>
                          <p className="text-sm text-yellow-700">
                            {!hasCredentials() 
                              ? 'Configure o Client ID e Client Secret do Google OAuth2 antes de conectar.'
                              : !isConfigured
                              ? 'Configure o nome do escritório e emails para monitoramento.'
                              : 'Todas as configurações estão prontas. Clique em conectar para iniciar.'
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => setShowOfficeConfigModal(true)}
                          variant="outline"
                          className="text-purple-600 border-purple-600 hover:bg-purple-50"
                        >
                          <Building className="w-4 h-4 mr-2" />
                          {isConfigured ? 'Alterar Configuração' : 'Configurar Escritório'}
                        </Button>
                        
                        <Button 
                          onClick={hasCredentials() ? changeCredentials : () => setShowCredentialsModal(true)}
                          variant="outline"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {hasCredentials() ? 'Alterar Credenciais' : 'Configurar Credenciais'}
                        </Button>

                        {connection.isConnected && (
                          <Button 
                            onClick={processAllRecentEmails}
                            variant="outline"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            disabled={debugMode}
                          >
                            {debugMode ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                                Analisando...
                              </div>
                            ) : (
                              <>
                                <Bug className="w-4 h-4 mr-2" />
                                Debug Emails
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      
                      <div>
                        {!connection.isConnected ? (
                          <Button 
                            onClick={handleConnect} 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 text-base shadow-lg"
                            disabled={!hasCredentials() || !isConfigured}
                            size="lg"
                          >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Conectar Gmail
                          </Button>
                        ) : (
                          <Button 
                            onClick={disconnectGmail} 
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Desconectar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emails Monitorados */}
              {connection.isConnected && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        Emails Monitorados
                        <Badge variant="outline" className="ml-2">
                          {monitoredEmails?.length || 0} emails
                        </Badge>
                      </div>
                      {isMonitoring && (
                        <Badge variant="outline">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                          Tempo Real
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {monitoredEmails && monitoredEmails.length > 0 ? (
                      <div className="space-y-4">
                        {monitoredEmails.map((email, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-sm">{email.subject}</span>
                                <Badge className={getPriorityColor(email.priority)}>
                                  {email.priority === 'high' ? 'Alta' : email.priority === 'medium' ? 'Média' : 'Baixa'}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={email.status?.includes('Processado') ? 'default' : 'secondary'} className="text-xs">
                                  {email.status || 'Novo'}
                                </Badge>
                                {email.debugInfo && (
                                  <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-800">
                                    <Bug className="w-3 h-3 mr-1" />
                                    Debug
                                  </Badge>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedEmail(email)}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Ver
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                              <span className="mr-4">De: {email.from}</span>
                              <span>Recebido: {email.receivedAt}</span>
                            </div>
                            <div className="bg-gray-50 border rounded p-3">
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {email.snippet || email.content}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {email.processNumbers && email.processNumbers.length > 0 && (
                                  <>
                                    {email.processNumbers.map((processNumber, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {processNumber}
                                      </Badge>
                                    ))}
                                  </>
                                )}
                                {email.matched_keywords && email.matched_keywords.length > 0 && (
                                  <>
                                    {email.matched_keywords.map((keyword, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {keyword}
                                      </Badge>
                                    ))}
                                  </>
                                )}
                              </div>
                              {email.debugInfo && (
                                <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
                                  <div className="font-medium text-orange-800 mb-1">Informações de Debug:</div>
                                  <div className="space-y-1 text-orange-700">
                                    <div>Processos encontrados: {email.debugInfo.foundProcessNumbers.length}</div>
                                    <div>Status detectado: {email.debugInfo.statusDetected}</div>
                                    <div>Processo correspondente: {email.debugInfo.processMatched ? 'Sim' : 'Não'}</div>
                                    <div>Status alterado: {email.debugInfo.statusChanged ? 'Sim' : 'Não'}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="flex items-center justify-center mb-4">
                          <Mail className="w-12 h-12 text-gray-400 mr-2" />
                          {isMonitoring && (
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm mb-2">
                          {isMonitoring 
                            ? 'Monitoramento ativo! Aguardando novos emails...' 
                            : 'Nenhum email monitorado ainda.'
                          }
                        </p>
                        <p className="text-gray-400 text-xs">
                          O sistema verifica emails a cada {configuration.monitoringInterval} segundos automaticamente
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Informações Laterais */}
            <div className="space-y-6">
              {/* Configuração Atual */}
              {isConfigured && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      Configuração Atual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Escritório</Label>
                      <p className="text-sm text-gray-700">{configuration.firmName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email Principal</Label>
                      <p className="text-sm text-gray-700">{configuration.workEmail}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Remetentes</Label>
                      <p className="text-sm text-gray-700">{configuration.monitoredSenders.length} configurados</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Palavras-chave</Label>
                      <p className="text-sm text-gray-700">{configuration.keywordsToMonitor.length} configuradas</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Intervalo</Label>
                      <p className="text-sm text-gray-700">{configuration.monitoringInterval} segundos</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Como Funciona */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Como Funciona</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Segurança</p>
                      <p className="text-sm text-gray-600">Autenticação OAuth2 segura com Google</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tempo Real</p>
                      <p className="text-sm text-gray-600">Verificação automática conforme configurado</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Inteligente</p>
                      <p className="text-sm text-gray-600">Filtragem por remetente e palavras-chave</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Automação</p>
                      <p className="text-sm text-gray-600">Atualização automática de processos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* OAuth URL */}
              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-lg text-red-800">Configuração OAuth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-red-700">
                      <strong>URL de Redirecionamento:</strong>
                    </p>
                    <div className="bg-white border border-red-300 rounded px-2 py-1">
                      <code className="text-xs text-red-800">
                        {window.location.origin}/auth/gmail/callback
                      </code>
                    </div>
                    <p className="text-xs text-red-600">
                      Configure esta URL exata no Google Cloud Console
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Detalhes do Email */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Detalhes do Email</h3>
                <Button variant="outline" onClick={() => setSelectedEmail(null)}>
                  Fechar
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Assunto</Label>
                    <p className="text-sm text-gray-700">{selectedEmail.subject}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Remetente</Label>
                    <p className="text-sm text-gray-700">{selectedEmail.from}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Data de Recebimento</Label>
                    <p className="text-sm text-gray-700">{selectedEmail.receivedAt}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Prioridade</Label>
                    <Badge className={getPriorityColor(selectedEmail.priority)}>
                      {selectedEmail.priority === 'high' ? 'Alta' : selectedEmail.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge variant={selectedEmail.status?.includes('Processado') ? 'default' : 'secondary'}>
                      {selectedEmail.status || 'Novo'}
                    </Badge>
                  </div>
                </div>

                {selectedEmail.processNumbers && selectedEmail.processNumbers.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Processos Identificados</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedEmail.processNumbers.map((processNumber, idx) => (
                        <Badge key={idx} variant="outline">
                          {processNumber}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEmail.matched_keywords && selectedEmail.matched_keywords.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Palavras-chave Encontradas</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedEmail.matched_keywords.map((keyword, idx) => (
                        <Badge key={idx} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEmail.debugInfo && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <Label className="text-sm font-medium text-orange-800">Informações de Debug</Label>
                    <div className="mt-2 space-y-2 text-sm text-orange-700">
                      <div>
                        <strong>Processos encontrados:</strong> {selectedEmail.debugInfo.foundProcessNumbers.join(', ') || 'Nenhum'}
                      </div>
                      <div>
                        <strong>Palavras-chave correspondentes:</strong> {selectedEmail.debugInfo.matchedKeywords.join(', ') || 'Nenhuma'}
                      </div>
                      <div>
                        <strong>Status detectado:</strong> {selectedEmail.debugInfo.statusDetected}
                      </div>
                      <div>
                        <strong>Processo correspondente encontrado:</strong> {selectedEmail.debugInfo.processMatched ? 'Sim' : 'Não'}
                      </div>
                      <div>
                        <strong>Status foi alterado:</strong> {selectedEmail.debugInfo.statusChanged ? 'Sim' : 'Não'}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Conteúdo do Email</Label>
                  <div className="bg-gray-50 border rounded-lg p-4 mt-2">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                      {selectedEmail.content}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Credenciais */}
      <GoogleCredentialsModal
        isOpen={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
        onSave={saveCredentials}
      />

      {/* Modal de Configuração do Escritório */}
      <OfficeConfigurationModal
        isOpen={showOfficeConfigModal}
        onClose={() => setShowOfficeConfigModal(false)}
      />
    </div>
  );
};
