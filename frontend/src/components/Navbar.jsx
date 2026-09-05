import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(17, 24, 39, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box
            component={NavLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
              }}
            >
              <StorefrontRoundedIcon sx={{ fontSize: 22, color: '#ffffff' }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#f9fafb', letterSpacing: '-0.02em' }}>
              GMart
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              component={NavLink}
              to="/"
              startIcon={<DashboardRoundedIcon />}
              sx={{
                color: '#9ca3af',
                px: 2,
                py: 0.8,
                borderRadius: 2,
                '&.active': {
                  color: '#818cf8',
                  bgcolor: 'rgba(99, 102, 241, 0.12)',
                },
                '&:hover': {
                  color: '#f9fafb',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              Dashboard
            </Button>
            <Button
              component={NavLink}
              to="/categories"
              startIcon={<CategoryRoundedIcon />}
              sx={{
                color: '#9ca3af',
                px: 2,
                py: 0.8,
                borderRadius: 2,
                '&.active': {
                  color: '#818cf8',
                  bgcolor: 'rgba(99, 102, 241, 0.12)',
                },
                '&:hover': {
                  color: '#f9fafb',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              Categories
            </Button>
            <Button
              component={NavLink}
              to="/products"
              startIcon={<Inventory2RoundedIcon />}
              sx={{
                color: '#9ca3af',
                px: 2,
                py: 0.8,
                borderRadius: 2,
                '&.active': {
                  color: '#818cf8',
                  bgcolor: 'rgba(99, 102, 241, 0.12)',
                },
                '&:hover': {
                  color: '#f9fafb',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              Products
            </Button>
          </Box>
        </Box>

        {/* Right side user & logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<PersonOutlineRoundedIcon sx={{ fontSize: 18 }} />}
            label={user?.name || user?.email || 'Admin'}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.15)',
              color: '#e5e7eb',
              py: 0.5,
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          />
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 2,
              '&:hover': {
                borderColor: 'rgba(239, 68, 68, 0.5)',
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
