import { createContext } from "react";
import { StateCreator, createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

export type BearStateSlice = {
  bears: number;
  addBear: () => void;
  fishWasPoisoned: () => void;
  removeBear: () => void;
  notify: (message: string) => void;
};

export type FishStateSlice = {
  fishes: number;
  addFish: () => void;
};

const FISH_STATE_FIELDS = ["fishes", "addFish"] as const;

type ImmerStateCreator<T, U> = StateCreator<
  T & U,
  [["zustand/immer", never], never],
  [],
  T
>;

const createBearSlice: ImmerStateCreator<BearStateSlice, FishStateSlice> = (
  set
) => ({
  bears: 0,
  addBear: () =>
    set((state) => {
      state.bears += 1;
    }),
  fishWasPoisoned: () =>
    set((state) => {
      state.fishes -= 1;
      state.bears -= 1;
    }),
  removeBear: () =>
    set((state) => {
      state.bears -= 1;
    }),
  notify: (message) => console.log(message),
});

const createFishSlice: ImmerStateCreator<FishStateSlice, BearStateSlice> = (
  set
) => ({
  fishes: 0,
  addFish: () =>
    set((state) => {
      state.fishes += 1;
    }),
});

export type BearStore = ReturnType<typeof createBearStore>;

function hasProperty<T extends object>(
  obj: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  property: keyof any
): property is keyof T {
  return property in obj;
}

// Custom middleware to notify before state changes
const notifyMiddleware =
  <T extends BearStateSlice & FishStateSlice>(
    config: StateCreator<T, [], [["zustand/immer", never]]>
  ): StateCreator<T, [], [["zustand/immer", never]]> =>
  (set, get, api) =>
    config(
      (partial, replace) => {
        set(partial, replace);
        console.log("state changed", partial);
        let shouldNotify = true;
        for (const key of FISH_STATE_FIELDS) {
          if (hasProperty(partial, key)) {
            shouldNotify = false;
          }
        }
        if (shouldNotify) {
          get().notify(`Bear count: ${get().bears}`);
        }
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
