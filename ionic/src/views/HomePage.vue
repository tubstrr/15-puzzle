<script setup>
import { ref } from 'vue';
import { SafeArea } from 'capacitor-plugin-safe-area';


const safeArea = ref({ top: 0, right: 0, bottom: 0, left: 0 });

SafeArea.getSafeAreaInsets().then(({ insets }) => {
  safeArea.value = insets;
});
</script>

<template>
  <ion-page>
    <div class="ion-padding">
      <pre>{{ safeArea }}</pre>
      <iframe :src="`https://15-puzzle.jonknoll.dev/play?pt=${safeArea.top}`"></iframe>
      <!-- <iframe src="https://15-puzzle.jonknoll.dev/play"></iframe> -->
    </div>
  </ion-page>
</template>

<style scoped>
iframe {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
