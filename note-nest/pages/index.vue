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
        <div class="w-full flex flex-col">
            <div class="flex justify-between w-full items-start p-8">

                <button class="text-xs text-[#C2C2C5] inline-flex items-center space-x-2 hover:text-white hover:font-bold" @click="createNewNote">
                    <Creation/>
                    <span>
                        Create Note
                    </span></button>
                <button> <Trash class="text-[#6D6D73] hover:text-white hover:font-bold" @click="deleteNote"/> </button>
            </div>

            <div class="max-w-[560px] mx-auto w-full flex-grow flex flex-col">
                <p class="text-[#929292]">{{new Date(selectedNote.updatedAt).toLocaleDateString()}}</p>
                <textarea name="note" id="note" cols="30" rows="10" class="w-full bg-transparent focus:outline-none text-white flex-grow" v-model="updatedNote" @input="debouncedFn" ref='textarea'>
                
                </textarea>
            </div>

            <button class="text-zinc-500 hover:text-white text-sm font-bold absolute right-0 bottom-0 p-8" @click="logout">Log Out</button>
        </div>

        
    </div>
</template>

<script setup>
import { onMounted , ref , computed} from "vue"
import dayjs from 'dayjs'
const textarea = ref(null)
const selectedNote = ref({})
const updatedNote = computed({ // Whenever a v-model or mirroring fails , opt to use computed properties
    get(){
        return selectedNote.value.text
    },
    set(val){
        if(selectedNote.value){
            selectedNote.value.text = val
        }
    }
})

function logout(){
    console.log('Helllloooo')
    // const jwtCookie = useCookie('NoteNest')
    // console.log(jwtCookie.value)
}

definePageMeta({
    middleware:['auth']
})

const notes = ref([])

const debouncedFn = useDebounceFn(async () => {
  await updateNote()
}, 1000)



async function createNewNote(){
    try{
        // console.log(updatedNote.value)
        const newNote = await $fetch(`/api/notes`,{
            method:'POST', // When changing only one column or thing 
        })
        // notes.value.unshift(newNote)
        // selectedNote.value = notes.value[0]
        // updatedNote.value = ''
        // console.log(`/api/notes/${selectedNote.value.id}`)
        textarea.value.focus()
        console.log('New note success')
    }
    catch(err){
        console.log(err)
    }
}




async function updateNote(){
    try{
        // console.log(updatedNote.value)
        await $fetch(`/api/notes/${selectedNote.value.id}`,{
            method:'PATCH', // When changing only one column or thing 
            body:{
                updatedNote:updatedNote.value
            }
        })
        // console.log(`/api/notes/${selectedNote.value.id}`)
    }
    catch(err){

    }
}


async function deleteNote(){
    try{
        await $fetch(`/api/notes/${selectedNote.value.id}`,{
            method:'DELETE',
            
        })
    }
    catch(err){
        console.log(err)
    }
}

// updateNote()
onMounted(async ()=>{
    notes.value = await $fetch('/api/notes')
    if(notes.value.length > 0) selectedNote.value = notes.value[0]
    // console.log(res)
    updatedNote.value = selectedNote.value.text
    textarea.value.focus()
})

const todaysNotes = computed(() => {
  return notes.value.filter(note => {
    return dayjs(note.updatedAt.replace(' ', 'T')).isSame(dayjs(), 'day')
  }).sort((a,b)=>new Date(b.updatedAt) - new Date(a.updatedAt))
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
