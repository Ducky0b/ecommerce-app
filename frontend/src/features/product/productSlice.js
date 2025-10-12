import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";
const initialState = {
  isLoading: false,
  error: null,
  products: [],
  currentProduct: [],
  currentPage: 1,
  totalPages: 0,
  totalProducts: 0,
};

const slice = createSlice({
  name: "product",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createProductSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const newProduct = action.payload.data;
      state.products = [newProduct, ...state.products];
    },
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const {
        data,
        extra: { count, totalPage },
        page,
      } = action.payload;

      state.products = data;
      state.totalProducts = count;
      state.totalPages = totalPage;
      state.currentPage = page;
    },
    getProductsByIdSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { data } = action.payload;
      state.currentProduct = data;
    },
    updateProductSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const updatedProduct = action.payload.data;
      const index = state.products.findIndex(
        (p) => p._id === updatedProduct._id
      );
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
    },
    deleteProductSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const deletedProduct = action.payload.data;
      state.products = state.products.filter(
        (product) => product._id !== deletedProduct._id
      );
    },
    resetProducts(state, action) {
      state.products = [];
      state.currentPage = 1;
      state.totalPages = null;
    },
  },
});

export const createProduct =
  ({
    name,
    description,
    price,
    categoryId,
    thumbnail,
    color,
    imageUrl,
    size,
    stock,
    sku,
  }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/products`, {
        name,
        description,
        price,
        categoryId,
        thumbnail,
        color,
        imageUrl,
        size,
        stock,
        sku,
      });
      dispatch(slice.actions.createProductSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const getProducts =
  ({ page, limit = 10, categoryId, categoryIds }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };

      if (categoryId) params.categoryId = categoryId;
      if (categoryIds && categoryIds.length > 0) {
        params.categoryIds = categoryIds.join(",");
      }

      const response = await apiService.get(`/products`, { params });
      dispatch(slice.actions.getProductsSuccess({ ...response.data, page }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };
export const getProductsById = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get(`/products/${id}`);
    dispatch(slice.actions.getProductsByIdSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const updateProduct =
  ({
    id,
    name,
    description,
    price,
    categoryId,
    thumbnail,
    color,
    imageUrl,
    size,
    stock,
    sku,
  }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.put(`/products/${id}`, {
        name,
        description,
        price,
        categoryId,
        thumbnail,
        color,
        imageUrl,
        size,
        stock,
        sku,
      });
      dispatch(slice.actions.updateProductSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const deleteProduct = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.delete(`/products/${id}`);
    dispatch(slice.actions.deleteProductSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export default slice.reducer;
