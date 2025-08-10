import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  Building,
  Home,
  Users,
  Landmark,
  CreditCard,
  History,
  Settings,
  Bell,
  UserCircle2,
  Newspaper,
  Info,
  Activity,
  Sparkles,
  Mail,
  Menu,
  X
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "../lib/utils";

const Sidebar = ({ isAdmin = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Fechar sidebar ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const isActive = (path) => location.pathname.startsWith(path);

  // Itens de navegação
  const userNavItems = [
    { path: "/manager", label: "Perfil", icon: UserCircle2 },
    { path: "/dashboard", label: "Painel", icon: Home },
    { path: "/tenants", label: "Inquilinos", icon: Users },
    { path: "/properties", label: "Propriedades", icon: Landmark },
    { path: "/payments", label: "Pagamentos", icon: CreditCard },
    { path: "/paymenthistories", label: "Histórico", icon: History },
    { path: "/notifications", label: "Notificações", icon: Bell },
    { path: "/settings", label: "Configurações", icon: Settings },
    { path: "/blog", label: "Blog", icon: Newspaper },
  ];

  const adminNavItems = [
    { path: "/admin/dashboard", label: "Admin Dashboard", icon: Home },
    { path: "/admin/blog", label: "Blog", icon: Newspaper },
    { path: "/admin/users", label: "Usuários", icon: Users },
    { path: "/admin/about", label: "Sobre", icon: Info },
    { path: "/admin/status", label: "Status", icon: Activity },
    { path: "/admin/features", label: "Funcionalidades", icon: Sparkles },
    { path: "/admin/contact", label: "Contato", icon: Mail },
    { path: "/admin/settings", label: "Configurações", icon: Settings },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile Toggle Button - Modernizado */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "md:hidden fixed top-4 left-4 z-50 p-3 rounded-full",
          "bg-white dark:bg-gray-800 shadow-lg hover:shadow-md",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500",
          "transform active:scale-95"
        )}
        aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        ) : (
          <Menu className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        )}
      </button>

      {/* Overlay moderno */}
      {isSidebarOpen && (
        <div
          className={cn(
            "md:hidden fixed inset-0 z-30",
            "bg-black/50 backdrop-blur-sm",
            "animate-in fade-in duration-200"
          )}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar modernizado */}
      <aside
        className={cn(
          "w-64 bg-white dark:bg-gray-900 p-4 fixed h-screen top-0 left-0 z-40",
          "border-r border-gray-200 dark:border-gray-700",
          "transition-all duration-300 ease-in-out",
          "shadow-xl md:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:sticky"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header estilizado */}
          <div className="flex items-center p-4 mb-2 gap-3">
            <Building className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {isAdmin ? "Admin Rentix" : "Rentix"}
            </span>
          </div>
          
          {/* Navigation modernizada */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path} onClick={closeSidebar}>
                  <Link to={item.path} className="block">
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 px-4 py-3",
                        "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400",
                        "transition-colors duration-150",
                        isActive(item.path) && [
                          "bg-indigo-50 dark:bg-indigo-900/30",
                          "text-indigo-600 dark:text-indigo-400",
                          "font-medium"
                        ]
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="truncate">{item.label}</span>
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Footer estilizado */}
          <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;