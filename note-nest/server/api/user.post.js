// server/api/user.post.js
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        console.log('Received body:', body)

        const salt = await bcrypt.genSalt(10)
        
        const passwordHash = await bcrypt.hash(body.password,salt)

        
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: passwordHash,
                salt:salt
            }
        })

        return { 
            status: 'success'
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

// Remeber to remove the ? on the user schema since the fields are required 