import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import api from "../services/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState([]);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await api.get('/contact/info');
        setContactInfo(response.data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post("/contact", formData);
      toast.success("Mensagem enviada com sucesso!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente mais tarde.");
      console.error("Erro no envio:", error);
    } finally {
      setLoading(false);
    }
  };

  const iconComponents = {
    Mail: Mail,
    Phone: Phone,
    MapPin: MapPin,
    Clock: Clock
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-6 w-full">
      <div className="max-w-6xl w-full mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-200 mb-6">
            Fale <span className="text-indigo-600">Conosco</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Tem alguma dúvida ou precisa de suporte? Estamos aqui para ajudar.
          </p>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Informações */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const IconComponent = iconComponents[info.icon] || Mail;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <IconComponent className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-1">{info.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{info.value}</p>
                    {info.additionalValue && (
                      <p className="text-gray-600 dark:text-gray-300">{info.additionalValue}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Formulário */}
          <div className="lg:w-2/3">
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-6">Envie uma mensagem</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="dark:text-gray-900">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome completo</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600/25 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="dark:text-gray-900">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:text-gray-300 dark:border-gray-600/25 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="dark:text-gray-900">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assunto</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Qual o assunto da sua mensagem?"
                  />
                </div>

                <div className="dark:text-gray-900">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensagem</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600/25 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Escreva sua mensagem aqui..."
                  ></textarea>
                </div>

                <div>
                  <Button 
                    type="submit" 
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:text-white"
                    disabled={loading}
                  >
                    {loading ? "Enviando..." : "Enviar mensagem"} <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Mapa */}
        {/* <div className="mt-12 bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Onde nos encontrar</h2>
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3801.8050862457466!2d32.5855253750493!3d-25.96374917726192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee6cdd0b4d3b9f5%3A0xa6a30027f44d438a!2sAv.%20Patrice%20Lumumba%2C%20Matola!5e0!3m2!1spt-PT!2smz!4v1715785566272!5m2!1spt-PT!2smz"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div> */}
      </div>
    </div>
  );
}