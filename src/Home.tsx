import { useContext } from "react";
import { BearContext, BearState } from "./bearStore";
import { useStore } from "zustand";

export const Home = () => {
  const store = useContext(BearContext);
  if (!store) throw new Error("Missing BearContext.Provider in the tree");

  const { bears, increasePopulation, removeAllBears, updateBears } = useStore(
    store,
    (state: BearState) => ({
      bears: state.bears,
      increasePopulation: state.increasePopulation,
      removeAllBears: state.removeAllBears,
      updateBears: state.updateBears,
    })
  );

  return (
    <div>
      <div className="card">
        <button onClick={increasePopulation}>bear count is {bears}</button>
        <button onClick={removeAllBears}>Remove all bears</button>
        <button onClick={() => updateBears(10)}>Set Bears to 10</button>
      </div>
    </div>
  );
};
