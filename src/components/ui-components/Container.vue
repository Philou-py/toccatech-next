<template>
  <div class="container" :class="[$mq, { grand: grand }, { petit: petit }]">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    grand: {
      type: Boolean,
      default: false,
    },

    petit: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss">
.container {
  &.xs {
    padding: 0 3%;
  }

  &.sm {
    padding: 0 5%;
  }

  &.md {
    padding: 0 10%;
  }

  &.lg {
    padding: 0 13%;
  }

  &.xl {
    padding: 0 18%;
  }
}

.container.grand {
  &.xs {
    padding: 0 5%;
  }

  &.sm {
    padding: 0 10%;
  }

  &.md {
    padding: 0 15%;
  }

  &.lg {
    padding: 0 20%;
  }

  &.xl {
    padding: 0 25%;
  }
}

.container.petit {
  padding: 0 20px;
}
</style>
