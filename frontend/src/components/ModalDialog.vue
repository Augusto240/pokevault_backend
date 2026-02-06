<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <!-- Modal -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-100">
        <!-- Color bar -->
        <div class="h-1 w-full bg-gradient-to-r from-pokered via-pokeyellow to-pokeblue rounded-t-2xl"></div>
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 class="text-lg font-semibold text-slate-800">{{ title }}</h3>
          <button @click="$emit('close')" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Body -->
        <div class="p-6">
          <slot />
        </div>
        
        <!-- Footer -->
        <div v-if="$slots.footer" class="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps({
  show: Boolean,
  title: { type: String, default: '' },
})

defineEmits(['close'])
</script>
