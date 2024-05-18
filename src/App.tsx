import { useRef } from "react";
import "./App.css";
import { Home } from "./Home";
import { BearContext, createBearStore } from "./bearStore";

function App() {
  const store = useRef(createBearStore()).current;
  return (
    <BearContext.Provider value={store}>
      <Home />
    </BearContext.Provider>
  );
}

export default App;
