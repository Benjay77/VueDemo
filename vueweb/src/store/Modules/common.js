import { GetCategory } from "@/api/news";

const actions = {
  getInfoCategory() {
    return new Promise((resolve, reject) => {
      GetCategory()
        .then(response => {
          resolve(response.data.data.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  actions
};
