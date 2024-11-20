

import http from "./api"

export const  GetBillingApi = async (cb) =>{
  cb && cb(true)
 await http.get(`invoices`).then((res)=>{
    if(res?.data?.success){
      cb(false,res?.data)
    }
  }).catch((err)=>{
    cb(false,null)
    console.log(`${err},error while fetching the data of invoices`)
  })
}


export const GenerateInvoiceApi = async (cb,id) =>{
  console.log("id",id)
  cb&&cb(true)
 await http.get(`genrateInvoice/${id}`).then((res)=>{
    if(res?.data?.success){
      cb(false,res?.data)
    }
  }).catch((err)=>{
    cb(false,null)
    console.log(`${err},error while generating the data of invoices..`)
  })
}

export const CreateInvoiceApi = async (cb, postdata) => {
  console.log("postdata create invoice",postdata)
  try {
    const response = await http.post('invoices', postdata)
    console.log("res",response)
    if (response.data.success) {
      cb(false, response.data);
      console.log("invoice created successfully");
    } else {
      cb(false, null);
      console.log("invoice not able to create");
    }
  } catch (error) {
    cb(false, error);
    console.log(error);
  }
};
export const GetProductApi = async (cb,search) =>{
  cb&&cb(true)
 await http.get(`getProductName?search=${search}`).then((res)=>{
    if(res?.data?.success){
      cb(false,res?.data)
    }
  }).catch((err)=>{
    cb(false,null)
    console.log(`${err},error while searching the data of product..`)
  })
}

