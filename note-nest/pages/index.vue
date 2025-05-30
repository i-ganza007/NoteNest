<template>
    <div class="bg-zinc-900 h-full flex">
        <!-- Side component -->
        <div class="bg-black w-[338px] p-8">
            <Logo/>

            <div>
                <p class="text-xs font-bold text-[#C2C2C5] mt-12 mb-4">Today</p>
                <div class="ml-2" v-for="note in todaysNotes" :key="note">
                    <Preview :title="`${note.text.slice(0,40)}`" :day="`${new Date(note.updatedAt).toDateString() === new Date().toDateString() ? 'Today' : new Date(note.updatedAt).toLocaleDateString()}`" :preview="`...${note.text.slice(40,90)}`" :class="{'bg-[#A1842C]':note.id === selectedNote.id ,'hover:bg-[#A1842C]/25 cursor-pointer':note.id !== selectedNote.id}" @click="selectedNote = note"/>
                    <!-- <Preview :title="'Just finished reading...'" :day="'Today'" :preview="'The Midnight Library...'"/>
                    <Preview :title="'Just finished reading...'" :day="'Today'" :preview="'The Midnight Library...'"/> -->
                </div>
            </div>
            

            <!-- Yesterday Notes -->
           <div>
                <p class="text-xs font-bold text-[#C2C2C5] mt-12 mb-4">Yesterday</p>
                <div class="ml-2" v-for="note in yesterdayNotes" :key="note">
                    <Preview :title="`${note.text.slice(0,40)}`" :day="`${new Date(note.updatedAt).toDateString() === new Date().toDateString() ? 'Today' : new Date(note.updatedAt).toLocaleDateString()}`" :preview="`...${note.text.slice(40,90)}`" :class="{'bg-[#A1842C]':note.id === selectedNote.id ,'hover:bg-[#A1842C]/25 cursor-pointer':note.id !== selectedNote.id}" @click="selectedNote = note"/>
                    <!-- <Preview :title="'Just finished reading...'" :day="'Today'" :preview="'The Midnight Library...'"/>
                    <Preview :title="'Just finished reading...'" :day="'Today'" :preview="'The Midnight Library...'"/> -->
                </div>
            </div>

            <div>
                <p class="text-xs font-bold text-[#C2C2C5] mt-12 mb-4">Earlier</p>
                <div class="ml-2" v-for="note in earlierNotes" :key="note">
                    <Preview :title="`${note.text.slice(0,40)}`" :day="`${new Date(note.updatedAt).toDateString() === new Date().toDateString() ? 'Today' : new Date(note.updatedAt).toLocaleDateString()}`" :preview="`...${note.text.slice(40,90)}`" :class="{'bg-[#A1842C]':note.id === selectedNote.id ,'hover:bg-[#A1842C]/25 cursor-pointer':note.id !== selectedNote.id}" @click="selectedNote = note"/>
                    <!-- <Preview :title="'Just finished reading...'" :day="'Today'" :preview="'The Midnight Library...'"/>
                    <Preview :title="'Just finished reading...'" :day="'Today'" :preview="'The Midnight Library...'"/> -->
                </div>
            </div>

            

        </div>

        <!-- Intro Sections -->
        <div class="w-full">
            <div class="flex justify-between w-full items-start p-8">

                <button class="text-xs text-[#C2C2C5] inline-flex items-center space-x-2 hover:text-white hover:font-bold">
                    <Creation/>
                    <span>
                        Create Note
                    </span></button>
                <button> <Trash class="text-[#6D6D73] hover:text-white hover:font-bold"/> </button>
            </div>

            <div class="max-w-[560px] mx-auto">
                <p class="text-[#929292]">{{new Date(selectedNote.updatedAt).toLocaleDateString()}}</p>
                
                <p class="text-[#D4D4D4] my-4 font-playfair" v-text="selectedNote.text">
                    
                </p>
            </div>
        </div>

        
    </div>
</template>

<script setup>
import { onMounted , ref , computed } from "vue"
import dayjs from 'dayjs'
const selectedNote = ref({})

definePageMeta({
    middleware:['auth']
})

const notes = ref([])



onMounted(async ()=>{
    notes.value = await $fetch('/api/notes')
    if(notes.value.length > 0) selectedNote.value = notes.value[0]
    console.log(res)
})

const todaysNotes = computed(() => {
  return notes.value.filter(note => {
    return dayjs(note.updatedAt.replace(' ', 'T')).isSame(dayjs(), 'day')
  })
})

const yesterdayNotes = computed(()=>{
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return notes.value.filter(note =>{
        const noteDate = new Date(note.updatedAt)
        return noteDate.toDateString() === yesterday.toDateString()
    })
})

const earlierNotes = computed(()=>{
    return notes.value.filter((x)=>{
        return !yesterdayNotes.value.includes(x) && !todaysNotes.value.includes(x)
    })
})
console.log(earlierNotes)
</script>
