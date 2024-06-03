import React, { useCallback, useEffect, useState } from 'react';
import { InputAdornment, TextField, Container, Grid, Paper, ToggleButtonGroup, ToggleButton, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, } from '@mui/material';
import Swal from 'sweetalert2';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  InfoTwoTone as InfoIcon,
} from '@mui/icons-material';
import FingerPrintLogo from '../../assets/svg/fingerprint-svgrepo-com.svg';
import { consumerSetAssitence } from "../../api/customer";
import { customerGetRegister } from '../../api/customer';
import { useAuth } from '../../provider/AuthProvider';

const columns = [
  { id: 'avatar', label: 'Avatar', minWidth: 50, isAvatar: true },
  { id: 'fullName', label: 'Nombre', minWidth: 80 },
];

export default function Assistance() {
  const [locationId, setLocationId] = useState('1');
  const [search, setSearch] = useState('');
  const [searchDeboun, setSearchDeboun] = useState('');
  const [dataRows, setDataRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const search = setTimeout(() => {
      if (searchDeboun || searchDeboun === '') {
        // setPage(0)
        setSearch(searchDeboun)
      }
    }, 750);
    return () => clearTimeout(search)
  }, [searchDeboun])

  const refresh = useCallback(() => {
    if (String(search).length >= 3) {
      setLoading(true);
      customerGetRegister({ search })
        .then((results) => {
          setDataRows(results.rows.map((row) => {
            const { customerId, firstName, lastName, genderId, customer_picture } = row;
            const { idFile, destination, filename } = customer_picture;
            return {
              customerId,
              fullName: firstName + ' ' + lastName,
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
    }
  }, [search, token]);

  useEffect(() => {
    refresh();
  }, [refresh])

  const setConsumer = (consumerId) => {
    setLoading(true);
    consumerSetAssitence(consumerId, locationId)
      .then((results) => {
        setSearchDeboun('');
        Swal.fire({
          icon: "success",
          title: "Usuario habilitado!",
          text: "El cliente tiene habilitado acceso hasta: ",
        })
      })
      .catch((err) => Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message,
      }))
      .finally(() => setLoading(false))
  }
  return <Container maxWidth="xl" sx={{ mt: 2, mb: 1 }}>
    <Paper sx={{ p: 2, mt: 2 }}>
      <Grid container alignItems={'center'}>
        <Grid item xs={12} sm={2} md={2}>
          <span>Asistencias</span>
        </Grid>
        <Grid item xs={12} sm={10} md={4} sx={{ padding: '5px 0px', textAlign: 'center' }}>
          <ToggleButtonGroup
            color="primary"
            value={locationId}
            exclusive
            onChange={(e, locationId) => locationId && setLocationId(locationId)}
            aria-label="Platform"
          >
            <ToggleButton value="1">Boston</ToggleButton>
            <ToggleButton value="2">Buenos Aires</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12} sm={12} md={6} sx={{ textAlign: 'center' }}>
          <TextField
            label="Buscar..."
            variant="outlined"
            value={searchDeboun}
            size="small"
            fullWidth
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
      </Grid>
    </Paper >
    {String(search).length >= 3 &&
      <Paper sx={{ mt: 2, p: 2, width: '100%', overflow: 'hidden' }}>
        {loading
          ? <CircularProgress size={20} style={{ marginRight: 10 }} />
          : <>
            {dataRows.length > 0 ?
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
                        Check
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
                      onClick={() => setConsumer(row.customerId)}
                    // onClick={() => setOpenDialog({ open: true, modulo: 'openInfo', info: row.row })}
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
              : <div><span>Sin información</span></div>
            }
          </>
        }
      </Paper>
    }
    <Paper sx={{ mt: 2, p: 2, textAlign: 'center' }} >
      <div>
        <img
          src={FingerPrintLogo}
          alt={"FingerPrintLogo"}
          height={80}
          style={{
            background: 'linear-gradient(to right, #5965f988 0%, #764ba288 100%)',
            borderRadius: '1em',
            padding: '3px',
          }}
        />
      </div>
      <div>
        <span>Huella</span>
      </div>
    </Paper>
  </Container >
}

