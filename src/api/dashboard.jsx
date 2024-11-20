import AsyncStorage from "@react-native-async-storage/async-storage"
import http from "./api"

export const GetDashboardApi = async(cb) =>{
   cb&&cb(true)
   await http.get('dashboardApi').
   then((res)=>{
    if(res.data.success){
        cb(false,res?.data)
    }
   }).catch((err)=>{
    console.log(err,'some error occured when fetching the data of dashboard.')
    cb(false,null)
   })
}

export const GetProfileApi = async(cb) =>{
    cb&&cb(true)
    const companyId = await AsyncStorage.getItem('@COMPANY_ID')
    console.log("user id",companyId)
     await http.get(`users/${companyId}`).then
     ((res)=>{
        if(res?.data?.success){
            cb(false,res?.data)
        }
     }).catch((err)=>{
        console.log("error occurd when fetching profile")
        cb(false,null)
     })
}