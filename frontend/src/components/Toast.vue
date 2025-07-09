<template>
  <transition name="slide-fade">
    <div
      v-if="visible"
      class="fixed bottom-6 right-6 bg-sky-600 text-white px-4 py-2 rounded shadow-lg z-60 select-none pointer-events-auto"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: Boolean,
  message: String,
})
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
