import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import agentes from "../data/db";
import firstDayPreviousMonth, {
  endHour,
  lastDayPreviousGivenMonth,
  startHour,
} from "./../utils/dateTime";
// import logoRelais from "./logoRelais.png";

const DetailedMeasurementForm = ({ onChange }) => {
  const [pontos, setPontos] = useState([]);
  const [values, setValues] = useState({
    dataInicial: firstDayPreviousMonth(),
    dataFinal: lastDayPreviousGivenMonth(new Date()),
    horarioInicial: startHour(),
    horarioFinal: endHour(),
    agente: "",
    ponto: "",
  });

  const onFormChange = (e) => {
    const obj = { ...values };
    obj[e.target.id] = e.value;
    setValues(obj);
    onChange(obj);
    console.log(values.horarioInicial);
  };

  useEffect(() => {
    if (values.agente) {
      setPontos(values.agente.pontos);
      setValues({ ...values, ponto: null });
    }
  }, [values.agente]);

  useEffect(() => {
    onChange(values);
  }, []);

  return (
    <>
      <div className="flex flex-column gap-5">
        <div className="flex flex-row gap-3 justify-content-center">
          <div className="flex flex-1 flex-column gap-2">
            <span className="p-float-label">
              <Calendar
                dateFormat="dd/mm/yy"
                id="dataInicial"
                value={values.dataInicial}
                onChange={(e) => onFormChange(e)}
              />
              <label htmlFor="monthpicker">Data Inicial</label>
            </span>
          </div>
          <div className="flex flex-1 flex-column gap-2">
            <span className="p-float-label">
              <Calendar
                dateFormat="dd/mm/yy"
                id="dataFinal"
                value={values.dataFinal}
                onChange={(e) => onFormChange(e)}
              />
              <label htmlFor="dataFinal">Data Final</label>
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-3 justify-content-center">
          <div className="flex flex-1 flex-column gap-2">
            <span className="p-float-label">
              <Calendar
                id="horarioInicial"
                value={values.horarioInicial}
                onChange={(e) => onFormChange(e)}
                timeOnly
                hourFormat="24"
              />
              <label htmlFor="monthpicker">Horário Inicial</label>
            </span>
          </div>
          <div className="flex flex-1 flex-column gap-2">
            <span className="p-float-label">
              <Calendar
                id="horarioFinal"
                value={values.horarioFinal}
                onChange={(e) => onFormChange(e)}
                timeOnly
                hourFormat="24"
              />
              <label htmlFor="monthpicker">Horário Final</label>
            </span>
          </div>
        </div>
        <div className="flex flex-column justify-content-center">
          <span className="p-float-label">
            <Dropdown
              id="agente"
              className="w-full"
              value={values.agente}
              options={agentes}
              onChange={(e) => onFormChange(e)}
              optionLabel="agente"
            />
            <label htmlFor="agente">Agente</label>
          </span>
        </div>
        <div className="flex flex-column gap-1 justify-content-center">
          <div className="flex flex-1 flex-column gap-2">
            <span className="p-float-label">
              <Dropdown
                id="ponto"
                className="w-full"
                value={values.ponto}
                options={pontos}
                onChange={(e) => onFormChange(e)}
                optionLabel="ponto"
              />
              <label htmlFor="monthpicker">Ponto de Medição</label>
            </span>
          </div>
          <div
            className="flex font-bold flex-row justify-content-end"
            style={{ minHeight: "2rem" }}
          >
            {values.ponto && values.ponto.descricao}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailedMeasurementForm;
