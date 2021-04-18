<template>
  <div class="accueil">
    <div class="div-image-fond-café">
      <img
        src="@/assets/images/fond-café.jpg"
        alt="Image Page Accueil Toccatech"
        class="image-fond-café"
      />
      <Container grand>
        <h1 class="titre">Bienvenue au coeur de l'aventure musicale !</h1>
        <Bouton class="teal" grand>C'est parti</Bouton>
      </Container>
    </div>
    <div class="connexion-inscription" :class="$grid.breakpoint">
      <FormulaireInscription />
      <FormulaireConnexion />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FormulaireConnexion from "@/components/layouts/accounts/FormulaireConnexion.vue";
import FormulaireInscription from "@/components/layouts/accounts/FormulaireInscription.vue";
import Bouton from "@/components/ui-components/Bouton.vue";
import Container from "@/components/ui-components/Container.vue";

export default defineComponent({
  components: {
    FormulaireConnexion,
    FormulaireInscription,
    Bouton,
    Container,
  },
});
</script>

<style lang="scss">
.accueil {
  .titre {
    font-size: 63px;
    color: #4db6ac;
    font-weight: 400;
    margin-bottom: 30px;
  }

  .div-image-fond-café {
    // background-image: url("~@/assets/images/fond-café.jpg");
    height: 500px;
    text-align: center;
    padding-top: 100px;
    overflow: hidden;
    position: relative;
  }

  .image-fond-café {
    position: absolute;
    top: 0;
    left: 0;
    height: auto;
    width: 100%;
    z-index: -1;
  }

  .connexion-inscription {
    display: flex;

    &.xs,
    &.sm {
      flex-direction: column;

      & > div {
        width: 100%;
      }
    }

    &.md,
    &.lg,
    &.xl {
      & > div {
        flex-grow: 1;
        width: 50%;
      }
    }
  }
}
</style>
