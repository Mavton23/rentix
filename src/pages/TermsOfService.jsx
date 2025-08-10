import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

export default function TermsOfService() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }} className='dark:text-gray-200'>
      <Typography variant="h3" gutterBottom>
        Termos de Serviço
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom className='dark:text-gray-400'>
        Última atualização: {new Date().toLocaleDateString()}
      </Typography>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          1. Aceitação dos Termos
        </Typography>
        <Typography paragraph>
          Ao acessar ou utilizar a plataforma de gestão de propriedades, você concorda em cumprir estes Termos de Serviço, nossa Política de Privacidade e todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este serviço.
        </Typography>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          2. Descrição do Serviço
        </Typography>
        <Typography paragraph>
          Nossa plataforma fornece ferramentas para:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="• Gestão de propriedades e inventário" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Administração de contratos de aluguel" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Processamento de pagamentos e cobrança" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Comunicação entre gestores, proprietários e inquilinos" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Geração de relatórios e documentação" />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          3. Contas de Usuário
        </Typography>
        <Typography paragraph>
          Para acessar certas funcionalidades, você precisará criar uma conta:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="• Você é responsável por manter a confidencialidade de suas credenciais" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Você concorda em nos notificar imediatamente sobre qualquer uso não autorizado de sua conta" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos" />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          4. Responsabilidades do Usuário
        </Typography>
        <Typography paragraph>
          Ao usar a plataforma, você concorda em:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="• Fornecer informações precisas e atualizadas" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Cumprir todas as leis locais relacionadas a propriedades e aluguéis" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Não usar a plataforma para atividades ilegais ou fraudulentas" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Não interferir na segurança ou funcionamento do serviço" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Obter todos os consentimentos necessários antes de adicionar informações de terceiros" />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          5. Propriedade Intelectual
        </Typography>
        <Typography paragraph>
          Todos os direitos de propriedade intelectual relacionados à plataforma, incluindo software, design, logotipos e documentação, são de nossa propriedade ou licenciados para nós. Você concorda em não copiar, modificar, distribuir ou criar trabalhos derivados sem nossa permissão expressa.
        </Typography>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          6. Limitação de Responsabilidade
        </Typography>
        <Typography paragraph>
          Nossa plataforma é fornecida "no estado em que se encontra". Não garantimos que:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="• O serviço atenderá a todos os seus requisitos específicos" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• O serviço será ininterrupto, oportuno, seguro ou livre de erros" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Os resultados obtidos pelo uso do serviço serão precisos ou confiáveis" />
          </ListItem>
        </List>
        <Typography paragraph>
          Em nenhuma circunstância seremos responsáveis por quaisquer danos indiretos, incidentais ou consequenciais resultantes do uso ou incapacidade de usar a plataforma.
        </Typography>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          7. Modificações no Serviço
        </Typography>
        <Typography paragraph>
          Reservamo-nos o direito de:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="• Modificar ou descontinuar o serviço a qualquer momento" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Alterar taxas e planos com aviso prévio de 30 dias" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Atualizar estes Termos periodicamente" />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          8. Lei Aplicável
        </Typography>
        <Typography paragraph>
          Estes Termos serão regidos e interpretados de acordo com as leis do país onde nossa empresa está estabelecida, sem considerar seus conflitos de disposições legais.
        </Typography>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          9. Disposições Gerais
        </Typography>
        <Typography paragraph>
          Se qualquer disposição destes Termos for considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito. Nossa falha em exercer ou executar qualquer direito ou disposição destes Termos não constituirá uma renúncia a tal direito ou disposição.
        </Typography>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          10. Contato
        </Typography>
        <Typography paragraph>
          Para quaisquer dúvidas sobre estes Termos, entre em contato conosco através do e-mail: mavtech596@gmail.com | nordinomaviedeveloper@gmail.com
        </Typography>
      </Box>
    </Container>
  );
};
 