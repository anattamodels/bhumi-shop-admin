<template>
  <div class="admin-app">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: #061613;
}

:root {
  --bg-primary: #061613;
  --bg-secondary: #0a211c;
  --bg-card: #0e2b25;
  
  --accent-purple: #7B2CBF;
  --accent-purple-light: #9D4EDD;
  --accent-purple-dark: #5a1f8c;
  --accent-green: #00FF41;
  --accent-green-dark: #00CC33;
  --accent-green-glow: rgba(0, 255, 65, 0.3);
  
  --text-primary: #00FF41;
  --text-secondary: #00FF41;
  --text-muted: #00CC33;
  
  --border-color: #2a2a4a;
}
</style>
