import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, } from '@mui/material';
import { consumerVisit } from '../../api/customer';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';


const columns = [
  { id: 'assistanceId', label: 'id', minWidth: 80 },
  { id: 'dateTime', label: 'Fecha Ingreso', minWidth: 80 },
  { id: 'location', label: 'Sede', minWidth: 170 },
  { id: 'statusName', label: 'Estado', minWidth: 80 },
];

export default function ConstomerInfoAsist({ info }) {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [dataRows, setDataRows] = useState([]);

  const refresh = useCallback(() => {
    setLoading(true);
    consumerVisit(info.customerId, { page, limit: rowsPerPage })
      .then((results) => {
        setPageCount(results.count);
        setDataRows(results.rows.map((row) => {
          const { assistanceId, location, createdAt, membershipStatusId, membership_status } = row;
          return {
            assistanceId,
            dateTime: dayjs(createdAt).format('YYYY-MM-DD hh:mm:ss a'),
            location: location?.location,
            statusName: membershipStatusId === 1 ? 'Habilitado' : membership_status.statusName
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
    <TableContainer sx={{ maxHeight: 'calc(100hv - 300px)' }}>
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
          {dataRows.map((row, index) => <TableRow hover role="checkbox" tabIndex={-1} key={index}>
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
  </>
}