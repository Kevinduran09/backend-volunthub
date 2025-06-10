import * as categoryService from "../../services/categoryService.js";

export const categoryResolver = {
  Query: {
    categorias: async () => {
      return await categoryService.getAllCategories();
    },
    categoria: async (_, { id }) => {
      return await categoryService.getCategoryyId(id);
    }
  }
}; 