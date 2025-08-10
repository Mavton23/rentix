import { Building } from "lucide-react";
import { cn } from "../lib/utils";
import PropTypes from "prop-types";

export const RentixLoader = ({
  label = "Carregando sua experiência...",
  fullScreen = true,
  className = "",
  logoClassName = "",
  textClassName = "",
  progressBarClassName = ""
}) => {
  // Adicionando o CSS da animação diretamente
  const progressStyle = {
    animation: 'rentixProgress 2s cubic-bezier(0.65, 0, 0.35, 1) infinite',
    width: '0%'
  };

  return (
    <div className={cn(
      "flex flex-col justify-center items-center gap-4 z-50",
      fullScreen ? "fixed inset-0 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm" : "",
      className
    )}>
      {/* Logo animado */}
      <div className={cn("relative", logoClassName)}>
        <Building className="h-16 w-16 text-indigo-600 animate-pulse" />
        
        {/* Efeito de onda pulsante */}
        <div className="absolute inset-0 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 animate-ping opacity-75 -z-10" />
      </div>
      
      {/* Texto e barra de progresso */}
      <div className={cn("text-center space-y-2", textClassName)}>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Rentix
        </h3>
        {label && (
          <p className="text-gray-600 dark:text-gray-400">
            {label}
          </p>
        )}
        
        {/* Barra de progresso animada */}
        <div className={cn(
          "w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
          progressBarClassName
        )}>
          <div 
            className="h-full bg-indigo-600 rounded-full"
            style={progressStyle}
          />
        </div>
      </div>

      {/* Adicionando os keyframes globalmente */}
      <style>
        {`
          @keyframes rentixProgress {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 100%; margin-left: 0%; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}
      </style>
    </div>
  );
};

RentixLoader.propTypes = {
  label: PropTypes.string,
  fullScreen: PropTypes.bool,
  className: PropTypes.string,
  logoClassName: PropTypes.string,
  textClassName: PropTypes.string,
  progressBarClassName: PropTypes.string
};

RentixLoader.defaultProps = {
  label: "Carregando sua experiência...",
  fullScreen: true,
  className: "",
  logoClassName: "",
  textClassName: "",
  progressBarClassName: ""
};