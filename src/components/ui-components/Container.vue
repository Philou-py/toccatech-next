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
    margin: 0 7%;
  }

  &.md {
    margin: 0 13%;
  }

  &.lg {
    margin: 0 20%;
  }

  &.xl {
    margin: 0 30%;
  }
}
</style>
