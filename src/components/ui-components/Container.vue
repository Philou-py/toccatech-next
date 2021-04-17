<template>
  <div class="container" :class="$mq">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.container {
  &.xs {
    margin: 0 3%;
  }

  &.sm {
    margin: 0 5%;
  }

  &.md {
    margin: 0 10%;
  }

  &.lg {
    margin: 0 13%;
  }

  &.xl {
    margin: 0 18%;
  }
}
</style>
