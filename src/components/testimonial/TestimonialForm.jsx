import { useState } from 'react';
import { Star, User, Mail } from 'lucide-react';
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { ClipLoader } from 'react-spinners';

export function TestimonialForm({ onSuccess  }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/api/testimony/new', {formData});
      setFormData(response.data);
      toast.success('Depoimento enviado com sucesso!');
      onSuccess();
    } catch (error) {
      toast.error('Erro ao enviar. Tente novamente.');
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return <ClipLoader size={50} color="#3b82f6" />
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-600">
      <h3 className="text-xl font-semibold mb-4 dark:text-gray-300">Deixe seu depoimento</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">Nome</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              required
              className="pl-10 w-full pr-4 py-2 border border-gray-300 rounded-lg dark:text-gray-300"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              required
              className="pl-10 w-full pr-4 py-2 border border-gray-300 rounded-lg dark:text-gray-300"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">Avaliação</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 cursor-pointer ${
                  star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => setFormData({...formData, rating: star})}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">Mensagem</label>
          <Textarea
            rows={4}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:text-gray-300"
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />
        </div>

        <Button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Enviar Depoimento
        </Button>
      </form>
    </div>
  );
}