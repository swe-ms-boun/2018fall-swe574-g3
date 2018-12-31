<template>
  <div
    v-if="showRect"
    class="annotation-rect"
    :style="positionStyles">
  </div>
</template>

<script>
export default {
  name: 'AnnotationRect',
  props: {
    position: {
      type: Object,
      required: true,
    },
  },
  computed: {
    showRect() {
      return Object.values(this.position).every(value => value || value === 0);
    },
    positionStyles() {
      return {
        left: `${this.position.x}px`,
        top: `${this.position.y}px`,
        width: `${this.position.width}px`,
        height: `${this.position.height}px`,
      };
    },
  },
};


</script>

<style lang="scss" scoped>

.annotation-rect {
  position: absolute;
  pointer-events: none;
  border: 2px dashed rgba(255, 255, 255, 0.911);
  background-color: rgba(25, 32, 34, 0.486);
}
</style>

