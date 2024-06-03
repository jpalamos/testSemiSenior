import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, CircularProgress, Container, Dialog, DialogContent, DialogTitle, Grid, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import CustomerForm from './CustomerForm';
import Swal from 'sweetalert2';

import {
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  InfoTwoTone as InfoIcon,
} from '@mui/icons-material';
import { customerGetMasters, customerGetRegister } from '../../api/customer';
import CustomerInfo from './CustomerInfo';
import AssessmentForm from './CustomerAssessmentForm';
import { useAuth } from '../../provider/AuthProvider';

const columns = [
  { id: 'customerId', label: 'id', minWidth: 50 },
  { id: 'avatar', label: 'Avatar', minWidth: 50, isAvatar: true },
  { id: 'fullName', label: 'Nombre', minWidth: 80 },
  { id: 'genderName', label: 'Sexo', minWidth: 80 },
  { id: 'plan', label: 'Plan', minWidth: 80 },
  { id: 'assessments', label: 'Valoraciones', align: 'center' },
  { id: 'membershipStatus', label: 'Estado', align: 'center' },
];

export default function Customer() {
  const [loading, setLoading] = useState(false);
  const [masters, setMasters] = useState({ genders: [], sexualOrientations: [], plans: [] });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [openDialog, setOpenDialog] = useState({ open: false, modulo: '', info: {} });
  const [search, setSearch] = useState('');
  const [searchDeboun, setSearchDeboun] = useState('');
  const [dataRows, setDataRows] = useState([]);
  const { token } = useAuth();

  const handleCloseDialog = () => {
    setOpenDialog({ open: false, modulo: '', info: {} });
  };

  const refresh = useCallback(() => {
    setLoading(true);
    customerGetRegister({ page, limit: rowsPerPage, search })
      .then((results) => {
        setPageCount(results.count);
        setDataRows(results.rows.map((row) => {
          const { customerId, firstName, lastName, assessments, customer_gender, billing_plan, membership_status, genderId, customer_picture } = row;
          const { idFile, destination, filename } = customer_picture;
          return {
            customerId,
            assessments,
            fullName: firstName + ' ' + lastName,
            genderName: customer_gender?.gender,
            plan: billing_plan?.plan,
            membershipStatus: membership_status?.statusName,
            avatar: idFile
              ? `${process.env.REACT_APP_URL_API}/${destination}/${filename}?token=${token}`
              : `https://randomuser.me/api/portraits/${genderId === 1 ? 'women' : 'men'}/${customerId}.jpg`,
            row,
          }
        }))
      })
      .catch((err) => Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message,
      }))
      .finally(() => setLoading(false))
  }, [page, rowsPerPage, search, token]);

  useEffect(() => {
    refresh();
  }, [page, rowsPerPage, refresh])

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
    customerGetMasters()
      .then((results) => setMasters(results))
      .catch((err) => Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message,
      }))
  }, [])

  return <Container maxWidth="xl" sx={{ mt: 2, mb: 1 }}>
    <Paper sx={{
      p: 2, mb: 2, display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2} md={2}>
          <span>Clientes</span>
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
            onClick={() => setOpenDialog({ open: true, modulo: 'addCustomer', info: {} })}
            startIcon={<PersonAddIcon />}
            sx={{ marginLeft: '10px' }}
          >
            Nuevo
          </Button>
        </Grid>
      </Grid>
    </Paper>
    <Paper sx={{ p: 2, width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
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
              <TableCell align='center'>
                Información
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataRows.map((row, index) => <TableRow
              hover
              role="checkbox"
              tabIndex={-1}
              key={index}
              sx={{ cursor: 'pointer' }}
              onClick={() => setOpenDialog({ open: true, modulo: 'openInfo', info: row.row })}
            >
              {columns.map((column) => {
                const value = row[column.id];
                return (
                  <TableCell key={column.id} align={column.align}>
                    {column.isAvatar
                      ? <Avatar
                        alt="Remy Sharp"
                        src={value}
                        sx={{ width: 56, height: 56 }}
                      />
                      : value}
                  </TableCell>
                );
              })}
              <TableCell sx={{ textAlign: '-webkit-center' }}>
                <Avatar
                  sx={{ width: 30, height: 30, bgcolor: '#6959cf' }}
                >
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
    <Dialog
      open={openDialog.open}
      onClose={handleCloseDialog}
      maxWidth="lg"
    >
      <DialogTitle sx={{ textTransform: 'capitalize' }}>
        {openDialog.modulo === 'addCustomer' && 'Cliente'}
        {openDialog.modulo === 'openInfo' && `Perfil: ${openDialog.info?.firstName} ${openDialog.info?.lastName}`}
      </DialogTitle>
      <DialogContent>
        {['addCustomer', 'editCustomer'].includes(openDialog.modulo) &&
          <CustomerForm
            close={() => {
              handleCloseDialog()
              refresh()
            }}
            closeEdit={() => {
              refresh()
              handleCloseDialog()
            }}
            masters={masters}
            isEdit={openDialog.modulo === 'editCustomer'}
            info={openDialog.info}
          />
        }
        {openDialog.modulo === 'openInfo' &&
          <CustomerInfo
            close={() => {
              handleCloseDialog()
              refresh()
            }}
            info={openDialog.info}
            editConsumer={() => setOpenDialog({ open: true, modulo: 'editCustomer', info: openDialog.info })}
            openAssessment={(info, isEdit) => setOpenDialog({ open: true, modulo: isEdit ? 'editAssessmentForm' : 'assessmentForm', info })}
          />
        }
        {
          ['editAssessmentForm', 'assessmentForm'].includes(openDialog.modulo) &&
          <AssessmentForm
            close={() => {
              handleCloseDialog()
              refresh()
            }}
            masters={masters}
            isEdit={openDialog.modulo === 'editAssessmentForm'}
            info={openDialog.info}
          />
        }
      </DialogContent>
    </Dialog>
  </Container >
}