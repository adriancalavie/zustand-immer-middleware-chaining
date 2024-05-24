import { createContext } from "react";
import { StateCreator, createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

export type BearStateSlice = {
  bears: number;
  addBear: () => void;
  eatFish: () => void;
  notify: (message: string) => void;
};

export type FishStateSlice = {
  fishes: number;
  addFish: () => void;
};

const createBearSlice: StateCreator<
  BearStateSlice & FishStateSlice,
  [],
  [],
  BearStateSlice
> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
  notify: (message) => console.log(message),
});

const createFishSlice: StateCreator<
  BearStateSlice & FishStateSlice,
  [],
  [],
  FishStateSlice
> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
});

export type BearStore = ReturnType<typeof createBearStore>;

// Custom middleware to notify before state changes
const notifyMiddleware =
  <T extends BearStateSlice & FishStateSlice>(
    config: StateCreator<T, [], [["zustand/immer", never]]>
  ): StateCreator<T, [], [["zustand/immer", never]]> =>
  (set, get, api) =>
    config(
      (partial, replace) => {
        set(partial, replace);
        get().notify(`Bears: ${JSON.stringify(get().bears)}`);
        get().notify(`Fishes: ${JSON.stringify(get().fishes)}`);
      },
      get,
      api
    );

// Create the BearStore with immer and notifyMiddleware
export const createBearStore = () => {
  return createStore<BearStateSlice & FishStateSlice>()(
    notifyMiddleware(
      immer((...a) => ({
        ...createBearSlice(...a),
        ...createFishSlice(...a),
      }))
    )
  );
};

export const BearContext = createContext<BearStore | null>(null);
