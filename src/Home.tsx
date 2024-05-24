import { useContext } from "react";
import { BearContext, BearStateSlice, FishStateSlice } from "./bearStore";
import { useStore } from "zustand";

export const Home = () => {
  const store = useContext(BearContext);
  if (!store) throw new Error("Missing BearContext.Provider in the tree");

  const { bears, fishes, addBear, eatFish, addFish } = useStore(
    store,
    (state: BearStateSlice & FishStateSlice) => ({
      bears: state.bears,
      fishes: state.fishes,
      addBear: state.addBear,
      eatFish: state.eatFish,
      notify: state.notify,
      addFish: state.addFish,
    })
  );

  return (
    <div>
      <div className="card">
        <button onClick={addBear}>bear count is {bears}</button>
        <button onClick={addFish}>fishes is {fishes}</button>
        <button onClick={eatFish}>eat fish</button>
      </div>
    </div>
  );
};
