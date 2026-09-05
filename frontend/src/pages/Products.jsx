import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
  Stack,
  Pagination,
  InputAdornment,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Products = () => {
  const queryClient = useQueryClient();

  // State & Search
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Create / Edit Modal State
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // null for create, object for edit
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    stock_quantity: '',
  });
  const [formError, setFormError] = useState('');

  // Delete Confirmation Modal State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  // 1. Fetch Products
  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsIsError,
    error: productsFetchError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['products', page, limit, searchTerm],
    queryFn: async () => {
      const response = await api.get('/products', {
        params: {
          page,
          limit,
          search: searchTerm,
        },
      });
      return response.data;
    },
  });

  const products = productsData?.data || [];
  const totalPages = productsData?.totalPages || 1;
  const totalProducts = productsData?.total || 0;

  // 2. Fetch Categories for Dropdown
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.categories || [];

  // 3. Create Product Mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post('/products', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseFormDialog();
    },
    onError: (error) => {
      setFormError(
        error.response?.data?.message ||
          error.message ||
          'Failed to create product.'
      );
    },
  });

  // 4. Update Product Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await api.put(`/products/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseFormDialog();
    },
    onError: (error) => {
      setFormError(
        error.response?.data?.message ||
          error.message ||
          'Failed to update product.'
      );
    },
  });

  // 5. Delete Product Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseDeleteDialog();
    },
    onError: (error) => {
      setDeleteError(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete product.'
      );
    },
  });

  // Search Handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(1);
  };

  // Create / Edit Form Handlers
  const handleOpenCreateDialog = () => {
    setEditProduct(null);
    setFormData({
      name: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      price: '',
      stock_quantity: '0',
    });
    setFormError('');
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name || '',
      category_id: product.category_id || '',
      price: product.price !== undefined ? String(product.price) : '',
      stock_quantity:
        product.stock_quantity !== undefined ? String(product.stock_quantity) : '0',
    });
    setFormError('');
    setFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setFormDialogOpen(false);
    setEditProduct(null);
    setFormData({ name: '', category_id: '', price: '', stock_quantity: '' });
    setFormError('');
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError('Product name is required.');
      return;
    }

    if (!formData.category_id) {
      setFormError('Please select a category.');
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setFormError('Price must be a valid positive number.');
      return;
    }

    const stockNum = parseInt(formData.stock_quantity, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      setFormError('Stock quantity cannot be set below 0.');
      return;
    }

    setFormError('');

    const payload = {
      name: formData.name.trim(),
      category_id: Number(formData.category_id),
      price: priceNum,
      stock_quantity: stockNum,
    };

    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Delete Handlers
  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteError('');
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
    setDeleteError('');
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      setDeleteError('');
      deleteMutation.mutate(productToDelete.id);
    }
  };

  const isFormSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#f9fafb' }}>
                Products
              </Typography>
              {!productsLoading && (
                <Chip
                  label={`${totalProducts} Total`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(99, 102, 241, 0.15)',
                    color: '#818cf8',
                    fontWeight: 600,
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                  }}
                />
              )}
            </Box>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              Manage, monitor, and organize your product catalog inventory
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddRoundedIcon />}
            onClick={handleOpenCreateDialog}
            sx={{ px: 2.5 }}
          >
            Add Product
          </Button>
        </Box>

        {/* Search Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: '#6b7280' }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch} sx={{ color: '#9ca3af' }}>
                    <ClearRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.02)',
              },
            }}
          />
        </Paper>

        {/* Error Alert */}
        {productsIsError && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={() => refetchProducts()}>
                Retry
              </Button>
            }
          >
            {productsFetchError?.response?.data?.message ||
              productsFetchError?.message ||
              'Failed to load products. Please check your connection and try again.'}
          </Alert>
        )}

        {/* Loading State */}
        {productsLoading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 12,
              gap: 2,
            }}
          >
            <CircularProgress size={44} thickness={4} />
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              Loading products...
            </Typography>
          </Box>
        ) : (
          /* Products Table */
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              bgcolor: 'background.paper',
            }}
          >
            <TableContainer>
              <Table sx={{ minWidth: 700 }}>
                <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: 80,
                        color: '#9ca3af',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        pl: 3,
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#9ca3af',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      Product Name
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#9ca3af',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 130,
                        color: '#9ca3af',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      Price
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 140,
                        color: '#9ca3af',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      Stock
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        width: 120,
                        color: '#9ca3af',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        pr: 3,
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8, borderBottom: 'none' }}>
                        <Inventory2RoundedIcon sx={{ fontSize: 48, color: '#4b5563', mb: 1 }} />
                        <Typography variant="h6" sx={{ color: '#9ca3af', fontWeight: 500 }}>
                          No products found
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                          {searchTerm
                            ? `No results matching "${searchTerm}". Try a different keyword.`
                            : 'Get started by adding your first product to the catalog.'}
                        </Typography>
                        {!searchTerm && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AddRoundedIcon />}
                            onClick={handleOpenCreateDialog}
                            sx={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
                          >
                            Add Product
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow
                        key={product.id}
                        hover
                        sx={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell sx={{ pl: 3, color: '#9ca3af', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Chip
                            label={`#${product.id}`}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#9ca3af',
                              height: 24,
                              fontSize: '0.75rem',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#f9fafb', fontWeight: 500, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          {product.name}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Chip
                            label={product.category_name || `Category #${product.category_id}`}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(6, 182, 212, 0.12)',
                              color: '#22d3ee',
                              border: '1px solid rgba(6, 182, 212, 0.25)',
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#f9fafb', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          ${Number(product.price).toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <Chip
                            label={
                              product.stock_quantity === 0
                                ? 'Out of Stock'
                                : `${product.stock_quantity} units`
                            }
                            size="small"
                            sx={{
                              bgcolor:
                                product.stock_quantity === 0
                                  ? 'rgba(239, 68, 68, 0.12)'
                                  : product.stock_quantity <= 10
                                  ? 'rgba(245, 158, 11, 0.12)'
                                  : 'rgba(16, 185, 129, 0.12)',
                              color:
                                product.stock_quantity === 0
                                  ? '#f87171'
                                  : product.stock_quantity <= 10
                                  ? '#fbbf24'
                                  : '#34d399',
                              border: '1px solid',
                              borderColor:
                                product.stock_quantity === 0
                                  ? 'rgba(239, 68, 68, 0.25)'
                                  : product.stock_quantity <= 10
                                  ? 'rgba(245, 158, 11, 0.25)'
                                  : 'rgba(16, 185, 129, 0.25)',
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ pr: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                        >
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Tooltip title="Edit Product">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEditDialog(product)}
                                sx={{
                                  color: '#9ca3af',
                                  '&:hover': { color: '#818cf8', bgcolor: 'rgba(99, 102, 241, 0.1)' },
                                }}
                              >
                                <EditRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Product">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDeleteDialog(product)}
                                sx={{
                                  color: '#9ca3af',
                                  '&:hover': { color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)' },
                                }}
                              >
                                <DeleteOutlineRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2.5,
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalProducts)} of {totalProducts} products
                </Typography>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#9ca3af',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      '&.Mui-selected': {
                        bgcolor: '#6366f1',
                        color: '#ffffff',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        )}

        {/* ----------------- CREATE / EDIT DIALOG ----------------- */}
        <Dialog
          open={formDialogOpen}
          onClose={!isFormSubmitting ? handleCloseFormDialog : undefined}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              p: 1,
            },
          }}
        >
          <Box component="form" onSubmit={handleSaveProduct} noValidate>
            <DialogTitle sx={{ fontWeight: 700, color: '#f9fafb', pb: 1 }}>
              {editProduct ? 'Edit Product' : 'Create New Product'}
            </DialogTitle>
            <DialogContent sx={{ pt: '10px !important' }}>
              {formError && (
                <Alert severity="error" sx={{ mb: 2.5 }}>
                  {formError}
                </Alert>
              )}

              <Stack spacing={2.5} sx={{ mt: 1 }}>
                {/* Product Name */}
                <TextField
                  autoFocus
                  required
                  fullWidth
                  id="product-name"
                  label="Product Name"
                  placeholder="e.g. Organic Honey"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={isFormSubmitting}
                />

                {/* Category Dropdown */}
                <FormControl fullWidth required disabled={isFormSubmitting || categoriesLoading}>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={formData.category_id}
                    label="Category"
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category_id: e.target.value }))
                    }
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Price & Stock in Grid */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    required
                    fullWidth
                    id="product-price"
                    label="Price ($)"
                    type="number"
                    inputProps={{ min: '0', step: '0.01' }}
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    disabled={isFormSubmitting}
                  />

                  <TextField
                    required
                    fullWidth
                    id="product-stock"
                    label="Stock Quantity"
                    type="number"
                    inputProps={{ min: '0', step: '1' }}
                    placeholder="0"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stock_quantity: e.target.value,
                      }))
                    }
                    disabled={isFormSubmitting}
                    helperText="Stock cannot be less than 0"
                    FormHelperTextProps={{ sx: { color: '#9ca3af' } }}
                  />
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
              <Button
                onClick={handleCloseFormDialog}
                disabled={isFormSubmitting}
                color="inherit"
                sx={{ color: '#9ca3af' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isFormSubmitting || !formData.name.trim() || !formData.category_id}
                sx={{ minWidth: 90 }}
              >
                {isFormSubmitting ? (
                  <CircularProgress size={22} color="inherit" />
                ) : editProduct ? (
                  'Save'
                ) : (
                  'Create'
                )}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* ----------------- DELETE CONFIRMATION DIALOG ----------------- */}
        <Dialog
          open={deleteDialogOpen}
          onClose={!deleteMutation.isPending ? handleCloseDeleteDialog : undefined}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              p: 1,
            },
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#f9fafb', fontWeight: 700 }}>
            <WarningAmberRoundedIcon sx={{ color: '#ef4444', fontSize: 28 }} />
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            {deleteError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            )}
            <DialogContentText sx={{ color: '#9ca3af' }}>
              Are you sure you want to delete the product{' '}
              <Typography component="span" sx={{ color: '#f9fafb', fontWeight: 600 }}>
                "{productToDelete?.name}"
              </Typography>
              ? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleCloseDeleteDialog}
              disabled={deleteMutation.isPending}
              color="inherit"
              sx={{ color: '#9ca3af' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              sx={{ minWidth: 90 }}
            >
              {deleteMutation.isPending ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                'Delete'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Products;
