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
  Checkbox,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const Categories = () => {
  const queryClient = useQueryClient();

  // Selection state for bulk delete
  const [selectedIds, setSelectedIds] = useState([]);

  // Create / Edit Modal State
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null); // null for create, object for edit
  const [categoryName, setCategoryName] = useState('');
  const [formError, setFormError] = useState('');

  // Single Delete Confirmation State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [singleDeleteError, setSingleDeleteError] = useState('');

  // Bulk Delete Confirmation State
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleteError, setBulkDeleteError] = useState('');
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  // 1. Fetch Categories
  const {
    data: categoriesData,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.categories || [];

  // 2. Create Category Mutation
  const createMutation = useMutation({
    mutationFn: async (newCategory) => {
      const response = await api.post('/categories', newCategory);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCloseFormDialog();
    },
    onError: (error) => {
      setFormError(
        error.response?.data?.message ||
          error.message ||
          'Failed to create category.'
      );
    },
  });

  // 3. Update Category Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }) => {
      const response = await api.put(`/categories/${id}`, { name });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCloseFormDialog();
    },
    onError: (error) => {
      setFormError(
        error.response?.data?.message ||
          error.message ||
          'Failed to update category.'
      );
    },
  });

  // 4. Single Delete Mutation
  const singleDeleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      if (categoryToDelete) {
        setSelectedIds((prev) => prev.filter((id) => id !== categoryToDelete.id));
      }
      handleCloseDeleteDialog();
    },
    onError: (error) => {
      setSingleDeleteError(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete category.'
      );
    },
  });

  // Form Handlers
  const handleOpenCreateDialog = () => {
    setEditCategory(null);
    setCategoryName('');
    setFormError('');
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (category) => {
    setEditCategory(category);
    setCategoryName(category.name || '');
    setFormError('');
    setFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setFormDialogOpen(false);
    setEditCategory(null);
    setCategoryName('');
    setFormError('');
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setFormError('Category name is required.');
      return;
    }
    setFormError('');

    if (editCategory) {
      updateMutation.mutate({ id: editCategory.id, name: categoryName.trim() });
    } else {
      createMutation.mutate({ name: categoryName.trim() });
    }
  };

  // Single Delete Handlers
  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setSingleDeleteError('');
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
    setSingleDeleteError('');
  };

  const handleConfirmSingleDelete = () => {
    if (categoryToDelete) {
      setSingleDeleteError('');
      singleDeleteMutation.mutate(categoryToDelete.id);
    }
  };

  // Checkbox Selection Handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const allIds = categories.map((c) => c.id);
      setSelectedIds(allIds);
      return;
    }
    setSelectedIds([]);
  };

  const handleCheckboxClick = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selectedIds.includes(id);

  // Bulk Delete Handlers
  const handleOpenBulkDeleteDialog = () => {
    setBulkDeleteError('');
    setBulkDeleteDialogOpen(true);
  };

  const handleCloseBulkDeleteDialog = () => {
    if (!bulkDeleteLoading) {
      setBulkDeleteDialogOpen(false);
      setBulkDeleteError('');
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    setBulkDeleteLoading(true);
    setBulkDeleteError('');

    const results = await Promise.allSettled(
      selectedIds.map((id) => api.delete(`/categories/${id}`))
    );

    const successfulIds = [];
    const failedErrors = [];

    results.forEach((res, index) => {
      const id = selectedIds[index];
      if (res.status === 'fulfilled') {
        successfulIds.push(id);
      } else {
        const errorMsg =
          res.reason?.response?.data?.message ||
          res.reason?.message ||
          `Failed to delete category ID ${id}`;
        failedErrors.push(errorMsg);
      }
    });

    if (successfulIds.length > 0) {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      setSelectedIds((prev) => prev.filter((id) => !successfulIds.includes(id)));
    }

    setBulkDeleteLoading(false);

    if (failedErrors.length === 0) {
      setBulkDeleteDialogOpen(false);
      setSelectedIds([]);
    } else {
      const uniqueErrors = [...new Set(failedErrors)].join(' ');
      setBulkDeleteError(
        `${successfulIds.length} deleted. Failed: ${uniqueErrors}`
      );
    }
  };

  const isFormSubmitting =
    createMutation.isPending || updateMutation.isPending;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        {/* Page Header */}
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
                Categories
              </Typography>
              {!isLoading && (
                <Chip
                  label={`${categories.length} Total`}
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
              Manage and organize product categories in your catalog
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5}>
            {selectedIds.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineRoundedIcon />}
                onClick={handleOpenBulkDeleteDialog}
                sx={{
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  bgcolor: 'rgba(239, 68, 68, 0.08)',
                  '&:hover': {
                    bgcolor: 'rgba(239, 68, 68, 0.18)',
                    borderColor: '#ef4444',
                  },
                }}
              >
                Delete Selected ({selectedIds.length})
              </Button>
            )}

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddRoundedIcon />}
              onClick={handleOpenCreateDialog}
              sx={{ px: 2.5 }}
            >
              Add Category
            </Button>
          </Stack>
        </Box>

        {/* Fetch Error Alert */}
        {isError && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            {fetchError?.response?.data?.message ||
              fetchError?.message ||
              'Failed to load categories. Please check your connection and try again.'}
          </Alert>
        )}

        {/* Loading State */}
        {isLoading ? (
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
              Loading categories...
            </Typography>
          </Box>
        ) : (
          /* Categories Table */
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
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                  <TableRow>
                    <TableCell
                      padding="checkbox"
                      sx={{
                        width: 50,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        pl: 2.5,
                      }}
                    >
                      <Checkbox
                        color="primary"
                        indeterminate={
                          selectedIds.length > 0 &&
                          selectedIds.length < categories.length
                        }
                        checked={
                          categories.length > 0 &&
                          selectedIds.length === categories.length
                        }
                        onChange={handleSelectAllClick}
                        disabled={categories.length === 0}
                        sx={{ color: '#6b7280' }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 90,
                        color: '#9ca3af',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
                      Category Name
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 180,
                        color: '#9ca3af',
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      Created At
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
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8, borderBottom: 'none' }}>
                        <CategoryRoundedIcon sx={{ fontSize: 48, color: '#4b5563', mb: 1 }} />
                        <Typography variant="h6" sx={{ color: '#9ca3af', fontWeight: 500 }}>
                          No categories found
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                          Get started by adding your first product category.
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddRoundedIcon />}
                          onClick={handleOpenCreateDialog}
                          sx={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
                        >
                          Add Category
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => {
                      const isItemSelected = isSelected(category.id);
                      return (
                        <TableRow
                          key={category.id}
                          hover
                          selected={isItemSelected}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&.Mui-selected': {
                              bgcolor: 'rgba(99, 102, 241, 0.08)',
                            },
                            '&.Mui-selected:hover': {
                              bgcolor: 'rgba(99, 102, 241, 0.12)',
                            },
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <TableCell
                            padding="checkbox"
                            sx={{ pl: 2.5, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                          >
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              onChange={() => handleCheckboxClick(category.id)}
                              sx={{ color: '#6b7280' }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#9ca3af', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <Chip
                              label={`#${category.id}`}
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
                            {category.name}
                          </TableCell>
                          <TableCell sx={{ color: '#9ca3af', fontSize: '0.875rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            {category.created_at
                              ? new Date(category.created_at).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : '—'}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ pr: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                          >
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                              <Tooltip title="Edit Category">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenEditDialog(category)}
                                  sx={{
                                    color: '#9ca3af',
                                    '&:hover': { color: '#818cf8', bgcolor: 'rgba(99, 102, 241, 0.1)' },
                                  }}
                                >
                                  <EditRoundedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Category">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDeleteDialog(category)}
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
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* ----------------- CREATE / EDIT DIALOG ----------------- */}
        <Dialog
          open={formDialogOpen}
          onClose={!isFormSubmitting ? handleCloseFormDialog : undefined}
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
          <Box component="form" onSubmit={handleSaveCategory} noValidate>
            <DialogTitle sx={{ fontWeight: 700, color: '#f9fafb', pb: 1 }}>
              {editCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogContent sx={{ pt: '10px !important' }}>
              {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
              )}
              <TextField
                autoFocus
                required
                fullWidth
                id="category-name"
                label="Category Name"
                placeholder="e.g. Electronics, Clothing"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                disabled={isFormSubmitting}
                sx={{ mt: 1 }}
              />
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
                disabled={isFormSubmitting || !categoryName.trim()}
                sx={{ minWidth: 90 }}
              >
                {isFormSubmitting ? (
                  <CircularProgress size={22} color="inherit" />
                ) : editCategory ? (
                  'Save'
                ) : (
                  'Create'
                )}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* ----------------- SINGLE DELETE CONFIRMATION DIALOG ----------------- */}
        <Dialog
          open={deleteDialogOpen}
          onClose={!singleDeleteMutation.isPending ? handleCloseDeleteDialog : undefined}
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
            {singleDeleteError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {singleDeleteError}
              </Alert>
            )}
            <DialogContentText sx={{ color: '#9ca3af' }}>
              Are you sure you want to delete the category{' '}
              <Typography component="span" sx={{ color: '#f9fafb', fontWeight: 600 }}>
                "{categoryToDelete?.name}"
              </Typography>
              ? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleCloseDeleteDialog}
              disabled={singleDeleteMutation.isPending}
              color="inherit"
              sx={{ color: '#9ca3af' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmSingleDelete}
              disabled={singleDeleteMutation.isPending}
              sx={{ minWidth: 90 }}
            >
              {singleDeleteMutation.isPending ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                'Delete'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ----------------- BULK DELETE CONFIRMATION DIALOG ----------------- */}
        <Dialog
          open={bulkDeleteDialogOpen}
          onClose={!bulkDeleteLoading ? handleCloseBulkDeleteDialog : undefined}
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
            Bulk Delete Categories
          </DialogTitle>
          <DialogContent>
            {bulkDeleteError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {bulkDeleteError}
              </Alert>
            )}
            <DialogContentText sx={{ color: '#9ca3af' }}>
              Are you sure you want to delete the{' '}
              <Typography component="span" sx={{ color: '#f9fafb', fontWeight: 600 }}>
                {selectedIds.length}
              </Typography>{' '}
              selected categories? Categories containing associated products cannot be deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleCloseBulkDeleteDialog}
              disabled={bulkDeleteLoading}
              color="inherit"
              sx={{ color: '#9ca3af' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmBulkDelete}
              disabled={bulkDeleteLoading || selectedIds.length === 0}
              sx={{ minWidth: 100 }}
            >
              {bulkDeleteLoading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                `Delete (${selectedIds.length})`
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Categories;
