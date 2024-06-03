import React, { useEffect, useState } from 'react'
import { Button, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import {
  Close as CloseIcon,
  Check as CheckIcon,
  Block as BlockIcon,
  AddCircle as AddCircleIcon,
} from '@mui/icons-material';

export default function ConfigMasterForm({ master, module, formName, closeSucces, group }) {
  const [formErr, setFormErr] = useState({})
  const [masters, setMasters] = useState([])

  useEffect(() => {
    setMasters(master) 
  },[master])
  // const hideAlert = () => setAlert(null)

  const submit = () => {
    const err = {}
    for (let index = 0; index < masters.length; index++) {
      masters[index].label = masters[index].label.trimStart() 
      if (masters[index].label === '' ) { err[index] = 'err' }
      // if(masters[index].idGroup === undefined) {         
      //   masters[index] = {
      //     ...masters[index],
      //     idGroup: group
      //   }        
      // }
    }
    setFormErr(err)
    // if (Object.keys(err).length > 0) {
    //   setAlert(<SweetAlert
    //     warning
    //     confirmBtnText={<Button variant="outlined" color="primary" style={{ backgroundColor: '#00ACC1' }}>Aceptar</Button>}
    //     title="Advertencia"
    //     onConfirm={() => setAlert(null)
    //     }
    //   >
    //     <Typography>Falta campos por completar</Typography>
    //   </SweetAlert>)
    // } else {
    //   setAlert(<SweetAlert
    //     warning
    //     showCancel
    //     // reverseButtons={true}
    //     title="¿Está seguro?"
    //     confirmBtnText={<Button variant="outlined" color="primary">Aceptar</Button>}
    //     cancelBtnText={<Button variant="contained" color="primary">Cancelar</Button>}
    //     onCancel={() => hideAlert()}
    //     onConfirm={() => {
    //       setMasterList(module, formName, masters)
    //         .then((results) => setAlert(
    //           <SweetAlert
    //             success
    //             title="Guardado"
    //             onConfirm={() => {
    //               hideAlert();
    //               closeSucces();
    //             }}
    //           >
    //             <Typography style={{ justifyContent: 'center', display: 'flex' }}>
    //               Se han guardado los cambios exitosamente
    //             </Typography>
    //           </SweetAlert>
    //         ))
    //         .catch((err) => setAlert(
    //           <SweetAlert
    //             danger
    //             title="Error"
    //             onConfirm={() => hideAlert()}
    //           >
    //             <Typography
    //               style={{ justifyContent: 'center', display: 'flex' }}
    //             >
    //               {JSON.stringify(err?.response?.data ? err?.response?.data : err.response, null, 2)}
    //             </Typography>
    //           </SweetAlert>
    //         ))
    //     }}
    //   >
    //     <Typography
    //       style={{ display: "flex", justifyContent: "center", }}
    //     >
    //       El listado será guardado.
    //     </Typography>
    //   </SweetAlert >
    //   )
    // }

  }
  return <>
    <div className='masterListsTable'>
      <table>
        <thead>
          <tr><th>Id</th><th>Texto</th><th>Estado</th></tr>
        </thead>
        <tbody>
          {masters?.map((item, index) => <tr key={index}>
            <td className='max60'>{index + 1}.</td>
            <td className='min180'>
              <TextField
                fullWidth
                error={formErr[index] === 'err'}
                autoComplete="off"
                name={"input_" + index}
                // label={item.label}
                value={item.label}
                onChange={(e) => {
                  e.persist();
                  setMasters((preList) => preList?.map((pl, plIndex) => index === plIndex ? { ...pl, label: e.target.value } : pl))
                  setFormErr((preErr) => ({ ...preErr, [index]: '' }))
                }}
                placeholder="Escriba aquí..."
                InputProps={{
                  startAdornment: item.value === 0 ? <InputAdornment position="start">new</InputAdornment> : <div></div>
                }}
              />
            </td>
            <td className='max60'><Tooltip title={`Opción ${index + 1} ${item.value === 0 ? 'Nuevo' : item.isActive ? 'Activado' : 'Inactivado'}`}>
              {item.value !== 0 ? <IconButton onClick={() => {
                setMasters((preList) => preList?.map((pl, plIndex) => index === plIndex ? { ...pl, isActive: !pl.isActive } : pl))
              }}>
                {item.isActive ? <CheckIcon /> : <BlockIcon />}
              </IconButton> : <IconButton
                onClick={() => setMasters((preList) => preList?.filter((pl, plIndex) => index !== plIndex))}
              >
                <CloseIcon color="error" />
              </IconButton>}
            </Tooltip></td>
          </tr>)}
          <tr onClick={() => setMasters((preList) => preList?.concat({ value: 0, label: '', isActive: true  }))}
          ><td colSpan={3} style={{ textAlign: 'center' }}>Añadir opción <AddCircleIcon style={{ color: '#00acc1' }} /></td></tr>
        </tbody>
      </table>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => submit()}
        >
          Guardar
        </Button>
      </div>
    </div>
  </>
}