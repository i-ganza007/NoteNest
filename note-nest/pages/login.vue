<template>
    <div class="bg-zinc-900 h-screen flex">
        <!-- Side component -->
        <div class="bg-black w-[516px] p-8 flex flex-col justify-center">
            <Logo/>

            <h1 class="text-white text-lg font-bold text-lef mt-8">Log in to your account</h1>

            <p class="text-zinc-300 text-sm mt-0.5">Don't have an account? <nuxt-link to='/register' class="underline font-bold text-[#FFAC00]">Sign Up</nuxt-link> for one</p>

            <form @submit.prevent="submit">
                <div class="mt-12 ">
                    <label for="email" class="text-white text-sm font-normal block text-zinc-300 mb-0.5">Email Address</label>

                    <input type="email" v-model="email" class="block w-full bg-[#27272A] border-[#3F3F46] rounded text-white px-4 py-2 placeholder:text-zinc-500 text-sm" placeholder="you@example.com">
                </div>

                <div class="mt-6">
                    <label for="password" class="text-white text-sm font-normal block text-zinc-300 mb-0.5">Password</label>

                    <div class="flex  items-center">
                        <input type="password" v-model="password" ref='passwordInput' class="block w-full bg-[#27272A] border-[#3F3F46] rounded text-white px-4 py-2 placeholder:text-zinc-500 text-sm" placeholder="**********" id="input">
                        <Password class="relative right-8 hover:cursor-pointer" @click="togglePassword" />
                    </div>
                    
                </div>

                <!-- Sign Up button -->
                <div class="mt-4">
                    <button class="bg-[#FFAC00] w-full rounded-full px-4 py-2 text-sm font-bold flex justify-center items-center gap-2">Log In
                        <span><Arrow/></span>
                    </button>
                </div>
            </form>
        </div>

        <!-- Intro Sections -->
        <div></div>
    </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref } from 'vue';

const email = ref('')
const password = ref('')

const passwordInput = ref(null);
let isVisible = false;
function togglePassword() {
  if (passwordInput.value) {
    passwordInput.value.type = isVisible ? 'password' : 'text';
    isVisible = !isVisible;
  }
  console.log('EXECUTING')
}

async function submit() {
    try {
        console.log('Submitting form with:', { email: email.value, password: password.value });
        
        const response = await $fetch('/api/login', {
            method: 'POST',
            body: {
                email: email.value,
                password: password.value
            },
        });
         
        console.log('Response from server:', response);
        
        const result = await Swal.fire({
            title: 'Success!',
            text: 'Logged In successfully',
            icon: 'success',
            confirmButtonText: 'Close'
        });

        await navigateTo('/',{replace: true})
    } catch (error) {
        console.error('Error details:', error);
        Swal.fire({
            title: 'Error!',
            text: error.message || 'An error occurred',
            icon: 'error',
            confirmButtonText: 'Close'
        })
    }
}
</script>