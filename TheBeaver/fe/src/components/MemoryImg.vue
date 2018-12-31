<template>
    <div>
        <img :src="imgUrl"
        class="IMAGE"
        @dragstart.prevent
        @mousedown="mousedownHandler"
        @mousemove="mousemoveHandler"
        @mouseup="mouseupHandler">
        <annotation-rect :position="annotationRectangle"></annotation-rect>
    </div>
</template>


<script>

import AnnotationRect from './AnnotationRect.vue';

export default {
  name: 'MemoryImg',

  components: {
    AnnotationRect,
  },
  // Variables here
  data() {
    return {
      isTracking: false,
      startX: undefined,
      startY: undefined,
      endX: undefined,
      endY: undefined,
    };
  },
  props: {
    imgUrl: {
      type: String,
      required: true,
    },
  },

  computed: {
    annotationRectangle() {
      const {
        startX, startY, endX, endY,
      } = this;

      return {
        width: Math.abs(startX - endX),
        height: Math.abs(startY - endY),
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
      };
    },
  },
  methods: {
    mousedownHandler(event) {
      const { clientX, clientY } = event;
      this.isTracking = true;
      this.endX = undefined;
      this.endY = undefined;
      this.startX = clientX;
      this.startY = clientY;
    },
    mousemoveHandler(event) {
      if (this.isTracking) {
        const { clientX, clientY } = event;
        this.endX = clientX;
        this.endY = clientY;
      }
    },
    mouseupHandler(event) {
      const { clientX, clientY } = event;
      this.isTracking = false;
      this.endX = clientX;
      this.endY = clientY;
      this.$emit('anno-rect-changed', this.annotationRectangle);
    },
  },
};

</script>

<style lang="scss" scoped>

.IMAGE {
  position: relative;
  user-select: none;
  background-repeat: no-repeat;
  width: 25vw;
  height: auto;
}

</style>
