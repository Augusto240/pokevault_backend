<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ title }}</p>
        <div class="mt-2">
          <span v-if="loading" class="inline-block w-16 h-8 bg-gray-100 rounded animate-pulse"></span>
          <span v-else class="text-3xl font-bold text-gray-900">{{ value }}</span>
        </div>
        <p class="text-xs text-gray-400 mt-1">{{ subtitle }}</p>
      </div>
      <div :class="[
        'w-12 h-12 rounded-xl flex items-center justify-center',
        colorClasses.bg,
        pulse ? 'pulse-danger' : ''
      ]">
        <!-- Cube icon -->
        <svg v-if="icon === 'cube'" :class="['w-6 h-6', colorClasses.text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <!-- Alert icon -->
        <svg v-else-if="icon === 'alert'" :class="['w-6 h-6', colorClasses.text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <!-- Arrows icon -->
        <svg v-else-if="icon === 'arrows'" :class="['w-6 h-6', colorClasses.text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
        </svg>
        <!-- Tag icon -->
        <svg v-else-if="icon === 'tag'" :class="['w-6 h-6', colorClasses.text]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: [Number, String],
  subtitle: String,
  icon: String,
  color: { type: String, default: 'blue' },
  loading: Boolean,
  pulse: Boolean,
})

const colorClasses = computed(() => {
  const map = {
    blue: { bg: 'bg-blue-50', text: 'text-pokeblue' },
    red: { bg: 'bg-red-50', text: 'text-pokered' },
    yellow: { bg: 'bg-yellow-50', text: 'text-pokeyellow' },
    green: { bg: 'bg-green-50', text: 'text-success' },
  }
  return map[props.color] || map.blue
})
</script>
