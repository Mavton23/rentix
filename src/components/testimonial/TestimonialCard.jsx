import { Star } from "lucide-react";

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="font-medium text-indigo-600">
              {testimonial.name.charAt(0)}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < testimonial.rating 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <h4 className="font-medium dark:text-gray-300">{testimonial.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(testimonial.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.message}"</p>
    </div>
  );
}