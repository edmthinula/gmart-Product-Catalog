import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products-count'],
    queryFn: async () => {
      const response = await api.get('/products', { params: { page: 1, limit: 1 } });
      return response.data;
    },
  });

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.categories || [];

  const totalProducts = productsData?.total || 0;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        {/* Welcome Banner */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#f9fafb' }}>
            Welcome back, {user?.name || user?.email?.split('@')[0] || 'Admin'}! 👋
          </Typography>
          <Typography variant="body1" sx={{ color: '#9ca3af' }}>
            Manage your store's inventory, organize product categories, and streamline your catalog operations.
          </Typography>
        </Paper>

        {/* Quick Navigation Cards */}
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#f9fafb', mb: 2 }}>
          Catalog Overview
        </Typography>

        <Grid container spacing={3}>
          {/* Categories Card */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                bgcolor: 'background.paper',
                transition: 'transform 0.2s, border-color 0.2s',
                '&:hover': {
                  borderColor: 'rgba(99, 102, 241, 0.4)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardActionArea onClick={() => navigate('/categories')} sx={{ p: 3 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'rgba(99, 102, 241, 0.15)',
                        color: '#818cf8',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      <CategoryRoundedIcon fontSize="medium" />
                    </Avatar>
                    <ArrowForwardRoundedIcon sx={{ color: '#6b7280' }} />
                  </Box>

                  <Typography variant="body2" sx={{ color: '#9ca3af', mb: 0.5, fontWeight: 500 }}>
                    Total Categories
                  </Typography>

                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f9fafb' }}>
                    {categoriesLoading ? <CircularProgress size={24} /> : categories.length}
                  </Typography>

                  <Typography variant="caption" sx={{ color: '#818cf8', mt: 1, display: 'block' }}>
                    Click to manage categories &rarr;
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Products Card */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                bgcolor: 'background.paper',
                transition: 'transform 0.2s, border-color 0.2s',
                '&:hover': {
                  borderColor: 'rgba(6, 182, 212, 0.4)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardActionArea onClick={() => navigate('/products')} sx={{ p: 3 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'rgba(6, 182, 212, 0.15)',
                        color: '#22d3ee',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                      }}
                    >
                      <Inventory2RoundedIcon fontSize="medium" />
                    </Avatar>
                    <ArrowForwardRoundedIcon sx={{ color: '#6b7280' }} />
                  </Box>

                  <Typography variant="body2" sx={{ color: '#9ca3af', mb: 0.5, fontWeight: 500 }}>
                    Total Products
                  </Typography>

                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f9fafb' }}>
                    {productsLoading ? <CircularProgress size={24} /> : totalProducts}
                  </Typography>

                  <Typography variant="caption" sx={{ color: '#22d3ee', mt: 1, display: 'block' }}>
                    Click to manage products &rarr;
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
