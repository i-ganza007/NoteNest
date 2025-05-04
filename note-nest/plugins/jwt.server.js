import jwt from 'jsonwebtoken'

export default defineNuxtPlugin((nuxtApp)=>{
    return {
        provide:{
            verifyJWTToken:(token, secret,options)=>{
                return jwt.verify(token,secret,options)
            }
        }
    }
})
