import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'sonner';
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { 
  HomeIcon, 
  Building, 
  Users, 
  CreditCard, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  FileText, 
  Shield, 
  Star,
  Eye,
  ShieldCheck,
  X,
  Wallet,
  MessageSquare,
  MessageSquarePlus,
  ChevronDown
} from "lucide-react";
import TestimonialCard from '../components/testimonial/TestimonialCard';
import { TestimonialForm } from '../components/testimonial/TestimonialForm';
import { ThemeToggle } from '../components/ThemeToggle';
import { RentixLoader } from '../components/RentixLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const screenshots = [
    {
      src: "/images/screenshots/platform-1.png",
      tooltip: "Dashboard completo com métricas em tempo real"
    },
    {
      src: "/images/screenshots/platform-2.png",
      tooltip: "Gestão eficiente de inquilinos"
    },
    {
      src: "/images/screenshots/platform-3.png",
      tooltip: "Gestão detalhada de propriedades"
    },
    {
      src: "/images/screenshots/platform-4.png",
      tooltip: "Controle financeiro automatizado"
    },
    {
      src: "/images/screenshots/platform-5.png",
      tooltip: "Blog com dicas úteis de gestão e uso da plataforma"
    }
  ];

  // Animação para elementos quando entram na viewport
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Efeito para rotacionar automaticamente os screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreenshotIndex((prev) => (prev + 1) % screenshots.length);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [screenshots.length]);

  useEffect(() => {
    const fetchTestimonies = async () => {
      setLoading(true);
      try {
        const response = await api.get("/testimony/testimonials");
        setTestimonials(response.data);
      } catch (error) {
        toast.error("Erro ao carregar os testemunhos.");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonies();
  }, []);

  if (loading) return <RentixLoader />;

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6 w-full overflow-x-hidden">
      {/* Container principal com largura máxima */}
      <div className="max-w-7xl w-full mx-auto">
        {/* Header com logo e navegação */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-16 sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-4 px-6 rounded-full shadow-sm"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <Building className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Rentix
            </span>
          </motion.div>
          
          <div className="flex items-center gap-6">
            
            <ThemeToggle />
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section 
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col items-center text-center gap-12 mb-32 relative py-16"
        >
          {/* Partículas de fundo decorativas */}
          <div className="absolute -z-10 inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-indigo-400/20 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-4 h-4 rounded-full bg-purple-400/20 animate-pulse delay-100"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-blue-400/20 animate-pulse delay-200"></div>
            <div className="absolute top-2/3 right-1/4 w-3 h-3 rounded-full bg-indigo-400/20 animate-pulse delay-300"></div>
          </div>

          <motion.div 
            variants={itemVariants}
            className="w-full max-w-4xl space-y-8 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Gestão imobiliária <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">simplificada</span>
              </h1>
            </motion.div>

            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Controle completo de propriedades, inquilinos e pagamentos em uma plataforma intuitiva 
              projetada para otimizar sua administração imobiliária.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto"
              >
                <Link to="/register">
                  <Button className="w-full py-6 px-8 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/20">
                    Comece agora <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto"
              >
                <Link to="/login">
                  <Button variant="outline" className="w-full py-6 px-8 text-lg border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-50/10 dark:text-indigo-400 dark:border-indigo-400">
                    Acessar conta
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex flex-wrap justify-center gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {/* Cards de benefícios */}
              {[
                {
                  icon: <HomeIcon className="h-6 w-6 text-indigo-500" />,
                  text: "+500 imóveis gerenciados mensalmente"
                },
                {
                  icon: <Wallet className="h-6 w-6 text-purple-500" />,
                  text: "Controle financeiro automatizado"
                },
                {
                  icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
                  text: "Segurança de dados garantida"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30">
                    {item.icon}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Elemento decorativo animado */}
            <motion.div
              className="mt-16 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="absolute -left-20 -top-20 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl animate-pulse"></div>
              <div className="absolute -right-20 -bottom-20 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl animate-pulse delay-300"></div>
              
              <div className="relative group">
                {/* Container principal com gradiente e sombra */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-1 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 inline-block overflow-hidden">
                  {/* Efeito de pulsação sutil */}
                  <motion.div
                    className="w-full h-full rounded-xl overflow-hidden"
                    animate={{
                      boxShadow: [
                        "0 0 0 0px rgba(99, 102, 241, 0.1)",
                        "0 0 0 10px rgba(99, 102, 241, 0.1)",
                        "0 0 0 0px rgba(99, 102, 241, 0.1)"
                      ]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Carrossel de screenshots - Versão Corrigida */}
                    <div className="relative w-full max-w-2xl h-[500px] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentScreenshotIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="relative inset-0 w-full h-full"
                        >
                          <img
                            src={screenshots[currentScreenshotIndex].src}
                            alt={`Preview da plataforma - Tela ${currentScreenshotIndex + 1}`}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = "/images/fallback-screenshot.png";
                              console.error(`Erro ao carregar: ${screenshots[currentScreenshotIndex].src}`);
                            }}
                          />
                          
                          {/* Tooltip flutuante */}
                          <motion.div
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-2 rounded-md text-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ 
                              opacity: 1,
                              y: 0
                            }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ 
                              duration: 0.5,
                              delay: 0.3
                            }}
                          >
                            {screenshots[currentScreenshotIndex].tooltip}
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                      
                      {/* Overlay interativo */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/30 via-transparent to-transparent">
                        <motion.div
                          className="p-4 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg backdrop-blur-sm border border-white/20"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link to="/features" className="flex items-center gap-2">
                            <Eye className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            <span className="hidden sm:inline text-indigo-600 dark:text-indigo-400 font-medium">Ver detalhes</span>
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Indicadores de progresso */}
                <div className="flex justify-center mt-4 gap-2">
                  {screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentScreenshotIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentScreenshotIndex 
                          ? 'bg-indigo-600 scale-125' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={`Mostrar screenshot ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Mockup de dispositivo */}
                <div className="absolute -top-8 -right-8 -z-10">
                  <svg
                    width="180"
                    height="180"
                    viewBox="0 0 180 180"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-indigo-400/20 dark:text-indigo-600/20"
                  >
                    <path
                      d="M120 30H60C47.2974 30 37 40.2975 37 53V127C37 139.703 47.2975 150 60 150H120C132.703 150 143 139.703 143 127V53C143 40.2974 132.703 30 120 30Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M90 165H90.01"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          ref={featuresRef}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-32"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
              Recursos <span className="text-indigo-600 dark:text-indigo-400">poderosos</span>
            </h2>
            <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
              Tudo o que você precisa para gerenciar seus imóveis com eficiência e estilo
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Building className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
                title: "Gestão de Imóveis",
                description: "Controle completo de todas as suas propriedades em um só lugar",
                link: "/features#properties"
              },
              {
                icon: <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
                title: "Controle de Inquilinos",
                description: "Organize informações e documentos dos inquilinos de forma segura",
                link: "/features#tenants"
              },
              {
                icon: <CreditCard className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
                title: "Pagamentos Automatizados",
                description: "Acompanhe recebimentos e envie lembretes automaticamente",
                link: "/features#payments"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link to={feature.link}>
                  <div className="h-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group-hover:border-indigo-300 dark:group-hover:border-indigo-500">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    <div className="mt-6 flex items-center text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Saiba mais</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section 
          ref={testimonialsRef}
          initial="hidden"
          animate={testimonialsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-32 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                O que nossos <span className="text-indigo-600 dark:text-indigo-400">clientes</span> dizem
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Veja o que nossos clientes estão dizendo sobre a plataforma
              </p>
            </div>
            
            <div className="flex gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 dark:text-gray-200"
                >
                  {showForm ? (
                    <>
                      <X className="h-4 w-4" />
                      Cancelar
                    </>
                  ) : (
                    <>
                      <MessageSquarePlus className="h-4 w-4" />
                      Deixar Depoimento
                    </>
                  )}
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" className="flex items-center gap-2 dark:text-gray-200">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  Ver Todos
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Formulário Condicional */}
          <AnimatePresence>
            {showForm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 overflow-hidden"
              >
                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                  <TestimonialForm onSuccess={() => setShowForm(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Listagem de Depoimentos */}
          <motion.div variants={itemVariants}>
            {testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.slice(0, 4).map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
              >
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-300">Nenhum depoimento ainda</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Seja o primeiro a compartilhar sua experiência
                </p>
                <Button 
                  variant="link" 
                  className="mt-4 text-indigo-600 dark:text-indigo-400"
                  onClick={() => setShowForm(true)}
                >
                  Escrever depoimento
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Paginação ou "Ver Mais" */}
          {testimonials.length > 4 && (
            <motion.div 
              className="mt-8 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                variant="outline" 
                className="gap-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              >
                Ver mais depoimentos
                <ChevronDown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.section>

        {/* Footer completo */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 dark:border-gray-600 pt-12 pb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xl font-bold text-gray-900 dark:text-gray-300">Rentix</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Uma solução da <span className="font-semibold text-indigo-500 dark:text-indigo-400">Mavtech</span> para gestão imobiliária inteligente.
              </p>
              <div className="flex gap-4">
                {[
                  { name: 'Facebook', icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                  { name: 'Instagram', icon: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z' },
                  { name: 'LinkedIn', icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
                  { name: 'GitHub', icon: 'M12 0C5.37 0 0 5.37 0 12a12 12 0 008.207 11.385c.6.113.793-.26.793-.577v-2.234c-3.338.726-4.033-1.415-4.033-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.09-.746.082-.731.082-.731 1.204.084 1.837 1.236 1.837 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.419-1.305.762-1.605-2.665-.303-5.467-1.333-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 016 0c2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.241 2.874.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .32.192.694.8.576A12.005 12.005 0 0024 12c0-6.63-5.37-12-12-12z' }
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    whileHover={{ y: -2 }}
                    href={`https://${social.name.toLowerCase()}.com/yourprofile`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Empresa",
                links: [
                  { name: "Sobre a Mavtech", url: "/about" },
                  { name: "Blog", url: "/blog" }
                ]
              },
              {
                title: "Recursos",
                links: [
                  { name: "Todos Recursos", url: "/features" },
                  { name: "Status do Sistema", url: "/status" }
                ]
              },
              {
                title: "Contato",
                items: [
                  { icon: <MapPin className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />, text: "Moçambique, Matola, Patrice Lumumba" },
                  { icon: <Mail className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />, text: "mavtech596@gmail.com" },
                  { icon: <Phone className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />, text: "(+258) 875694141" },
                  { icon: <Clock className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />, text: "Seg-Sex: 9h às 18h" }
                ]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-4">{section.title}</h3>
                {section.links ? (
                  <ul className="space-y-3">
                    {section.links.map((link, idx) => (
                      <motion.li 
                        key={idx}
                        whileHover={{ x: 5 }}
                      >
                        <Link 
                          to={link.url} 
                          className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-3">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                        <span className="mt-0.5">{item.icon}</span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
              {[
                { icon: <Shield className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />, text: "Política de Privacidade", url: "/privacy" },
                { icon: <FileText className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />, text: "Termos de Serviço", url: "/terms" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2"
                >
                  {item.icon}
                  <Link 
                    to={item.url} 
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {item.text}
                  </Link>
                </motion.div>
              ))}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Mavtech Tecnologia. Todos os direitos reservados.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}