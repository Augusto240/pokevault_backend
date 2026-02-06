<template>
  <div
    :class="[
      'inline-flex items-center justify-center flex-shrink-0 overflow-hidden',
      rounded ? 'rounded-xl' : 'rounded-lg',
      bgClass,
      sizeClasses
    ]"
    :style="bgStyle"
  >
    <img
      v-if="spriteUrl"
      :src="spriteUrl"
      :alt="name"
      :class="['object-contain image-pixelated drop-shadow-sm', imgSizeClasses]"
      loading="lazy"
      @error="handleError"
    />
    <span v-else :class="['font-bold text-gray-400', fallbackTextClass]">?</span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getItemSprite, getCategorySprite, getFallbackSprite } from '../utils/sprites'

const props = defineProps({
  name: { type: String, default: '' },
  type: { type: String, default: 'item' }, // 'item' | 'category'
  size: { type: String, default: 'md' }, // 'sm' | 'md' | 'lg' | 'xl'
  bgClass: { type: String, default: '' },
  rounded: { type: Boolean, default: false },
  showFallback: { type: Boolean, default: true },
})

const hasError = ref(false)

const spriteUrl = computed(() => {
  if (hasError.value) return null
  const fn = props.type === 'category' ? getCategorySprite : getItemSprite
  const url = fn(props.name)
  if (url) return url
  return props.showFallback ? getFallbackSprite() : null
})

const bgStyle = computed(() => {
  if (props.bgClass) return {}
  return { background: 'linear-gradient(135deg, rgba(30,64,175,.06), rgba(220,38,38,.06))' }
})

const sizeClasses = computed(() => {
  const map = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }
  return map[props.size] || map.md
})

const imgSizeClasses = computed(() => {
  const map = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  }
  return map[props.size] || map.md
})

const fallbackTextClass = computed(() => {
  const map = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-2xl',
  }
  return map[props.size] || map.md
})

function handleError() {
  hasError.value = true
}
</script>
