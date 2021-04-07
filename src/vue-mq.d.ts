// Ce fichier permet le support de TypeScript avec Vue MQ
// Source : https://github.com/AlexandreBonaventure/vue-mq/issues/16#issuecomment-576174407

declare module "vue-mq" {
  import { PluginObject } from "vue";
  interface VueMq extends PluginObject<any> {
    VueMq: VueMq;
  }
  const VueMq: VueMq;
  export default VueMq;
}
