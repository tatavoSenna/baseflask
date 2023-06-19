import React from "react";
import "./App.css";
import FormContainer from "./FormContainer/FormContainer";

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
