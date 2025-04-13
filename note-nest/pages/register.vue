<template>
    <div class="bg-black h-screen flex">
        <!-- Side component -->
        <div class="bg-zinc-900 w-[516px] p-8 flex flex-col justify-center">
            <Logo/>

            <h1 class="text-white text-lg font-bold text-lef mt-8">Sign up for a free account</h1>

            <p class="text-zinc-300 text-sm mt-0.5">Already registered?<span class="underline font-bold text-[#FFAC00]"> Log in </span>to your account</p>

            <form @submit.prevent="submit">
                <div class="mt-12 ">
                    <label for="email" class="text-white text-sm font-normal block text-zinc-300 mb-0.5">Email Address</label>

                    <input type="email" v-model="email" class="block w-full bg-[#27272A] border-[#3F3F46] rounded text-white px-4 py-2 placeholder:text-zinc-500 text-sm" placeholder="you@example.com">
                </div>

                <div class="mt-6">
                    <label for="password" class="text-white text-sm font-normal block text-zinc-300 mb-0.5">Password</label>

                    <input type="password" v-model="password" class="block w-full bg-[#27272A] border-[#3F3F46] rounded text-white px-4 py-2 placeholder:text-zinc-500 text-sm" placeholder="**********">
                </div>

                <!-- Sign Up button -->
                <div class="mt-4">
                    <button class="bg-[#FFAC00] w-full rounded-full px-4 py-2 text-sm font-bold flex justify-center items-center gap-2">Sign Up
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
import { ref } from 'vue';

const email = ref('')
const password = ref('')

async function submit() {
    try {
        console.log('Submitting form with:', { email: email.value, password: password.value });
        
        const response = await $fetch('/api/user', {
            method: 'POST',
            body: {
                email: email.value,
                password: password.value
            },
        });
        
        console.log('Response from server:', response);
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}
</script>