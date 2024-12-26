<template>
  <div
    class="loading"
    :class="$style.loading"
    :style="{ '--bg-color': bgColor ? String(bgColor) : '' }"
    @dblclick.stop
    v-if="modelValue"
  >
    <div :class="$style.progress" :style="{ '--percentage': progress + '%' }">
      <div :class="$style['bar-out']">
        <div :class="$style.bar"></div>
      </div>
      <div :class="$style.text">{{ progress }}%</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Props } from './index'

defineProps<Props>()

const modelValue = defineModel()
</script>

<style lang="scss" module>
@import './style.scss';
</style>
