<template>
  <div id="LivingMemory">
    <div class="searchBar">
      <b-input-group size="lg" class="mb-3">
        <b-form-input v-model="searchedKeyword"
                      type="text"
                      placeholder="Beaver for anything">
        </b-form-input>
        <b-btn size="lg" variant="success" v-on:click="filterSearch(searchedKeyword)">Go!</b-btn>
      </b-input-group>
    </div>
    <div class="memories">
      <ul class="memoryList" id="memoryList">
        <li class="memoryCell" v-for="memory in filteredMemories" :key="memory.id">
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
      filteredMemories: [],
      searchedKeyword: '',
    };
  },

  // Setters here
  watch: {
    /* eslint-disable */
    filteredMemories: function() {

    }
  },

  // On Create here
  created() {
    const memories = [{ id: 1,
                        title: 'Deneme1', 
                        description: 'Whish we could turn back time. To the gold old days' }, 
                      { id: 2,
                        title: 'Deneme2',
                        description: 'When our momma sang us to sleep but now we’re stressed out' }]
    this.fillMemories(memories);
  },

  // Methods here
  methods: {
    fillMemories(exampleMemories) {
      this.memories = exampleMemories
    },

    filterSearch(keyword) {
      this.filteredMemories = this.memories.filter(memory => 
        memory.title.toLowerCase().includes(keyword.toLowerCase()))
      console.log(this.filteredMemories);
    },
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
  grid-template:  ". searchBar ."  auto
                  ". memories  ."  auto
                  / 13% 1fr 13%;
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
  padding: 8px;
  background-color: #ffffff00;
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
  margin-top: 24px;
}

.searchBar {
  grid-area: searchBar;
  margin-top: 24px
}

</style>
