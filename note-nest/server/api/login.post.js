import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcrypt from 'bcryptjs';
import validator from 'validator'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    // 
    if(!validator.isEmail(body.email, {
      allow_display_name: false,
      require_display_name: false,
      allow_utf8_local_part: true
    })) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Email',
        message: 'Email is invalid'
      });
    }

    if(!validator.isStrongPassword(body.password,{
       minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0}
  )){
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Password',
        message: 'Password must be 8 or more characters'
      });
    }

    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Email and password are required'
      });
    }

    // First, check if the email already exists in the database
    const user = await prisma.user.findUnique({
      data:{
        email:body.email
      }
    });

    // if (existingUser) {
    //   throw createError({
    //     statusCode: 409,
    //     statusMessage: 'Conflict',
    //     message: 'An email like this already exists in the application'
    //   });
    // }

    // Proceed with hashing the password
    const isValid = await bcrypt.compare(body.password, user.password);

    if(!isValid){
        throw createError({
                statusCode: 400,
                message: 'User or password is invalid '
              });
    }

    // Now create the user
    // const user = await prisma.user.create({
    //   data: {
    //     email: body.email,
    //     password: passwordHash,
    //     salt: salt,
    //   }
    // });

    const token = jwt.sign({id:user.id},process.env.JWT_SECRET)
    
    setCookie(event,'NoteNest',token)

    return {
      status: 'success',
      message: 'User created successfully'
    };

  } catch (error) {
    // Log the full error for debugging
    console.error('Detailed server error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    // Check for Prisma Client error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error code:', error.code);
      if (error.code === 'P2002') {
        throw createError({
          statusCode: 409,
          statusMessage: 'Conflict',
          message: 'An email like this already exists in the application'
        });
      }
    }

    // If it's already a handled error, just rethrow it
    if (error.statusCode) {
      throw error;
    }

    // General fallback error handling
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Registration failed: ${error.message}`
    });
  }
});

// We need extra validation on both the client and serverside because someone can change the type when inspecting 