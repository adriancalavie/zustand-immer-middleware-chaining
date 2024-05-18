import { createContext } from "react";
import { StateCreator, create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type BearState = {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
  notify: (message: string) => void;
};

export type BearStore = ReturnType<typeof createBearStore>;

// Custom middleware to notify before state changes
const notifyMiddleware =
  <T extends BearState>(
    config: StateCreator<T, [], [["zustand/immer", never]]>
  ): StateCreator<T, [], [["zustand/immer", never]]> =>
  (set, get, api) =>
    config(
      (partial, replace) => {
        set(partial, replace);
        get().notify(`State has been updated: ${JSON.stringify(get().bears)}`);
      },
      get,
      api
    );

// Create the BearStore with immer and notifyMiddleware
export const createBearStore = () => {
  return create<BearState>()(
    notifyMiddleware(
      immer((set) => ({
        bears: 0,
        increasePopulation: () =>
          set((state) => {
            state.bears += 1;
          }),
        removeAllBears: () =>
          set((state) => {
            state.bears = 0;
          }),
        updateBears: (newBears: number) =>
          set((state) => {
            state.bears = newBears;
          }),
        notify: (message: string) => {
          console.log(message);
        },
      }))
    )
  );
};

export const BearContext = createContext<BearStore | null>(null);
