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
            const res = await axios.post(base_url+"login", obj);
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
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("error in refresh token");
    }
}
export const getUserById = async (obj:any)=>{
    try{
        if(obj){
            const res = await axios.get(base_url+"c/"+obj, accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("error in refresh token");
    }
}
export const getWatchHistory = async (page:any, limit:any)=>{
    try{
        const res = await axios.get(base_url+"history?page="+page+"&limit="+limit, accessTokenHeader());
        return res.data;
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("error in refresh token");
    }
}
export const updateUserProfile = async (obj:any)=>{
    try{
        if(obj){
            const res = await axios.patch(base_url+"update-user-profile/", obj, accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("error in updating Profile");
    }
}