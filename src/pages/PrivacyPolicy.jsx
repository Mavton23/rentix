import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }} className='dark:text-gray-200'>
      <Typography variant="h3" gutterBottom>
        Política de Privacidade
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom className='dark:text-gray-400'>
        Última atualização: {new Date().toLocaleDateString()}
      </Typography>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          1. Introdução
        </Typography>
        <Typography paragraph>
          Esta Política de Privacidade descreve como a nossa plataforma de gestão de propriedades coleta, usa, armazena e protege as informações dos usuários (gestores, proprietários e inquilinos). Ao utilizar nossos serviços, você concorda com as práticas descritas nesta política.
        </Typography>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          2. Informações Coletadas
        </Typography>
        <Typography paragraph>
          Coletamos os seguintes tipos de informações:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="• Dados de cadastro (nome, e-mail, telefone, documentos quando aplicável)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Informações sobre propriedades (endereços, características, valores de aluguel)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Dados de transações financeiras (pagamentos, recibos)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Registros de comunicação (notificações enviadas, logs de interação)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Dados técnicos (endereço IP, tipo de dispositivo, logs de acesso)" />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          3. Uso das Informações
        </Typography>
        <Typography paragraph>
          Utilizamos os dados para:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="• Fornecer e manter nossos serviços" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Processar transações e gerenciar contratos" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Comunicar-se com usuários sobre suas contas e propriedades" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Melhorar a segurança e funcionalidade da plataforma" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Cumprir obrigações legais" />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          4. Compartilhamento de Dados
        </Typography>
        <Typography paragraph>
          Seus dados podem ser compartilhados com:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="• Prestadores de serviços terceirizados (processamento de pagamentos, hospedagem)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Autoridades legais quando exigido por lei" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Outras partes envolvidas na gestão da propriedade (como inquilinos e proprietários, conforme necessário)" />
          </ListItem>
        </List>
        <Typography paragraph>
          Nunca vendemos dados pessoais a terceiros para fins de marketing.
        </Typography>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          5. Segurança de Dados
        </Typography>
        <Typography paragraph>
          Implementamos medidas técnicas e organizacionais robustas para proteger seus dados, incluindo:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="• Criptografia de dados em trânsito e em repouso" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Controles de acesso baseados em função" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Auditorias regulares de segurança" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Protocolos para tratamento de incidentes" />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          6. Seus Direitos
        </Typography>
        <Typography paragraph>
          Você tem o direito de:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="• Acessar e corrigir seus dados pessoais" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Solicitar a exclusão de dados, quando aplicável" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Obter uma cópia de seus dados em formato legível" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Revogar consentimentos quando o processamento for baseado em consentimento" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Registrar objeções a determinados processamentos" />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          7. Alterações na Política
        </Typography>
        <Typography paragraph>
          Reservamo-nos o direito de modificar esta política a qualquer momento. Alterações significativas serão comunicadas aos usuários através de notificações na plataforma ou por e-mail.
        </Typography>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          8. Contato
        </Typography>
        <Typography paragraph>
          Para questões sobre privacidade ou exercer seus direitos, entre em contato conosco através do e-mail: mavtech596@gmail.com | nordinomaviedeveloper@gmail.com
        </Typography>
      </Box>
    </Container>
  );
};