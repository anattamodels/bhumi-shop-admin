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
  background: #806e84;
}

:root {
  --bg-primary: #806e84;
  --bg-secondary: #6b5c70;
  --bg-card: #5a4d5e;
  
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
