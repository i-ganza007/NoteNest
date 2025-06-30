import { PrismaClient, Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try{
        const id = getRouterParam(event,'id')
        
        const cookies = parseCookies(event)
        const token = cookies.NoteNest

        if(!token){
            throw createError({
                statusCode:401,
                statusMessage:'Not authorized to access notes'
            })
        }

        const decodedToken = await jwt.verify(token,process.env.JWT_SECRET)

        const noteTryingToUpdate = await prisma.note.findUnique({
            where:{
                id:Number(id)
            }
        })

        if(!noteTryingToUpdate){
            throw createError({
                statusCode:401,
                statusMessage:'Not doesnot exist'            })
        }

        if(noteTryingToUpdate.userId !== decodedToken.id){
            throw createError({
                statusCode:401,
                statusMessage:'Eorrs weeeeee'            })

        }

        await prisma.note.delete({
            where:{
                id:Number(id)
            }
        })
        return {status:'deleted',message:success}
    }
    catch(err){
        throw createError({
            statusCode:400,
            statusMessage:err
        })
    }
})