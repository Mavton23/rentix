import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/ui/skeleton";
import api from '../services/api';

export default function Status() {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/status');
        // Verifica se o retorno tem a estrutura esperada
        if (response.data && typeof response.data === 'object') {
          setStatusData(response.data);
        } else {
          setError('Formato de dados inválido');
        }
      } catch (error) {
        console.error('Error fetching status:', error);
        setError('Erro ao carregar status do sistema');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const statusMap = {
    operational: { text: "Operacional", color: "bg-green-500", icon: CheckCircle },
    degraded: { text: "Degradado", color: "bg-yellow-500", icon: AlertCircle },
    outage: { text: "Indisponível", color: "bg-red-500", icon: AlertCircle }
  };

  const impactMap = {
    critical: { text: "Crítico", color: "bg-red-500" },
    major: { text: "Grande", color: "bg-orange-500" },
    minor: { text: "Pequeno", color: "bg-yellow-500" },
    none: { text: "Nenhum", color: "bg-gray-500" }
  };

  // Componente de loading com Skeletons
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-6 w-full">
        <div className="max-w-4xl w-full mx-auto py-12">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-[300px] mx-auto mb-6" />
            <Skeleton className="h-6 w-[400px] mx-auto" />
          </div>

          {/* Status Geral Skeleton */}
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-600/25 mb-8">
            <div className="flex justify-between mb-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-7 w-[120px]" />
              </div>
              <Skeleton className="h-5 w-[200px]" />
            </div>
            <div className="py-8 text-center">
              <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
              <Skeleton className="h-7 w-[200px] mx-auto mb-2" />
              <Skeleton className="h-5 w-[300px] mx-auto" />
            </div>
          </div>

          {/* Componentes Skeleton */}
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-600/25 mb-8">
            <Skeleton className="h-8 w-[200px] mb-6" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600/15 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-[150px]" />
                  </div>
                  <Skeleton className="h-6 w-[80px] rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Incidentes Skeleton */}
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-600/25">
            <Skeleton className="h-8 w-[200px] mb-6" />
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-600/15 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-5 w-[200px]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-5 w-[120px]" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div>
                        <Skeleton className="h-5 w-[60px] mb-1" />
                        <Skeleton className="h-5 w-[80px]" />
                      </div>
                      <div>
                        <Skeleton className="h-5 w-[100px] mb-1" />
                        <Skeleton className="h-5 w-[150px]" />
                      </div>
                      <div>
                        <Skeleton className="h-5 w-[40px] mb-1" />
                        <Skeleton className="h-5 w-[120px]" />
                      </div>
                    </div>
                    <div className="p-4 rounded-lg">
                      <Skeleton className="h-5 w-[140px] mb-2" />
                      <Skeleton className="h-5 w-[120px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tratamento de erros e dados inválidos
  if (error || !statusData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 w-full">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {error || 'Status não disponível'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Estamos enfrentando problemas para carregar o status do sistema. Por favor, tente novamente mais tarde.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = statusMap[statusData.systemStatus] || statusMap.operational;
  const { components = [], incidents = [], lastUpdated = new Date().toISOString(), message } = statusData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-6 w-full">
      <div className="max-w-4xl w-full mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-300 mb-6">
            Status do <span className="text-indigo-600">Sistema</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Verifique o status atual de todos os serviços RentSystem.
          </p>
        </div>

        {/* Status Geral */}
        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600/25 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className={`h-4 w-4 rounded-full ${statusInfo.color}`}></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300">Status Geral</h2>
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              Última atualização: {new Date(lastUpdated).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <statusInfo.icon className={`h-16 w-16 mx-auto mb-4 ${statusInfo.color.replace('bg-', 'text-')}`} />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-2">{statusInfo.text}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {message || (
                  statusData.systemStatus === "operational" 
                    ? "Todos os sistemas estão operando normalmente." 
                    : statusData.systemStatus === "degraded" 
                      ? "Estamos enfrentando problemas parciais em alguns serviços." 
                      : "Estamos enfrentando uma interrupção significativa nos serviços."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Componentes */}
        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600/25 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-6">Componentes do Sistema</h2>
          
          {components.length > 0 ? (
            <div className="space-y-4">
              {components.map((component, index) => {
                const status = statusMap[component.status] || statusMap.operational;
                return (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600/15 rounded-lg">
                    <div className="flex items-center gap-4">
                      <status.icon className={`h-5 w-5 ${status.color.replace('bg-', 'text-')}`} />
                      <span className="font-medium text-gray-900 dark:text-gray-300">{component.name || 'Componente desconhecido'}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color === 'bg-green-500' ? 'bg-green-100 text-green-800' : status.color === 'bg-yellow-500' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {status.text}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-2">Nenhum componente monitorado</h3>
              <p className="text-gray-600 dark:text-gray-400">Não há componentes sendo monitorados no momento.</p>
            </div>
          )}
        </div>

        {/* Incidentes */}
        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600/25">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-6">Incidentes Recentes</h2>
          
          {incidents.length > 0 ? (
            <div className="space-y-6">
              {incidents.map((incident) => {
                const impact = impactMap[incident.impact] || impactMap.none;
                const StatusIcon = 
                  incident.status === "investigating" ? HelpCircle :
                  incident.status === "identified" ? AlertCircle :
                  incident.status === "monitoring" ? Clock :
                  CheckCircle;

                return (
                  <div key={incident.id} className="border border-gray-200 dark:border-gray-600/15 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className={`h-3 w-3 rounded-full ${impact.color}`}></div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-300">{incident.title || 'Incidente sem título'}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <StatusIcon className="h-4 w-4" />
                        <span>
                          {incident.status === "investigating" ? "Investigando" :
                           incident.status === "identified" ? "Problema identificado" :
                           incident.status === "monitoring" ? "Monitorando" : "Resolvido"}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Impacto</h4>
                          <p className="font-medium dark:text-gray-400">{impact.text}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Componentes</h4>
                          <p className="dark:text-gray-400">
                            {incident.components?.join(", ") || 'Nenhum componente especificado'}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Início</h4>
                          <p className="dark:text-gray-400">
                            {incident.startedAt ? new Date(incident.startedAt).toLocaleString() : 'Data desconhecida'}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Última atualização</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {incident.updatedAt ? new Date(incident.updatedAt).toLocaleString() : 'Data desconhecida'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-2">Nenhum incidente recente</h3>
              <p className="text-gray-600 dark:text-gray-400">Todos os sistemas estão operando normalmente.</p>
            </div>
          )}
        </div>

        {/* Ajuda */}
        <div className="mt-8 text-center">
          <Link to="/contact" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
            Precisa de ajuda? Entre em contato com nosso suporte
          </Link>
        </div>
      </div>
    </div>
  );
}