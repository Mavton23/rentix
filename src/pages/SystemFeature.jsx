import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import * as LucideIcons from 'lucide-react';
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import api from '../services/api';

export default function SystemFeatures() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await api.get('/system');
        // Verifica se o retorno não é um array vazio
        if (Array.isArray(response.data)) {
          setFeatures(response.data);
          if (response.data.length === 0) {
            setError('Nenhum recurso encontrado');
          }
        } else {
          setError('Formato de dados inválido');
        }
      } catch (error) {
        console.error('Error fetching features:', error);
        setError('Erro ao carregar recursos');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  // Componente de loading com Skeleton
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-[500px] mx-auto mb-4" />
          <Skeleton className="h-6 w-[600px] mx-auto" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="border-l-4 border-primary bg-gray-50 dark:bg-gray-900 rounded-lg p-6 h-full">
              <div className="flex items-center mb-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-3/4 ml-3" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
              
              <Skeleton className="h-5 w-1/2 mb-3" />
              
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-2 w-2 mr-2" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-4">
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Skeleton */}
        <div className="mt-12 bg-gray-50 dark:bg-gray-900 p-8 rounded-lg">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-4" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  // Tratamento de erros e array vazio
  if (error || features.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold dark:text-gray-300 mb-4">
            Todos os Recursos do Sistema
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Conheça todas as funcionalidades da nossa plataforma de gestão de propriedades
          </p>
        </div>

        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg dark:text-gray-300">
          <div className="mx-auto max-w-md">
            <h2 className="text-2xl font-semibold dark:text-gray-300 mb-4">
              {error || 'Nenhum recurso disponível'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error 
                ? 'Estamos enfrentando problemas para carregar os recursos. Por favor, tente novamente mais tarde.'
                : 'No momento não há recursos cadastrados no sistema.'}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Recarregar Página
            </Button>
          </div>
        </div>

        <div className="mt-12 bg-gray-50 dark:bg-gray-900 p-8 rounded-lg">
          <h2 className="text-xl font-bold dark:text-gray-300 mb-4">
            Sobre a Plataforma
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Nossa solução integrada oferece tudo o que você precisa para gerenciar propriedades de forma eficiente, desde o cadastro de imóveis até a cobrança automatizada, comunicação com inquilinos e análise de desempenho.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Tecnologias utilizadas:</strong> React, Node.js, Sequelize, PostgreSQL, Material-UI, AWS
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold dark:text-gray-300 mb-4">
          Todos os Recursos do Sistema
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Conheça todas as funcionalidades da nossa plataforma de gestão de propriedades
        </p>
      </div>

      {/* Grid de Recursos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const IconComponent = LucideIcons[feature.icon] || LucideIcons['Settings'];
          
          return (
            <div 
              key={feature.featureId} 
              className="border-l-4 border-primary bg-gray-50 dark:bg-gray-900 rounded-lg p-6 h-full transition-all hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <IconComponent className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-semibold ml-3 dark:text-gray-300">
                  {feature.title}
                </h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 min-h-[4em]">
                {feature.description}
              </p>
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
              
              <h3 className="text-sm font-medium dark:text-gray-300 mb-3">
                Principais funcionalidades:
              </h3>
              
              <ul className="space-y-2">
                {feature.details.map((detail, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-gray-600 dark:text-gray-400">{detail}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex justify-end mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                  Modelo: {feature.model}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-900 p-8 rounded-lg">
        <h2 className="text-xl font-bold dark:text-gray-300 mb-4">
          Sobre a Plataforma
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Nossa solução integrada oferece tudo o que você precisa para gerenciar propriedades de forma eficiente, desde o cadastro de imóveis até a cobrança automatizada, comunicação com inquilinos e análise de desempenho.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Desenvolvida com as melhores práticas de segurança e usabilidade, a plataforma se adapta às necessidades de pequenos e grandes gestores de propriedades.
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Tecnologias utilizadas:</strong> React, Node.js, Sequelize, PostgreSQL, Material-UI, AWS
        </p>
      </div>
    </div>
  );
}