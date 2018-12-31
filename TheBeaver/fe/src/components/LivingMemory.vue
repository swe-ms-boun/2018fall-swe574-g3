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
        <li class="memoryCell" v-for="memory in memories" :key="memory.id">
          <p class="title">{{ memory.title }}</p>
          <p class="description">{{ memory.description }}<br>
            <br>
            Username: {{ memory.username }}
            <br>
            <samp style="font-family:Avenir;"> Location: {{ memory.location }} </samp>
            <br>
            <tt style="font-family:Avenir;">People: {{ memory.taggedPeople }}</tt>
            <br>
            Public: {{memory.isPublic}}
            </p>
          <div class="thumbnail">
            <img :src="memory.imgUrl"/>
          </div>
          <router-link class="view-annotations"
                       :to="{ name: 'Memory', params: { id: memory.id }}">View annotations
          </router-link>
          <br>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LivingMemory',
  // Variables here
  data() {
    return {
      memories: [],
      filteredMemories: [],
      searchedKeyword: '',
      baseURL: 'http://localhost:3001',
    };
  },

  // Setters here
  watch: {
    /* eslint-disable */

  },

  // On Create here
  async created() {

  },

  // Methods here
  methods: {

    async filterSearch(keyword) {

      this.memories = [];
      await axios.get(`${this.baseURL}/memories`)
        .then((res) => {
          res.data.forEach((memory) => {
              this.memories.push({
                title: memory.title,
                description: memory.description,
                location: memory.location,
                taggedPeople: memory.taggedPeople,
                username: memory.username,
                isPublic: memory.isPublic,
                imgUrl: memory.imgUrl,
                id: memory._id,
              })
          })
       })
      // this.filteredMemories = this.memories.filter(memory =>
      //   memory.title.toLowerCase().includes(keyword.toLowerCase()))
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

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
  background-color: #fffdea36 !important;
  grid-template: " .          .                 .              .                      " 1fr
                 " thumbnail  title             title          .                      " auto
                 " thumbnail  description       description    .                      " auto
                 " thumbnail  .                 .              view-annotations       " 1fr
                 / auto       1fr               auto           auto;
  text-align: left;
  box-shadow: 3px 3px #0000001c;
}

.thumbnail img {
  width: 20vw;
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
  font-weight: bold;
}
.view-annotations {
  grid-area: view-annotations;
  margin-top: 24px;
}

.description {
  grid-area: description;
  margin-top: 24px;
}
.username {
  grid-row-start: username;
  margin-top: 24px;

}
.isPublic {
  grid-area: description;
  margin-top: 24px;
}
.searchBar {
  grid-area: searchBar;
  margin-top: 24px
}

</style>
