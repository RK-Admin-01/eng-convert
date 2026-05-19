import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Notation } from "../conversion/format";

export type Theme = "system" | "light" | "dark";

export type SettingsState = {
  sigFigs: number;
  notation: Notation;
  decimalSeparator: string;
  groupThousands: boolean;
  theme: Theme;
  hapticsEnabled: boolean;
  showExactFactors: boolean;
  fractionMode: boolean;
  fractionDenominator: number;
};

export type SettingsStore = SettingsState & {
  setSigFigs: (v: number) => void;
  setNotation: (v: Notation) => void;
  setDecimalSeparator: (v: string) => void;
  setGroupThousands: (v: boolean) => void;
  setTheme: (v: Theme) => void;
  setHapticsEnabled: (v: boolean) => void;
  setShowExactFactors: (v: boolean) => void;
  setFractionMode: (v: boolean) => void;
  setFractionDenominator: (v: number) => void;
  load: () => Promise<void>;
  save: () => Promise<void>;
};

const STORAGE_KEY = "@eng_convert_settings";

const defaults: SettingsState = {
  sigFigs: 6,
  notation: "auto",
  decimalSeparator: ".",
  groupThousands: false,
  theme: "system",
  hapticsEnabled: true,
  showExactFactors: false,
  fractionMode: false,
  fractionDenominator: 16,
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...defaults,

  setSigFigs: (sigFigs) => { set({ sigFigs }); get().save(); },
  setNotation: (notation) => { set({ notation }); get().save(); },
  setDecimalSeparator: (decimalSeparator) => { set({ decimalSeparator }); get().save(); },
  setGroupThousands: (groupThousands) => { set({ groupThousands }); get().save(); },
  setTheme: (theme) => { set({ theme }); get().save(); },
  setHapticsEnabled: (hapticsEnabled) => { set({ hapticsEnabled }); get().save(); },
  setShowExactFactors: (showExactFactors) => { set({ showExactFactors }); get().save(); },
  setFractionMode: (fractionMode) => { set({ fractionMode }); get().save(); },
  setFractionDenominator: (fractionDenominator) => { set({ fractionDenominator }); get().save(); },

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SettingsState>;
        set({ ...defaults, ...parsed });
      }
    } catch {}
  },

  save: async () => {
    try {
      const { setSigFigs, setNotation, setDecimalSeparator, setGroupThousands,
              setTheme, setHapticsEnabled, setShowExactFactors,
              setFractionMode, setFractionDenominator, load, save, ...state } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  },
}));
