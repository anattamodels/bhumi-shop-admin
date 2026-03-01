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
  background: #0a0a0a;
}

:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a2e;
  --bg-card: #12121f;
  
  --accent-purple: #7B2CBF;
  --accent-purple-light: #9D4EDD;
  --accent-purple-dark: #5a1f8c;
  --accent-green: #00FF41;
  --accent-green-dark: #00CC33;
  --accent-green-glow: rgba(0, 255, 65, 0.3);
  
  --text-primary: #FFFFFF;
  --text-secondary: #B8B8B8;
  --text-muted: #6B6B6B;
  
  --border-color: #2a2a4a;
}
</style>
