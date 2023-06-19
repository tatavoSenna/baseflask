import React from "react";
import './App.css';
import FormContainer from "./FormContainer/FormContainer";

const test = process.env.REACT_APP_API_URL;

function App() {
  return (
    <div className="App">
      <div className="h-full w-full overflow-hidden">
        <div className="flex h-screen align-items-center justify-content-center">
          <FormContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
