import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, CircularProgress, Container, Dialog, DialogContent, DialogTitle, Grid, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import RegisterForm from './RegisterForm';
import Swal from 'sweetalert2';
import {
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  InfoTwoTone as InfoIcon,
} from '@mui/icons-material';
import { authGetRegister } from '../../api/auth';
import { configGetmasters } from '../../api/config';
import { useAuth } from '../../provider/AuthProvider';

const columns = [
  { id: 'userId', label: 'id', minWidth: 50 },
  { id: 'avatar', label: 'Avatar', minWidth: 100, isAvatar: true },
  { id: 'fullName', label: 'Nombre', minWidth: 170 },
  { id: 'rol', label: 'Rol', minWidth: 100 },
  { id: 'identityCard', label: 'Documento', minWidth: 100 },
  { id: 'color', label: 'Color', minWidth: 100, isColor: true },
];

const columnsAdmin = [
  { id: 'userId', label: 'id', minWidth: 50 },
  { id: 'avatar', label: 'Avatar', minWidth: 100, isAvatar: true },
  { id: 'fullName', label: 'Nombre', minWidth: 170 },
  { id: 'identityCard', label: 'Documento', minWidth: 100 },
];

export default function Register() {
  const auth = useAuth();
  const [masters, setMasters] = useState({ roles: [], locations: [], admins: [] });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [openDialog, setOpenDialog] = useState({ open: false, isEdit: false, info: {} });
  const [search, setSearch] = useState('');
  const [searchDeboun, setSearchDeboun] = useState('');
  const [dataRows, setDataRows] = useState([]);

  const handleCloseDialog = () => setOpenDialog({ open: false, isEdit: false, info: {} });

  const refresh = useCallback(() => {
    setLoading(true);
    authGetRegister({ page, limit: rowsPerPage, search })
      .then((results) => {
        setPageCount(results.count);
        setDataRows(results.rows.map((row) => {
          const { userId, user_role, users_personal_info, user_picture } = row;
          return {
            userId,
            identityCard: users_personal_info.identityCard ?? '',
            fullName: users_personal_info?.firstName ? `${users_personal_info?.firstName} ${users_personal_info?.firstLastName}` : null,
            rol: user_role.role,
            avatar: user_picture?.destination ? `${process.env.REACT_APP_URL_API}/${user_picture.destination}/${user_picture.filename}?token=${auth.token}` : null,
            color: users_personal_info?.color ?? '#ffffff',
            row
          }
        }))
      })
      .catch((err) => Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message,
      }))
      .finally(() => setLoading(false))
  }, [page, rowsPerPage, search, auth]);

  useEffect(() => {
    const search = setTimeout(() => {
      if (searchDeboun || searchDeboun === '') {
        // setPage(0)
        setSearch(searchDeboun)
      }
    }, 750);
    return () => clearTimeout(search)
  }, [searchDeboun])

  useEffect(() => {
    refresh();
  }, [page, rowsPerPage, refresh])

  useEffect(() => {
    configGetmasters()
      .then((results) => setMasters({
        roles: results.roles,
        locations: results.locations,
        admins: results.admins.map((row) => {
          const { userId, users_personal_info, user_picture } = row
          return {
            row,
            userId,
            avatar: user_picture?.destination ? `${process.env.REACT_APP_URL_API}/${user_picture.destination}/${user_picture.filename}?token=${auth.token}` : null,
            identityCard: users_personal_info.identityCard ?? '',
            fullName: users_personal_info?.firstName ? `${users_personal_info?.firstName} ${users_personal_info?.firstLastName}` : null,
          }
        })
      }))
      .catch((err) => Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message,
      }))
  }, [auth.token])

  return <Container maxWidth="xl" sx={{ mt: 2, mb: 1 }}>
    <Paper sx={{
      p: 2, mb: 2, display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2} md={2}>
          <span>Empleados</span>
        </Grid>
        <Grid item xs={10} sm={6} md={6} sx={{ margin: 'auto' }}>
          <TextField
            label="Buscar..."
            variant="outlined"
            fullWidth
            value={searchDeboun}
            size="small"
            autoComplete='off'
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              ...search && {
                endAdornment: (<>
                  {(search !== searchDeboun || loading) && (
                    <InputAdornment position="start">
                      <CircularProgress size={20} style={{ marginRight: 10 }} />
                    </InputAdornment>
                  )}
                  <InputAdornment position="end" onClick={() => setSearchDeboun('')}>
                    <CloseIcon />
                  </InputAdornment>
                </>)
              }
            }}
            onChange={(e) => setSearchDeboun(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4} sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setOpenDialog({ open: true, isEdit: false, info: {} })}
            startIcon={<PersonAddIcon />}
            sx={{ marginLeft: '10px' }}
          >
            Nuevo
          </Button>
        </Grid>
      </Grid>
    </Paper >
    <Paper sx={{ p: 2, width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell sx={{ textAlign: 'center' }}>
                Información
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataRows.map((row, index) => <TableRow
              hover
              role="checkbox"
              tabIndex={-1}
              sx={{ cursor: 'pointer' }}
              key={index}
              onClick={() => setOpenDialog({ open: true, isEdit: true, isAdmin: false, info: row.row })}
            >
              {columns.map((column) => {
                const value = row[column.id];
                return (
                  <TableCell key={column.id} align={column.align}>
                    {column.isAvatar
                      ? value && <Avatar
                        alt="Avatar"
                        src={value}
                        sx={{ ml: '4px', width: '24px', height: '24px' }}
                      />

                      // <ImageUploaded isAvatar imageUrl={value} />
                      : column.isColor
                        ? <div style={{ backgroundColor: value, width: '100%', height: '30px', borderRadius: '4px' }}></div>
                        : value}
                  </TableCell>
                );
              })}
              <TableCell sx={{ textAlign: '-webkit-center', cursor: 'pointer' }}>
                <Avatar sx={{ width: 30, height: 30, bgcolor: '#6959cf' }}>
                  <InfoIcon />
                </Avatar>
              </TableCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[2, 10, 25, 50]}
        component="div"
        count={pageCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={((event, newPage) => setPage(newPage))}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(+event.target.value);
          setPage(0);
        }}
        labelRowsPerPage={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {loading && <CircularProgress size={20} style={{ marginRight: 10 }} />}
            Filas por página:
          </div>
        }
        labelDisplayedRows={({ from, to, count }) =>
          (`${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`)
        }
      />
    </Paper>
    <Paper sx={{ mt: 2, p: 2, width: '100%', overflow: 'hidden' }}>
      <div>
        <span>Administradores</span>
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columnsAdmin.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell sx={{ textAlign: 'center' }}>
                Información
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {masters.admins.map((row, index) => <TableRow
              hover
              role="checkbox"
              tabIndex={-1}
              sx={{ cursor: 'pointer' }}
              key={index}
              onClick={() => setOpenDialog({ open: true, isEdit: true, isAdmin: true, info: row.row })}
            >
              {columnsAdmin.map((column) => {
                const value = row[column.id];
                return (
                  <TableCell key={column.id} align={column.align}>
                    {value}
                  </TableCell>
                );
              })}
              <TableCell sx={{ textAlign: '-webkit-center', cursor: 'pointer' }}>
                <Avatar sx={{ width: 30, height: 30, bgcolor: '#6959cf' }}>
                  <InfoIcon />
                </Avatar>
              </TableCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
    <Dialog
      open={openDialog.open}
      onClose={handleCloseDialog}
    >
      <DialogTitle>Empleado</DialogTitle>
      <DialogContent>
        <RegisterForm
          close={() => {
            handleCloseDialog()
            refresh()
          }}
          masters={masters}
          isEdit={openDialog.isEdit}
          isAdmin={openDialog.isAdmin}
          info={openDialog.info}
        />
      </DialogContent>
    </Dialog>
  </Container >
}