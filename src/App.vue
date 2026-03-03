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
  background: #160103;
}

:root {
  --bg-primary: #160103;
  --bg-secondary: #1e0608;
  --bg-card: #280b0e;
  
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
