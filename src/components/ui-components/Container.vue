<template>
  <div class="container" :class="[$grid.breakpoint, { grand: grand }]">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    grand: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

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

.container.grand {
  &.xs {
    margin: 0 5%;
  }

  &.sm {
    margin: 0 10%;
  }

  &.md {
    margin: 0 15%;
  }

  &.lg {
    margin: 0 20%;
  }

  &.xl {
    margin: 0 25%;
  }
}
</style>
