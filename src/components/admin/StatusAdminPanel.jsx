import { useState, useEffect } from 'react';
import { 
  Button, 
  Select, 
  MenuItem, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  CheckCircle as OperationalIcon,
  Warning as DegradedIcon,
  Error as OutageIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import api from '../../services/api';

const STATUS_OPTIONS = [
  { value: 'operational', label: 'Operacional', Icon: OperationalIcon, color: 'success' },
  { value: 'degraded', label: 'Degradado', Icon: DegradedIcon, color: 'warning' },
  { value: 'outage', label: 'Indisponível', Icon: OutageIcon, color: 'error' }
];

export default function StatusAdminPanel() {
  // Estados para status do sistema
  const [systemStatus, setSystemStatus] = useState({
    status: 'operational',
    message: '',
    lastUpdated: null
  });

  const selectedStatus = STATUS_OPTIONS.find(
  (status) => status.value === systemStatus.status
);
  
  // Estados para componentes e incidentes
  const [components, setComponents] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [activeTab, setActiveTab] = useState('status');
  
  // Estados para diálogos e formulários
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isComponentDialogOpen, setIsComponentDialogOpen] = useState(false);
  const [isIncidentDialogOpen, setIsIncidentDialogOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(null);
  const [currentIncident, setCurrentIncident] = useState(null);
  
  // Estados para loading e erros
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar todos os dados
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [statusRes, componentsRes, incidentsRes] = await Promise.all([
          api.get('/status'),
          api.get('/status/components'),
          api.get('/status/incidents')
        ]);
        
        setSystemStatus({
          status: statusRes.data.systemStatus || 'operational',
          message: statusRes.data.message || '',
          lastUpdated: statusRes.data.lastUpdated || new Date()
        });
        
        setComponents(componentsRes.data);
        setIncidents(incidentsRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Falha ao carregar dados do sistema');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  // Handlers para status do sistema
  const handleUpdateStatus = async () => {
    try {
      setIsLoading(true);
      await api.patch('/status/status', { 
        status: systemStatus.status, 
        message: systemStatus.message 
      });
      setSystemStatus(prev => ({
        ...prev,
        lastUpdated: new Date()
      }));
      setIsStatusDialogOpen(false);
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Falha ao atualizar o status');
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers para componentes
  const handleCreateComponent = () => {
    setCurrentComponent({
      name: '',
      description: '',
      status: 'operational',
      isActive: true
    });
    setIsComponentDialogOpen(true);
  };

  const handleSaveComponent = async () => {
    try {
      setIsLoading(true);
      if (currentComponent.id) {
        await api.put(`/status/components/${currentComponent.id}`, currentComponent);
      } else {
        await api.post('/status/components', currentComponent);
      }
      const response = await api.get('/status/components');
      setComponents(response.data);
      setIsComponentDialogOpen(false);
    } catch (err) {
      console.error('Failed to save component:', err);
      setError('Falha ao salvar componente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComponent = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este componente?')) {
      try {
        setIsLoading(true);
        await api.delete(`/status/components/${id}`);
        setComponents(components.filter(c => c.id !== id));
      } catch (err) {
        console.error('Failed to delete component:', err);
        setError('Falha ao excluir componente');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handlers para incidentes
  const handleCreateIncident = () => {
    setCurrentIncident({
      title: '',
      description: '',
      severity: 'medium',
      componentsAffected: [],
      isActive: true
    });
    setIsIncidentDialogOpen(true);
  };

  const handleSaveIncident = async () => {
    try {
      setIsLoading(true);
      if (currentIncident.id) {
        await api.put(`/status/incidents/${currentIncident.id}`, currentIncident);
      } else {
        await api.post('/status/incidents', currentIncident);
      }
      const response = await api.get('/status/incidents');
      setIncidents(response.data);
      setIsIncidentDialogOpen(false);
    } catch (err) {
      console.error('Failed to save incident:', err);
      setError('Falha ao salvar incidente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIncident = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este incidente?')) {
      try {
        setIsLoading(true);
        await api.delete(`/status/incidents/${id}`);
        setIncidents(incidents.filter(i => i.id !== id));
      } catch (err) {
        console.error('Failed to delete incident:', err);
        setError('Falha ao excluir incidente');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Renderização condicional baseada na tab ativa
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'components':
        return (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateComponent}
              >
                Adicionar Componente
              </Button>
            </Box>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ativo</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {components.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell>{component.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={component.status}
                          color={
                            component.status === 'operational' ? 'success' :
                            component.status === 'degraded' ? 'warning' : 'error'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={component.isActive}
                          onChange={async (e) => {
                            try {
                              await api.put(`/status/components/${component.id}`, {
                                ...component,
                                isActive: e.target.checked
                              });
                              const response = await api.get('/status/components');
                              setComponents(response.data);
                            } catch (err) {
                              console.error('Failed to update component:', err);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => {
                          setCurrentComponent(component);
                          setIsComponentDialogOpen(true);
                        }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteComponent(component.id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      
      case 'incidents':
        return (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateIncident}
              >
                Adicionar Incidente
              </Button>
            </Box>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Severidade</TableCell>
                    <TableCell>Ativo</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>{incident.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={incident.severity}
                          color={
                            incident.severity === 'low' ? 'success' :
                            incident.severity === 'medium' ? 'warning' : 'error'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={incident.isActive}
                          onChange={async (e) => {
                            try {
                              await api.put(`/status/incidents/${incident.id}`, {
                                ...incident,
                                isActive: e.target.checked
                              });
                              const response = await api.get('/status/incidents');
                              setIncidents(response.data);
                            } catch (err) {
                              console.error('Failed to update incident:', err);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => {
                          setCurrentIncident(incident);
                          setIsIncidentDialogOpen(true);
                        }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteIncident(incident.id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      
      default:
        return (
          <Box sx={{ mt: 3 }}>
            <Box 
              sx={{ 
                p: 3, 
                border: 1, 
                borderRadius: 1, 
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                {selectedStatus?.Icon && (
                  <selectedStatus.Icon color={selectedStatus.color} sx={{ mr: 1 }} />
                )}
                <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                  {selectedStatus?.label || 'Status desconhecido'}
                </Typography>
                <Chip 
                  label={`Atualizado em: ${new Date(systemStatus.lastUpdated).toLocaleString()}`}
                  size="small" 
                  sx={{ ml: 2 }}
                />
              </Box>

              {systemStatus.message && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontStyle: 'italic',
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 1
                  }}
                >
                  "{systemStatus.message}"
                </Typography>
              )}
            </Box>
          </Box>
        );
    }
  };

  if (isLoading && !systemStatus.lastUpdated) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
      >
        <Typography variant="h5" component="h2" className='dark:text-gray-300'>
          Painel de Status do Sistema
        </Typography>
        
        {activeTab === 'status' && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setIsStatusDialogOpen(true)}
            disabled={isLoading}
          >
            Atualizar Status
          </Button>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Box display="flex">
          <Button
            variant={activeTab === 'status' ? 'contained' : 'text'}
            onClick={() => setActiveTab('status')}
            sx={{ mr: 1 }}
          >
            Status Geral
          </Button>
          <Button
            variant={activeTab === 'components' ? 'contained' : 'text'}
            onClick={() => setActiveTab('components')}
            sx={{ mr: 1 }}
          >
            Componentes ({components.length})
          </Button>
          <Button
            variant={activeTab === 'incidents' ? 'contained' : 'text'}
            onClick={() => setActiveTab('incidents')}
          >
            Incidentes ({incidents.filter(i => i.isActive).length})
          </Button>
        </Box>
      </Box>

      {renderActiveTab()}

      {/* Diálogo para atualizar status do sistema */}
      <Dialog 
        open={isStatusDialogOpen} 
        onClose={() => setIsStatusDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <UpdateIcon sx={{ mr: 1 }} />
            Atualizar Status do Sistema
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Select
              value={systemStatus.status}
              onChange={(e) => setSystemStatus({...systemStatus, status: e.target.value})}
              fullWidth
              sx={{ mb: 3 }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box display="flex" alignItems="center">
                    <option.Icon color={option.color} sx={{ mr: 1 }} />
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Mensagem Personalizada"
              fullWidth
              multiline
              rows={4}
              value={systemStatus.message}
              onChange={(e) => setSystemStatus({...systemStatus, message: e.target.value})}
              placeholder="Descreva o status atual do sistema..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsStatusDialogOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para adicionar/editar componente */}
      <Dialog 
        open={isComponentDialogOpen} 
        onClose={() => setIsComponentDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {currentComponent?.id ? 'Editar Componente' : 'Adicionar Componente'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Nome do Componente"
              fullWidth
              margin="normal"
              value={currentComponent?.name || ''}
              onChange={(e) => setCurrentComponent({...currentComponent, name: e.target.value})}
            />
            <TextField
              label="Descrição"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={currentComponent?.description || ''}
              onChange={(e) => setCurrentComponent({...currentComponent, description: e.target.value})}
            />
            <Select
              label="Status"
              fullWidth
              margin="normal"
              value={currentComponent?.status || 'operational'}
              onChange={(e) => setCurrentComponent({...currentComponent, status: e.target.value})}
            >
              <MenuItem value="operational">Operacional</MenuItem>
              <MenuItem value="degraded">Degradado</MenuItem>
              <MenuItem value="outage">Indisponível</MenuItem>
            </Select>
            <FormControlLabel
              control={
                <Switch
                  checked={currentComponent?.isActive || false}
                  onChange={(e) => setCurrentComponent({...currentComponent, isActive: e.target.checked})}
                />
              }
              label="Ativo"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsComponentDialogOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveComponent}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para adicionar/editar incidente */}
      <Dialog 
        open={isIncidentDialogOpen} 
        onClose={() => setIsIncidentDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {currentIncident?.id ? 'Editar Incidente' : 'Adicionar Incidente'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Título do Incidente"
              fullWidth
              margin="normal"
              value={currentIncident?.title || ''}
              onChange={(e) => setCurrentIncident({...currentIncident, title: e.target.value})}
            />
            <TextField
              label="Descrição"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={currentIncident?.description || ''}
              onChange={(e) => setCurrentIncident({...currentIncident, description: e.target.value})}
            />
            <Select
              label="Severidade"
              fullWidth
              margin="normal"
              value={currentIncident?.severity || 'medium'}
              onChange={(e) => setCurrentIncident({...currentIncident, severity: e.target.value})}
            >
              <MenuItem value="low">Baixa</MenuItem>
              <MenuItem value="medium">Média</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
            </Select>
            <Select
              label="Componentes Afetados"
              fullWidth
              margin="normal"
              multiple
              value={currentIncident?.componentsAffected || []}
              onChange={(e) => setCurrentIncident({...currentIncident, componentsAffected: e.target.value})}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const component = components.find(c => c.id === value);
                    return component ? (
                      <Chip key={value} label={component.name} />
                    ) : null;
                  })}
                </Box>
              )}
            >
              {components.map((component) => (
                <MenuItem key={component.id} value={component.id}>
                  <Checkbox checked={(currentIncident?.componentsAffected || []).includes(component.id)} />
                  {component.name}
                </MenuItem>
              ))}
            </Select>
            <FormControlLabel
              control={
                <Switch
                  checked={currentIncident?.isActive || false}
                  onChange={(e) => setCurrentIncident({...currentIncident, isActive: e.target.checked})}
                />
              }
              label="Ativo"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsIncidentDialogOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveIncident}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}