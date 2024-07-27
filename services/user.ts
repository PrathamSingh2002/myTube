import axios from "axios";
const base_url =  process.env.NEXT_PUBLIC_API_URL+"users/";
export const accessTokenHeader = () => {
    return {
        headers:{
            'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem('accessToken') || "")}`
        }
    }
}
export const refreshTokenHeader = () => {
    return {
        headers:{
            'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem('refreshToken') || "")}`
        }
    }
}
export const loginUserService = async (obj:any)=>{
    try{
        if(obj){
            const res = await axios.post(base_url+"login", obj, accessTokenHeader());
            return res.data;
        }
    }catch(err){
        throw new Error("error in login");
    }
}
export const signUpService = async (obj:any)=>{
    try{
        if(obj){
            const res = await axios.post(base_url+"register", obj);
            return res.data;
        }
    }catch(err){
        throw new Error("error in login");
    }
}
export const refreshTokenService = async (obj:any)=>{
    try{
        if(obj){
            const res = await axios.post(base_url+"refresh-token", obj, refreshTokenHeader());
            return res.data;
        }
    }catch(err){
        throw new Error("error in refresh token");
    }
}
