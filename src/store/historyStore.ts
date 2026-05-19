import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type HistoryResult = { unitId: string; value: string };

export type HistoryEntry = {
  id: string;
  categoryId: string;
  sourceUnitId: string;
  inputValue: string;
  timestamp: string;
  topResults?: HistoryResult[];
};

type HistoryStore = {
  entries: HistoryEntry[];
  push: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
  clear: () => void;
  load: () => Promise<void>;
  save: () => Promise<void>;
};

const STORAGE_KEY = "@eng_convert_history";
const MAX_ENTRIES = 50;

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  entries: [],

  push: (entry) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: uid(),
      timestamp: new Date().toISOString(),
    };
    set((s) => ({
      entries: [newEntry, ...s.entries].slice(0, MAX_ENTRIES),
    }));
    get().save();
  },

  clear: () => {
    set({ entries: [] });
    get().save();
  },

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) set({ entries: JSON.parse(raw) });
    } catch {}
  },

  save: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get().entries));
    } catch {}
  },
}));
