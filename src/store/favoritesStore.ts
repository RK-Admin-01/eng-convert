import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Notation } from "../conversion/format";

export type FavoriteMode = "pair" | "allResults";

export type Favorite = {
  id: string;
  label: string;
  categoryId: string;
  sourceUnitId: string;
  targetUnitId?: string;
  mode: FavoriteMode;
  lastInput?: string;
  precisionOverride?: number;
  notationOverride?: Notation;
  createdAt: string;
  updatedAt: string;
};

type FavoritesStore = {
  favorites: Favorite[];
  add: (f: Omit<Favorite, "id" | "createdAt" | "updatedAt">) => void;
  remove: (id: string) => void;
  update: (id: string, changes: Partial<Favorite>) => void;
  reorder: (fromIndex: number, toIndex: number) => void;
  load: () => Promise<void>;
  save: () => Promise<void>;
};

const STORAGE_KEY = "@eng_convert_favorites";

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],

  add: (f) => {
    const now = new Date().toISOString();
    const fav: Favorite = { ...f, id: uid(), createdAt: now, updatedAt: now };
    set((s) => ({ favorites: [...s.favorites, fav] }));
    get().save();
  },

  remove: (id) => {
    set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) }));
    get().save();
  },

  update: (id, changes) => {
    set((s) => ({
      favorites: s.favorites.map((f) =>
        f.id === id ? { ...f, ...changes, updatedAt: new Date().toISOString() } : f
      ),
    }));
    get().save();
  },

  reorder: (from, to) => {
    set((s) => {
      const arr = [...s.favorites];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { favorites: arr };
    });
    get().save();
  },

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) set({ favorites: JSON.parse(raw) });
    } catch {}
  },

  save: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get().favorites));
    } catch {}
  },
}));
