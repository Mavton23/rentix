import React, { useState, useEffect } from "react";
import { 
  Loader2, 
  Info, 
  CheckCircle, 
  AlertCircle,
  User,
  Mail,
  Phone,
  IdCard,
  Calendar,
  Briefcase,
  ShieldAlert,
  HeartPulse,
  UserCog,
  FileText
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { PhoneInput } from "../ui/PhoneInput";
import { RentixLoader } from "../RentixLoader";
import { 
  Select, 
  SelectTrigger, 
  SelectValue,
  SelectContent,
  SelectItem 
} from "../ui/select";
import { toast } from "sonner";
import { Card } from "../ui/card";

const TenantForm = ({ onSubmit, loading, initialData, isEditMode = false, onCancel }) => {
  // Função para capitalizar o marital_status
  const formatMaritalStatus = (status) => {
    if (!status) return "Solteiro(a)";
    
    // Mapeia os valores do backend para os valores do Select
    const statusMap = {
      'solteiro(a)': 'Solteiro(a)',
      'casado(a)': 'Casado(a)',
      'divorciado(a)': 'Divorciado(a)',
      'viúvo(a)': 'Viúvo(a)'
    };
    
    return statusMap[status.toLowerCase()] || 'Solteiro(a)';
  };
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    binum: "",
    age: "",
    job: "",
    emergencyNum: "",
    marital_status: "Solteiro(a)",
    status: "",
    observation: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        binum: initialData.binum || "",
        age: initialData.age || "",
        job: initialData.job || "",
        emergencyNum: initialData.emergencyNum || "",
        marital_status: formatMaritalStatus(initialData.marital_status),
        status: initialData.status || "",
        observation: initialData.observation || ""
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }
    if (!formData.phone) newErrors.phone = "Telefone é obrigatório";
    if (!formData.binum) newErrors.binum = "Número de identificação é obrigatório";
    if (!formData.age) newErrors.age = "Idade é obrigatória";
    if (!formData.job) newErrors.job = "Profissão é obrigatória";
    if (!formData.emergencyNum) newErrors.emergencyNum = "Número de emergência é obrigatório";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({...prev, [name]: undefined}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    try {
      const dataToSubmit = { ...formData };
      if (!isEditMode) delete dataToSubmit.status;
      
      await onSubmit(dataToSubmit);
      
      if (!isEditMode) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          binum: "",
          age: "",
          job: "",
          emergencyNum: "",
          marital_status: "Solteiro(a)",
          observation: ""
        });
      }
    } catch (error) {
      toast.error("Erro ao enviar os dados. Verifique e tente novamente.", {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><RentixLoader /></div>;
  }

  return (
    <Card className="p-4 md:p-6 dark:bg-gray-950/50">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome Completo */}
        <div>
          <Label htmlFor="name" className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4" />
            Nome Completo *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "border-red-500" : ""}
            placeholder="Digite o nome completo"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* E-mail */}
        <div>
          <Label htmlFor="email" className="flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4" />
            E-mail *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-red-500" : ""}
            placeholder="exemplo@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <Label className="flex items-center gap-2 mb-1">
            <Phone className="h-4 w-4" />
            Telefone *
          </Label>
          <PhoneInput
            value={formData.phone}
            onChange={(value) => {
              setFormData(prev => ({...prev, phone: value}));
              if (errors.phone) setErrors(prev => ({...prev, phone: undefined}));
            }}
            error={errors.phone}
            placeholder="Digite o telefone"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* Número de Identificação */}
        <div>
          <Label htmlFor="binum" className="flex items-center gap-2 mb-1">
            <IdCard className="h-4 w-4" />
            Número de Identificação *
          </Label>
          <Input
            id="binum"
            name="binum"
            value={formData.binum}
            onChange={handleChange}
            className={errors.binum ? "border-red-500" : ""}
            placeholder="Número do documento"
          />
          {errors.binum && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.binum}
            </p>
          )}
        </div>

        {/* Idade */}
        <div>
          <Label htmlFor="age" className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4" />
            Idade *
          </Label>
          <Input
            id="age"
            name="age"
            type="number"
            min="18"
            max="120"
            value={formData.age}
            onChange={handleChange}
            className={errors.age ? "border-red-500" : ""}
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.age}
            </p>
          )}
        </div>

        {/* Profissão */}
        <div>
          <Label htmlFor="job" className="flex items-center gap-2 mb-1">
            <Briefcase className="h-4 w-4" />
            Profissão *
          </Label>
          <Input
            id="job"
            name="job"
            value={formData.job}
            onChange={handleChange}
            className={errors.job ? "border-red-500" : ""}
            placeholder="Digite a profissão"
          />
          {errors.job && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.job}
            </p>
          )}
        </div>

        {/* Número de Emergência */}
        <div>
          <Label className="flex items-center gap-2 mb-1">
            <HeartPulse className="h-4 w-4" />
            Número de Emergência *
          </Label>
          <PhoneInput
            value={formData.emergencyNum}
            onChange={(value) => {
              setFormData(prev => ({...prev, emergencyNum: value}));
              if (errors.emergencyNum) setErrors(prev => ({...prev, emergencyNum: undefined}));
            }}
            error={errors.emergencyNum}
            placeholder="Número para emergências"
          />
          {errors.emergencyNum && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.emergencyNum}
            </p>
          )}
        </div>

        {/* Estado Civil */}
        <div>
          <Label className="flex items-center gap-2 mb-1">
            <UserCog className="h-4 w-4" />
            Estado Civil
          </Label>
          <Select 
            value={formData.marital_status}
            onValueChange={(value) => setFormData(prev => ({...prev, marital_status: value}))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado civil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
              <SelectItem value="Casado(a)">Casado(a)</SelectItem>
              <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
              <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status (apenas edição) */}
        {isEditMode && (
          <div>
            <Label className="flex items-center gap-2 mb-1">
              <ShieldAlert className="h-4 w-4" />
              Status
            </Label>
            <Select 
              value={formData.status || "inativo"}
              onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="expulso">Expulso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Observações */}
        <div>
          <Label htmlFor="observation" className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4" />
            Observações
          </Label>
          <Textarea
            id="observation"
            name="observation"
            value={formData.observation}
            onChange={handleChange}
            placeholder="Informações adicionais sobre o inquilino..."
            rows={3}
          />
        </div>

        {/* Aviso para novo cadastro */}
        {!isEditMode && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-start gap-2 border border-blue-200 dark:border-blue-800/50">
            <Info className="h-4 w-4 mt-0.5 text-blue-500 dark:text-blue-300" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Inquilinos novos são cadastrados como <strong>INATIVOS</strong> e serão ativados ao serem associados a uma propriedade.
            </p>
          </div>
        )}

        {/* Ações do Formulário */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            className="min-w-[120px]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Salvando...
              </>
            ) : isEditMode ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TenantForm;