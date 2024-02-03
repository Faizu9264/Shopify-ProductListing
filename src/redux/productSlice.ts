import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types/product';

interface ProductsState {
  items: Product[];
  categories: string[];
  vendors: string[];
  inventory: string[];
  Types: string[];
}

const initialState: ProductsState = {
  items: [],
  categories: [],
  vendors: [],
  inventory: [],
  Types: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.categories = Array.from(new Set(action.payload.map(product => product.category)));
      state.vendors = Array.from(new Set(action.payload.map(product => product.vendor)));
      state.inventory = Array.from(new Set(action.payload.map(product => String(product.inventory))));
      state.Types = Array.from(new Set(action.payload.map(product => product.type)));
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items = [...state.items, action.payload];
      state.categories = Array.from(new Set(state.items.map(product => product.category)));
      state.vendors = Array.from(new Set(state.items.map(product => product.vendor)));
      state.inventory = Array.from(new Set(state.items.map(product => String(product.inventory))));
      state.Types = Array.from(new Set(state.items.map(product => product.type)));
    },
    
  },
});

export const { setProducts, addProduct } = productSlice.actions;

export default productSlice.reducer;
