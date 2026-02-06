<template>
  <div class="card-pokemon p-5">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{{ title }}</p>
        <div class="mt-2">
          <span v-if="loading" class="inline-block w-16 h-8 shimmer rounded-lg"></span>
          <span v-else class="text-3xl font-bold text-slate-900">{{ value }}</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-1.5">{{ subtitle }}</p>
      </div>
      <div :class="[
        'w-12 h-12 rounded-xl flex items-center justify-center',
        bgColor,
        pulse ? 'pulse-danger' : ''
      ]">
        <img
          v-if="sprite"
          :src="sprite"
          :alt="title"
          class="w-7 h-7 image-pixelated drop-shadow-sm"
          loading="lazy"
        />
        <component v-else :is="iconComponent" :class="['w-6 h-6', textColor]" v-if="iconComponent" />
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
  sprite: { type: String, default: '' },
  color: { type: String, default: 'blue' },
  loading: Boolean,
  pulse: Boolean,
})

const bgColor = computed(() => {
  const map = {
    blue: 'bg-blue-50',
    red: 'bg-red-50',
    yellow: 'bg-amber-50',
    green: 'bg-emerald-50',
    purple: 'bg-purple-50',
  }
  return map[props.color] || map.blue
})

const textColor = computed(() => {
  const map = {
    blue: 'text-pokeblue',
    red: 'text-pokered',
    yellow: 'text-pokeyellow',
    green: 'text-success',
    purple: 'text-purple-600',
  }
  return map[props.color] || map.blue
})
</script>
