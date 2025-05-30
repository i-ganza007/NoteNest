<template>
   <div class="p-2 rounded-lg space-y-2">
        <h3 class="text-sm font-bold text-[#F4F4F5] truncate">
            {{title}}
        </h3>
        <div class="leading-snug">
                <span class="text-xs text-[#F4F4F5] mr-4">{{day}}</span>
                <span class="text-xs text-[#D6D6D6]">{{preview}}</span>
        </div>
    </div>
</template>
<script setup>
import {defineProps,  ref } from 'vue'
defineProps({
    title:{
        type:String,
        required:true
    },
    day:{
        type:String,
        required:true
    },
    preview:{
        type:String,
        required:true
    },
    
    },
)
</script>
