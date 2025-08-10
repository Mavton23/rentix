import { useState, useEffect } from 'react';
import { Building, Users, Globe, BarChart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import api from '../services/api';

export default function About() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get('/about/content');
        // Verifica se o retorno não é vazio/nulo
        if (response.data && Object.keys(response.data).length > 0) {
          setContent(response.data);
        } else {
          setError('Conteúdo não disponível no momento');
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
        setError('Erro ao carregar conteúdo');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-6 w-full">
        <div className="max-w-6xl w-full mx-auto py-12">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-[300px] mx-auto mb-6" />
            <Skeleton className="h-7 w-[500px] mx-auto" />
          </div>

          {/* História Skeleton */}
          <div className="flex flex-col md:flex-row gap-12 mb-20">
            <div className="md:w-1/2 space-y-4">
              <Skeleton className="h-10 w-[200px] mb-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-[200px] mt-6" />
            </div>
            <div className="md:w-1/2">
              <Skeleton className="aspect-video w-full rounded-xl" />
            </div>
          </div>

          {/* Valores Skeleton */}
          <div className="mb-20">
            <Skeleton className="h-10 w-[250px] mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-6 w-[150px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Skeleton */}
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // Tratamento de erros e conteúdo vazio
  if (error || !content) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 w-full">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {error || 'Conteúdo não disponível'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Estamos enfrentando problemas para carregar esta página. Por favor, tente novamente mais tarde.
          </p>
          <Button onClick={() => window.location.reload()}>
            Recarregar Página
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-6 w-full">
      <div className="max-w-6xl w-full mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-300 mb-6">
            {content.title || 'Sobre a'} <span className="text-indigo-600">Mavtech</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {content.subtitle || 'Transformando a gestão imobiliária através de tecnologia inovadora e soluções inteligentes.'}
          </p>
        </div>

        {/* Nossa História */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-6">
                {content.historyTitle || 'Nossa História'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {content.historyText1 || 'Fundada em 2015, a Mavtech surgiu da necessidade de modernizar a administração imobiliária.'}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {content.historyText2 || 'Hoje, somos referência em soluções tecnológicas para o mercado imobiliário, atendendo clientes em todo o Brasil.'}
              </p>
              <Link to="/team">
                <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                  Conheça nosso time <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="aspect-video bg-indigo-50 rounded-lg flex items-center justify-center">
                <Globe className="h-16 w-16 text-indigo-600" />
              </div>
            </div>
          </div>
        </section>

        {/* Nossos Valores */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-300 mb-12">
            {content.valuesTitle || 'Nossos Valores'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(content.values || [
              { icon: 'users', title: 'Foco no Cliente', description: 'Colocamos as necessidades dos nossos clientes no centro de tudo.' },
              { icon: 'chart', title: 'Inovação Constante', description: 'Buscamos sempre melhorar e trazer novas soluções.' },
              { icon: 'building', title: 'Expertise Imobiliária', description: 'Nossa equipe possui profundo conhecimento do setor.' }
            ]).map((value, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    {value.icon === 'users' && <Users className="h-8 w-8 text-indigo-600" />}
                    {value.icon === 'chart' && <BarChart className="h-8 w-8 text-indigo-600" />}
                    {value.icon === 'building' && <Building className="h-8 w-8 text-indigo-600" />}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-300">
                    {value.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            {content.ctaTitle || 'Pronto para transformar sua gestão imobiliária?'}
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            {content.ctaText || 'Junte-se a profissionais e empresas que já confiam na Mavtech para simplificar seus processos.'}
          </p>
          <Link to="/register">
            <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg">
              {content.ctaButtonText || 'Comece agora gratuitamente'}
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}