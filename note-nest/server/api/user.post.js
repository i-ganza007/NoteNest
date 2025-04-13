export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        console.log('Received data on server:', body)



        return {
            status: 'success',
            message: 'User registration received',
            data: {
                email: body.email
                // Don't send password back!
            }
        }
    } catch (error) {
        console.error('Server error:', error)
        
        return {
            status: 'error',
            message: 'Registration failed',
            error: error.message
        }
    }
})