import http from "./api"


export const GetParentCategoryApi = async (cb) => {
    cb && cb(true)
  await  http.get('/categories/parent').then((res) => {
        if (res.data.success) {
            cb(false, res?.data)
        }
    }).catch((err) => {
        cb(false, null);
        console.log(`${err},some error occured when fetching the data of parent category`)
    })
};


export const GetSubCategoryApi = async (cb, id) => {
    cb && cb(true)
   await http.get(`categories/SubCategory/${id}`).then((res) => {
        if (res.data.success) {
            cb(false, res?.data)
        }
    }).catch((err) => {
        cb(false, null);
        console.log(`${err},some error occured when fetching the data of Sub category`)
    })
};

export const CreateSubCategoryApi = async(cb,postdata) =>{
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