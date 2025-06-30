import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

export default defineEventHandler(async (event)=>{
    try{
        const cookies = parseCookies(event)
        const token = cookies.NoteNest

        if(!token){
            throw createError({
                statusCode:401,
                statusMessage:'Not authorized to access notes'
            })
        }

        const decodedToken = await jwt.verify(token,process.env.JWT_SECRET)
        const newNote = await prisma.note.create({
            data:{
                text:'',
                userId:decodedToken.id
            }
        })
        console.log('Backend result success')
    }
    catch(err){
        throw createError({
            statusCode:500,
            statusMessage:'Couldnot verify'})
    }
})