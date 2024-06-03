import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';

const columns = [
  { id: 'dateTime', label: 'Fecha Ingreso', minWidth: 80 },
  { id: 'fullName', label: 'Nombre', minWidth: 80 },
  { id: 'location', label: 'Sede', minWidth: 170 },
  { id: 'statusName', label: 'Estado', minWidth: 80 },
];

export default function AsistenciaLastTable({ assistences }) {
  return <TableContainer sx={{ maxHeight: 240 }}>
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
        {assistences.map((item) => ({
          fullName: `${item.customer?.firstName} ${item.customer?.lastName}`,
          location: item.location?.location,
          dateTime: dayjs(item.createdAt).format('YYYY-MM-DD hh:mm:ss a'),
          statusName: item.membershipStatusId === 1 ? 'Habilitado' : item.membership_status.statusName
        })).map((row, index) =>
          <TableRow hover role="checkbox" tabIndex={-1} key={index} >
            {columns.map((column) => {
              const value = row[column.id];
              return (
                <TableCell key={column.id} align={column.align} sx={{ p: '4px 16px' }}>
                  {column.format && typeof value === 'number'
                    ? column.format(value)
                    : value}
                </TableCell>
              );
            })}
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
}