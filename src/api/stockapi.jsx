import http from "./api"


export const GetParentStockApi = async (cb) => {
    cb && cb(true)
  await  http.get('stocks').then((res) => {
        if (res.data.success) {
            cb(false, res?.data)
        }
    }).catch((err) => {
        cb(false, null);
        console.log(`${err},some error occured when fetching the data of parent Stocks`)
    })
};


export const GetSubStockApi = async (cb, id) => {
    cb && cb(true)
   await http.get(`stocks/pcategory?pCategory=${id}`).then((res) => {
        if (res.data.success) {
            cb(false, res?.data)
        }
    }).catch((err) => {
        cb(false, null);
        console.log(`${err},some error occured when fetching the data of Sub Stocks`)
    })
};

export const CreateSubStockApi = async(cb,postdata) =>{
 cb&&cb(true)
 await http.post(`categories`,postdata).then((res)=>{
    if(res.data.success){
        cb(false)
    }
 }).catch((err)=>{
    cb(false)
    console.log(`${err},some error occured when creating Sub category`)
 })
}

export const UpdateStockApi = async ( id,postdata) => {
    try {
      const response = await http.put(`stocks/${id}`,postdata);
      console.log("res",response?.data)
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