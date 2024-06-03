import React from "react";
import ConfigMasterForm from "./ConfigMasterForm";

export default function ConfigLocation({ locations }) {

  return <>
    <ConfigMasterForm master={locations} />
  </>
}