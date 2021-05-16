<template>
  <div class="sidebar">
    <transition name="transition-bg-sidebar">
      <div class="arrière-plan" @click.self="fermerSidebar" v-show="montrer">
        <transition name="transition-sidebar">
          <div class="contenu-sidebar" v-if="montrer">
            <router-link :to="{ name: 'Accueil' }" class="logo-toccatech" v-if="!cheminAvatar">
              <h3 class="titre">Toccatech</h3>
            </router-link>
            <div class="container-avatar" v-if="cheminAvatar">
              <img :src="cheminAvatar" alt="Avatar de l'utilisateur" />
            </div>
            <ul class="liste-navigation">
              <slot></slot>
            </ul>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    montrer: {
      type: Boolean,
      default: false,
    },
    cheminAvatar: String,
  },
  methods: {
    fermerSidebar() {
      this.$emit("fermeture");
    },
  },
});
</script>

<style lang="scss">
.sidebar {
  .arrière-plan {
    top: 0;
    position: fixed;
    background: rgba(#000, 0.5);
    width: 100%;
    height: 100%;
    z-index: 9999;
  }

  .contenu-sidebar {
    background-color: #d69c2f;
    height: 100%;
    width: 250px;
    padding: 20px 0;
    box-shadow: 5px 0 10px rgba(#d69c2f, 0.5);
  }

  .transition-bg-sidebar-enter,
  .transition-bg-sidebar-leave-to {
    opacity: 0;
  }

  .transition-bg-sidebar-enter-to,
  .transition-bg-sidebar-leave {
    opacity: 1;
  }

  .transition-bg-sidebar-enter-active,
  .transition-bg-sidebar-leave-active {
    transition: opacity 0.3s ease;
  }

  .logo-toccatech {
    display: block;
    text-decoration: none;
    color: inherit;
    margin-bottom: 10px;

    .titre {
      color: black;
      text-align: center;
    }
  }

  .transition-sidebar {
    &-enter,
    &-leave-to {
      transform: translateX(-250px);
    }

    &-enter-to,
    &-leave {
      transform: translateX(0);
    }

    &-enter-active,
    &-leave-active {
      transition: transform 0.3s ease;
    }
  }

  .container-avatar {
    width: 100%;
    height: 150px;
    padding: 5%;
    display: flex;
    justify-content: center;

    img {
      border-radius: 50%;
      padding: 2px;
      border: 2px solid #9e1030;
      height: 100%;
      width: auto;
    }
  }

  ul.liste-navigation {
    list-style-type: none;
    padding-left: 0;

    a {
      color: initial;
      padding: 8px 15px;
      width: 100%;
      height: 100%;
      display: block;
      text-decoration: none;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: rgba(#9e1030, 0.5);
      }

      &.désactivé {
        cursor: not-allowed;
      }
    }
  }
}
</style>
