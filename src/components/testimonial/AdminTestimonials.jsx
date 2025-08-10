// src/pages/AdminTestimonials.jsx
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
import axios from 'axios';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/testimony/pending', {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        setTestimonials(response.data);
      } catch (error) {
        toast.error("Erro ao buscar os depoimentos");
      }
    };
    fetchTestimonials();
  }, []);

  const handleApprove = async (id) => {
    try {
        const response = await axios(`http://localhost:5000/api/testimonials/${id}/approve`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        setTestimonials(testimonials.filter(t => t.id !== id));
        toast.success("Depoimento atualizado com sucesso!");
    } catch (error) {
        toast.error("Ocorreu um erro ao atualizar depoimento!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-300">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-300">Moderação de Depoimentos</h1>
      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-gray-300">
            <p><strong>{testimonial.name}</strong> ({testimonial.email})</p>
            <p className="italic">"{testimonial.message}"</p>
            <div className="flex justify-between mt-2">
              <span>Avaliação: {testimonial.rating}/5</span>
              {!testimonial.approved && (
                <button 
                  onClick={() => handleApprove(testimonial.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Aprovar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}