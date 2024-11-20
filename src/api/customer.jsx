import http from "./api";

export const GetAllCustomerApi = async (setErrorToast, setToastMessage,search) => {
  try {
    const response = await http.get(`customers?search=${search || ''}`);
    console.log("response",response.data.data)
    if (response?.data?.success) {
      return { status: 'success', data: response.data.data };
    } else {
      return { status: 'info', data: null };
    }
  } catch (error) {
    setErrorToast(true);
    setToastMessage('Customers not found!');
    setTimeout(() => setErrorToast(false), 2000);
  }
};

export const GetCreateCustomerApi = async (postdata) => {
    try {
      const response = await http.post("customers",postdata);
      if (response?.data?.success) {
        return { status: 'success'};
      } else {
        return { status: 'info'};
      }
    } catch (error) {
      console.error("API Error:", error);
      return { status: 'error' };
    }
  };

  export const UpdateCustomerApi = async ( id,postdata) => {
    try {
      const response = await http.put(`customers/${id}`,postdata);
      if (response?.data?.success) {
        return { status: 'success'};
      } else {
        return { status: 'info'};
      }
    } catch (error) {
      console.error("Update API Error:", error);
      return { status: 'error' };
    }
  };