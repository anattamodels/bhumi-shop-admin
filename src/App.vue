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
  background: #0c0104;
}

:root {
  --bg-primary: #0c0104;
  --bg-secondary: #1a0510;
  --bg-card: #250816;
  
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
