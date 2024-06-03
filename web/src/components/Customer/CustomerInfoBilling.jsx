import React, { useCallback, useEffect, useState } from 'react';
import { Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import {
  AddShoppingCart as AddShoppingCartIcon,
} from '@mui/icons-material';
import { consumerBilling, customerCharge } from '../../api/customer';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';


const columns = [
  { id: 'chargeId', label: 'id', minWidth: 50 },
  { id: 'amount', label: 'Monto', minWidth: 50, },
  { id: 'paymentStatus', label: 'Estado del pago', minWidth: 30 },
  { id: 'createdAt', label: 'Fecha de pago', minWidth: 80 },
  { id: 'paymentCompletedAt', label: 'Fecha de expiración', minWidth: 80 },
  // { id: 'plan', label: 'Plan', minWidth: 80 },
  // { id: 'membershipStatus', label: 'Estado', minWidth: 100 },
];

const amountConvert = (amount) => {
  const partes = amount.toString().split('.');
  return partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function ConstomerInfoBilling({ info }) {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [dataRows, setDataRows] = useState([]);


  const refresh = useCallback(() => {
    setLoading(true);
    consumerBilling(info.customerId, { page, limit: rowsPerPage })
      .then((results) => {
        setPageCount(results.count);
        setDataRows(results.rows.map((row) => {
          const { chargeId, amount, billing_paymentStatus, paymentCompletedAt, createdAt } = row;
          return {
            chargeId,
            amount: '$ ' + amountConvert(amount),
            createdAt: dayjs(createdAt).format('YYYY-MM-DD hh:mm:ss a'),
            paymentStatus: billing_paymentStatus.statusName,
            paymentCompletedAt
          }
        }))
      })
      .catch((err) => Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message,
      }))
      .finally(() => setLoading(false))
  }, [page, rowsPerPage, info.customerId]);

  useEffect(() => {
    refresh();
  }, [page, rowsPerPage, refresh, info.customerId]);

  return <>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {dataRows.length
            ? dataRows.map((row, index) => <TableRow hover role="checkbox" tabIndex={-1} key={index}>
              {columns.map((column) => {
                const value = row[column.id];
                return (
                  <TableCell key={column.id} align={column.align}>
                    {value}
                  </TableCell>
                );
              })}
            </TableRow>)
            : <TableRow hover role="checkbox" tabIndex={-1} >
              <TableCell
                colSpan={columns.length}
                sx={{ textAlign: 'center' }}
              >
                No hay registros de pagos
              </TableCell>
            </TableRow>
          }
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
    <Button
      variant="outlined"
      disabled={loading}
      onClick={() => Swal.fire({
        title: "Esta seguro?",
        text: `Se va a registrar un pago de $${amountConvert(info.billing_plan.amount)} para ${info.firstName} ${info.lastName} por el plan ${info.billing_plan.plan}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1976d2cc",
        cancelButtonColor: "#ff5959",
        confirmButtonText: "Si, estoy seguro!",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          customerCharge(info.customerId)
            .then((charged) => {
              refresh();
              Swal.fire({
                title: "El pago ha sido registrado con exito!",
                text: "El cliente tiene habilitado acceso hasta: " + charged.paymentCompletedAt,
                icon: "success"
              })
            })
            .catch((err) => Swal.fire({
              icon: "error",
              title: "Oops...",
              text: err.response?.data?.message,
            }))
            .finally(() => setLoading(false))
        }
      })}
      startIcon={<AddShoppingCartIcon />}
      sx={{ marginLeft: '10px' }}
    >
      Registrar nuevo pago
    </Button>
  </>
}