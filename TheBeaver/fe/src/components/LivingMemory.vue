<template>
  <div id="LivingMemory">
    <div class="memories">
      <ul class="memoryList" id="memoryList">
        <li class="memoryCell" v-for="memory in memories" :key="memory">
          <p class="title">{{ memory.title }}</p>
          <p class="description">{{ memory.description }}</p>
          <div class="thumbnail">
            <img src="../assets/thumb1.jpg"/>
          </div>
          <br>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LivingMemory',
  // Variables here
  data() {
    return {
      memories: [],
    };
  },

  // Setters here
  watch: {
    /* eslint-disable */
    memories: function() {

    }
  },

  // On Create here
  created() {
    const memories = [{ title: 'Deneme1', 
                        description: 'Whish we could turn back time. To the gold old days' }, 
                      { title: 'Deneme2',
                        description: 'When our momma sang us to sleep but now we’re stressed out' }]
    this.fillMemories(memories);
  },

  // Methods here
  methods: {
    fillMemories(exampleMemories) {
      this.memories = exampleMemories
    }
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#LivingMemory {
  display: grid;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;

  grid-template: 1fr / 1fr;
  grid-template-areas:
    "memories"
}

.memories {
  display: grid;
  justify-content: center;
  align-items: center;
  grid-area: memories;
  grid-template:  " memoryList " auto
                  / 1fr;
}

.memoryList {
  display: grid;
  grid-area: memoryList;
  grid-auto-rows: auto;
  grid-gap: 20px;
}

ul.memoryList li {
  margin-left: 32px;
  margin-right: 32px;
  padding: 8px;
  background-color: #fff;
}

ul.memoryList li p { margin: 24px; display: block; width: 100%; height: 100%; }

.memoryCell {
  display: grid;
  grid-template: " thumbnail  title       " auto
                 " thumbnail  description " auto
                 / auto       1fr;
  text-align: left;
}

.thumbnail img {
  width: 128px;
  height: auto;
  margin: 24px;
}

.thumbnail {
  grid-area: thumbnail;
  overflow: hidden;
  object-fit: cover;
 }

.title {
  grid-area: title;
}

.description {
  grid-area: description;
  margin-left: 24px;
  margin-top: 24px;

}

</style>
