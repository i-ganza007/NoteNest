import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient()
export default defineEventHandler(async(event)=>{
    try{
        const notes = await prisma.note.findMany()
        return notes
    }
    catch(err){
        console.log(err)
    }
})