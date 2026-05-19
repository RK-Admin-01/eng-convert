import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CategoryPrefs = {
  order?: string[];
  hidden?: string[];
  defaultPair?: { fromUnitId: string; toUnitId: string };
  lastActiveUnitId?: string;
};

type UnitPreferencesStore = {
  prefs: Record<string, CategoryPrefs>;
  setOrder: (categoryId: string, order: string[]) => void;
  setHidden: (categoryId: string, hidden: string[]) => void;
  hideUnit: (categoryId: string, unitId: string) => void;
  showUnit: (categoryId: string, unitId: string) => void;
  setDefaultPair: (categoryId: string, fromUnitId: string, toUnitId: string) => void;
  setLastActiveUnit: (categoryId: string, unitId: string) => void;
  resetCategory: (categoryId: string) => void;
  load: () => Promise<void>;
  save: () => Promise<void>;
};

const STORAGE_KEY = "@eng_convert_unit_prefs";

export const useUnitPreferencesStore = create<UnitPreferencesStore>((set, get) => ({
  prefs: {},

  setOrder: (categoryId, order) => {
    set((s) => ({
      prefs: { ...s.prefs, [categoryId]: { ...s.prefs[categoryId], order } },
    }));
    get().save();
  },

  setHidden: (categoryId, hidden) => {
    set((s) => ({
      prefs: { ...s.prefs, [categoryId]: { ...s.prefs[categoryId], hidden } },
    }));
    get().save();
  },

  hideUnit: (categoryId, unitId) => {
    const current = get().prefs[categoryId]?.hidden ?? [];
    if (!current.includes(unitId)) {
      get().setHidden(categoryId, [...current, unitId]);
    }
  },

  showUnit: (categoryId, unitId) => {
    const current = get().prefs[categoryId]?.hidden ?? [];
    get().setHidden(categoryId, current.filter((id) => id !== unitId));
  },

  setDefaultPair: (categoryId, fromUnitId, toUnitId) => {
    set((s) => ({
      prefs: { ...s.prefs, [categoryId]: { ...s.prefs[categoryId], defaultPair: { fromUnitId, toUnitId } } },
    }));
    get().save();
  },

  setLastActiveUnit: (categoryId, unitId) => {
    set((s) => ({
      prefs: { ...s.prefs, [categoryId]: { ...s.prefs[categoryId], lastActiveUnitId: unitId } },
    }));
    get().save();
  },

  resetCategory: (categoryId) => {
    set((s) => {
      const prefs = { ...s.prefs };
      delete prefs[categoryId];
      return { prefs };
    });
    get().save();
  },

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) set({ prefs: JSON.parse(raw) });
    } catch {}
  },

  save: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get().prefs));
    } catch {}
  },
}));
