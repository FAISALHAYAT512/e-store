import { create } from "zustand"

interface CartUiState {
  refreshKey: number
  triggerRefresh: () => void
}

export const useCartStore = create<CartUiState>((set) => ({
  refreshKey: 0,
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}))