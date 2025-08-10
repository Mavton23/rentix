import { useState, useEffect } from 'react';
import {
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  MenuItem, 
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Divider
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PenIcon, PlusIcon, TrashIcon } from 'lucide-react';
import api from '../../services/api';

export default function FeaturesManager() {
  const [features, setFeatures] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar features
  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const response = await api.get('/system');
      setFeatures(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Erro ao carregar features:', error);
    }
  };

  // Manipuladores de formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentFeature(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDetailsChange = (index, value) => {
    const newDetails = [...currentFeature.details];
    newDetails[index] = value;
    setCurrentFeature(prev => ({
      ...prev,
      details: newDetails
    }));
  };

  const addDetail = () => {
    setCurrentFeature(prev => ({
      ...prev,
      details: [...prev.details, '']
    }));
  };

  const removeDetail = (index) => {
    const newDetails = [...currentFeature.details];
    newDetails.splice(index, 1);
    setCurrentFeature(prev => ({
      ...prev,
      details: newDetails
    }));
  };

  // Manipuladores de CRUD
  const handleCreate = () => {
    setCurrentFeature({
      title: '',
      icon: '',
      description: '',
      details: [''],
      model: '',
      order: features.length,
      isActive: true
    });
    setOpen(true);
  };

  const handleEdit = (feature) => {
    setCurrentFeature({ ...feature });
    setOpen(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (currentFeature.featureId) {
        await api.put(`/system/${currentFeature.featureId}`, currentFeature);
      } else {
        await api.post('/system', currentFeature);
      }
      loadFeatures();
      setOpen(false);
    } catch (error) {
      console.error('Erro ao salvar feature:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (featureId) => {
    if (window.confirm('Tem certeza que deseja excluir este recurso?')) {
      try {
        await api.delete(`/system/${featureId}`);
        loadFeatures();
      } catch (error) {
        console.error('Erro ao excluir feature:', error);
      }
    }
  };

  // Reordenar features
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(features);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Atualizar ordem localmente
    const updatedFeatures = items.map((item, index) => ({
      ...item,
      order: index
    }));
    setFeatures(updatedFeatures);

    // Enviar nova ordem para o backend
    try {
      await api.patch('/features/reorder', {
        features: updatedFeatures.map(f => ({
          featureId: f.featureId,
          order: f.order
        }))
      });
    } catch (error) {
      console.error('Erro ao reordenar features:', error);
      loadFeatures(); // Reverte em caso de erro
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 , color: 'white'}}>
        <Typography variant="h5">Gerenciador de Recursos</Typography>
        <Button 
          variant="contained" 
          startIcon={<PlusIcon />}
          onClick={handleCreate}
        >
          Adicionar Recurso
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable 
          droppableId="features" 
          isDropDisabled={true} 
          isCombineEnabled={true}
          ignoreContainerClipping={true}
        >
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {features.map((feature, index) => (
                <Draggable key={feature.featureId} draggableId={feature.featureId} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        backgroundColor: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box {...provided.dragHandleProps} sx={{ cursor: 'move', mr: 2 }}>
                        <Typography variant="subtitle1">{feature.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ordem: {feature.order} | Modelo: {feature.model}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={feature.isActive}
                              onChange={async (e) => {
                                try {
                                  await api.put(`/features/${feature.featureId}`, {
                                    ...feature,
                                    isActive: e.target.checked
                                  });
                                  loadFeatures();
                                } catch (error) {
                                  console.error('Erro ao atualizar status:', error);
                                }
                              }}
                            />
                          }
                          label="Ativo"
                          labelPlacement="start"
                        />
                        
                        <IconButton onClick={() => handleEdit(feature)}>
                          <PenIcon />
                        </IconButton>
                        
                        <IconButton onClick={() => handleDelete(feature.featureId)} color="error">
                          <TrashIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{currentFeature?.featureId ? 'Editar Recurso' : 'Novo Recurso'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              name="title"
              label="Título"
              fullWidth
              margin="normal"
              value={currentFeature?.title || ''}
              onChange={handleInputChange}
            />
            
            <TextField
              name="icon"
              label="Ícone (Lucide Icons)"
              fullWidth
              margin="normal"
              value={currentFeature?.icon || ''}
              onChange={handleInputChange}
            />
            
            <TextField
              name="description"
              label="Descrição"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={currentFeature?.description || ''}
              onChange={handleInputChange}
            />
            
            <TextField
              name="model"
              label="Modelo Relacionado"
              fullWidth
              margin="normal"
              value={currentFeature?.model || ''}
              onChange={handleInputChange}
            />
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Detalhes do Recurso
            </Typography>
            
            {currentFeature?.details?.map((detail, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  value={detail}
                  onChange={(e) => handleDetailsChange(index, e.target.value)}
                />
                <IconButton onClick={() => removeDetail(index)} color="error">
                  <TrashIcon />
                </IconButton>
              </Box>
            ))}
            
            <Button 
              startIcon={<PlusIcon />}
              onClick={addDetail}
              sx={{ mt: 1 }}
            >
              Adicionar Detalhe
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}