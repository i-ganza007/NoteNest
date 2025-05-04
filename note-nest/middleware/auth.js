// import jsonwebtoken from 'jsonwebtoken'
// We don't use the package directly because its not available on the client side , so to use we use plugins 

export default defineNuxtRouteMiddleware(async(event)=>{
    if(process.client)return
    const nuxtApp = useNuxtApp()
    // console.log('middleware is here')
    const jwt = useCookie('NoteNest')
    console.log(jwt.value)
    if(!jwt.value){
        return navigateTo('/register')
    }
    try {
        const decoded = nuxtApp.$verifyJWTToken(
          jwtCookie.value,
          useRuntimeConfig().jwtSecret 
        )
        // console.log('Decoded token:', decoded)
    } 
    catch (err) {
    console.error('JWT Error:', err)
    return navigateTo('/register')
    }
})

// Always define folder called middle and define which page belongs to this middleware file in the frontends