<template>
    <div style="position: relative">
        <img :src="imgUrl"
          class="IMAGE"
          ref="image"
          @dragstart.prevent
          @mousedown="mousedownHandler"
          @mousemove="mousemoveHandler"
          @mouseup="mouseupHandler"
          @load="$emit('photo-loaded')">
        <slot/>
    </div>
</template>


<script>

export default {
  name: 'MemoryImg',
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
      const boundingRect = this.$refs.image.getBoundingClientRect();
      const imageHeight = boundingRect.height;
      const imageWidth = boundingRect.width;

      return {
        width: Math.abs(startX - endX) / imageWidth,
        x: Math.min(startX, endX) / imageWidth,
        height: Math.abs(startY - endY) / imageHeight,
        y: Math.min(startY, endY) / imageHeight,
      };
    },
  },
  methods: {
    mousedownHandler(event) {
      const { offsetX, offsetY } = event;
      this.isTracking = true;
      this.endX = undefined;
      this.endY = undefined;
      this.startX = offsetX;
      this.startY = offsetY;
    },
    mousemoveHandler(event) {
      if (this.isTracking) {
        const { offsetX, offsetY } = event;
        this.endX = offsetX;
        this.endY = offsetY;
        this.updateRect();
      }
    },
    mouseupHandler(event) {
      const { offsetX, offsetY } = event;
      this.isTracking = false;
      this.endX = offsetX;
      this.endY = offsetY;
      this.updateRect();
    },
    updateRect() {
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
