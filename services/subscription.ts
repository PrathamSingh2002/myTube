import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import { accessTokenHeader } from "./user";
const base_url =  process.env.NEXT_PUBLIC_API_URL+"subscription/";
export const subscribeChannel = async (obj:any)=>{
    try{
        if(obj){
            const res = await axios.post(base_url+"/toggle-subscription/"+obj,{}, accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("error in getting users videos");
    }
}
export const getSubscribedChannels = async (obj:any, page:any)=>{
    try{
        if(obj){
            const res = await axios.get(base_url+`/get-user-subscriptions/${obj}?page=${page}&limit=5`, accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("error in getting channels");
    }
}