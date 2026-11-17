<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="site-name" to="/">My Tasks</RouterLink>
      <nav aria-label="Main navigation">
        <RouterLink to="/" exact-active-class="active-link">Tasks</RouterLink>
        <RouterLink to="/about" active-class="active-link">About</RouterLink>
      </nav>
    </header>
    <RouterView />
  </div>
</template>
