import { Calendar } from "primereact/calendar";
import React, { useEffect, useState } from "react";
import firstDayPreviousMonth from "./../utils/dateTime";

const SimpleMeasurementForm = ({ onChange }) => {
  //const [Date, setDate] = useState(getPreviousMonth());
  const [values, setValues] = useState({
    date: firstDayPreviousMonth(),
  });

  const onFormChange = (e) => {
    const obj = { ...values };
    obj[e.target.id] = e.value;
    setValues(obj);
    onChange(obj);
  };

  useEffect(() => {
    onChange(values);
  }, []);

  return (
    <>
      <div className="flex flex-column gap-2 px-5 mb-5">
        <label htmlFor="monthpicker">Mês de Medição</label>
        <Calendar
          className="flex-1"
          id="date"
          value={values.date}
          onChange={(e) => onFormChange(e)}
          view="month"
          dateFormat="mm/yy"
        />
      </div>
    </>
  );
};

export default SimpleMeasurementForm;
