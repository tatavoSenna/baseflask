import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React, { useState } from "react";
import agentes from "../data/db";
import DetailedMeasurementForm from "../DetailedMeasurementForm/DetailedMeasurementForm";
import SimpleMeasurementForm from "../SimpleMeasurementForm/SimpleMeasurementForm";
import { dateString, lastDayGivenMonth, hourString } from "../utils/dateTime";
import logoRelais from "./../logoRelais.png";

const API_URL = process.env.REACT_APP_API_URL;

const FormContainer = () => {
  const [showDetailedForm, setShowDetailedForm] = useState(true);
  const [detailedValues, setDetailedValues] = useState('');
  const [simpleValues, setSimpleValues] = useState('');
  const [fetching, setFetching] = useState(false);

  const onDetailedFormChange = (values) => {
    setDetailedValues(values);
  };

  const onSimpleFormChange = (values) => {
    setSimpleValues(values);
  };

  const fetchData = (isFinal) => {
    setFetching(true);
    fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: showDetailedForm
        ? postBodySimple(isFinal)
        : postBodyDetailed(isFinal),
    }).then(response => response.json())
      .then((data) => {
        const link = document.createElement('a');
        link.href = data.download_url;
        if (isFinal === true) {
          showDetailedForm
            ? link.setAttribute('download', 'Medições.zip')
            : link.setAttribute('download', "MED_" + detailedValues.ponto.fileName + "_" +
              (detailedValues.dataInicial.getFullYear().toString()) + "_" +
              (detailedValues.dataInicial.getMonth() + 1).toString().padStart(2, 0) + ".xlsx");
        }
        else {
          link.setAttribute('download', 'HORAS FALTANTES.xlsx')
        };
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setFetching(false);
      })
      .catch((error) => {
        console.log(error);
        setFetching(false);
      });
  };

  const postBodySimple = (isFinal) => {
    console.log(simpleValues);
    const startDate = dateString(simpleValues.date);
    const endDate = dateString(lastDayGivenMonth(simpleValues.date));
    const body = JSON.stringify({
      startDate: startDate + "T00:00:00",
      endDate: endDate + "T23:00:00",
      tipoMedicao: isFinal ? "FINAL" : "FALTANTES",
      infoAgente: agentes, //agentes.map((x) => x.pontos),
      simple: "true",
    });
    console.log(body);
    return body;
  };

  const postBodyDetailed = (isFinal) => {
    console.log(detailedValues);
    const startDate = dateString(detailedValues.dataInicial);
    const endDate = dateString(detailedValues.dataFinal);
    const startHour = hourString(detailedValues.horarioInicial);
    const endHour = hourString(detailedValues.horarioFinal);
    const body = JSON.stringify({
      startDate: startDate + "T" + startHour,
      endDate: endDate + "T" + endHour,
      tipoMedicao: isFinal ? "FINAL" : "FALTANTES",
      infoAgente: [
        {
          agente: detailedValues.agente.agente,
          codigoPerfil: detailedValues.agente.codigoPerfil,
          agenteCCEE: detailedValues.agente.agenteCCEE,
          pontos: [
            {
              ponto: detailedValues.ponto.ponto,
              descricao: detailedValues.ponto.descricao,
              fileName: detailedValues.ponto.fileName,
            },
          ],
        },
      ], //agentes.map((x) => x.pontos),
      simple: "false",
    });
    console.log(body);
    return body;
  };

  return (
    <div className="flex flex-column justify-content-center gap-6 w-30rem">
      <Card style={{ transition: "height 4s" }}>
        <div className="flex justify-content-center">
          <img src={logoRelais} className="logo" alt="Relais Energia" />
        </div>
        <div className="flex flex-column gap-1 px-4">
          {showDetailedForm ? (
            <SimpleMeasurementForm onChange={onSimpleFormChange} />
          ) : (
            <DetailedMeasurementForm onChange={onDetailedFormChange} />
          )}
          <div className="flex flex-row gap-4 justify-content-center">
            <Button disabled={fetching}
              label={!fetching && "Baixar"}
              icon={fetching && "pi pi-spin pi-spinner"}
              onClick={() => fetchData(true)}
              className="p-button-outlined p-button-rounded"
            />
            <Button disabled={fetching}
              label={!fetching && "Horas Faltantes"}
              icon={fetching && "pi pi-spin pi-spinner"}
              onClick={() => fetchData(false)}
              className="p-button-outlined p-button-rounded p-button-danger"
            />
          </div>
        </div>
      </Card>
      <div className="flex justify-content-center">
        <div className="flex justify-content-center">
          <Button
            icon={showDetailedForm ? "pi pi-angle-down" : "pi pi-angle-up"}
            onClick={() => setShowDetailedForm(!showDetailedForm)}
            className="p-button-raised p-button-rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
