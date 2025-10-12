import { createSlice, current } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  error: null,
  categories: [],
  currentPageCategories: 1,
  totalPagesCategories: 0,
  totalCategories: 0,
};

const slice = createSlice({
  name: "category",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createCategorySuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const newCategory = action.payload.data;
      state.categories = [newCategory, ...state.categories];
    },
    getCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const {
        data,
        extra: { count, totalPage },
        page,
      } = action.payload;

      state.categories = data;
      state.totalCategories = count;
      state.totalPagesCategories = totalPage;
      state.currentPage = page;
    },
    getCategoryByIdSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const {
        data,
        extra: { count, totalPage },
        page,
      } = action.payload;
      state.categories = data;
      state.totalCategories = count;
      state.totalPagesCategories = totalPage;
      state.currentPage = page;
    },
    updateCategorySuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const updatedCategory = action.payload.data;
      const index = state.categories.findIndex(
        (category) => category._id === updatedCategory._id
      );
      if (index !== -1) {
        state.categories[index] = updatedCategory;
      }
    },
    deleteCategorySuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const deletedCategory = action.payload.data;
      state.categories = state.categories.filter(
        (category) => category._id !== deletedCategory._id
      );
    },
  },
});

export const createCategory =
  ({ name, description, parentId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/categories`, {
        name,
        description,
        parentId,
      });
      dispatch(slice.actions.createCategorySuccess(response.data));
      toast.success("Thêm danh mục thành công");
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const getCategories =
  ({ page, limit = 10 }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      const response = await apiService.get(`/categories`, { params });
      dispatch(slice.actions.getCategoriesSuccess({ ...response.data, page }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const getCategoryById =
  ({ id, page, limit = 10 }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      const response = await apiService.get(`/categories/${id}`, { params });
      dispatch(
        slice.actions.getCategoryByIdSuccess({ ...response.data, page })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const updateCategory =
  ({ id, name, description }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.put(`/categories/${id}`, {
        name,
        description,
      });
      dispatch(slice.actions.updateCategorySuccess(response.data));
      toast.success("Cập nhật danh mục thành công");
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };
export const deleteCategory = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.delete(`/categories/${id}`);
    dispatch(slice.actions.deleteCategorySuccess(response.data));
    toast.success("Xoá danh mục thành công");
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};
export default slice.reducer;
