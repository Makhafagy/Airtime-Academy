<template>
  <transition name="fade">
    <ConfirmModal v-if="visible" :visible="visible" :message="message" @confirm="confirm" @cancel="cancel" />
  </transition>

  <transition name="slide-fade">
    <Toast v-if="toastVisible" :visible="toastVisible" :message="toastMessage" />
  </transition>
</template>

<script setup>
import ConfirmModal from './ConfirmModal.vue'
import Toast from './Toast.vue'

const props = defineProps({
  visible: Boolean,
  message: String,
  toastMessage: String,
  toastVisible: Boolean,
})

const emit = defineEmits(['confirm', 'cancel'])

function confirm() {
  emit('confirm')
}

function cancel() {
  emit('cancel')
}
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide and fade transition for toast */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
