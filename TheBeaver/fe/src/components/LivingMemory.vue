<template>
  <div id="LivingMemory">
    <div class="searchBar">
      <b-input-group size="lg" class="mb-3">
        <b-form-input v-model="searchedKeyword"
                      type="text"
                      placeholder="Beaver for memories">
        </b-form-input>
        <b-btn size="lg" variant="success" v-on:click="filterSearch(searchedKeyword)">Go!</b-btn>
      </b-input-group>
    </div>
    <div class="memories">
      <ul class="memoryList" id="memoryList">
        <li class="memoryCell" v-for="memory in filteredMemories" :key="memory.id">
          <p class="title">{{ memory.title }}</p>
          <div class="description">
            {{ memory.description }}
            <br>
            <br>
            <div v-if="memory.username">
              Author: {{ memory.username }}
            </div>
            <div v-if="memory.taggedPeople">
              People: {{ memory.taggedPeople }}
            </div>
            <div v-if="memory.date">
              Date: {{ getMemoryDate(memory.date)}}
            </div>
            <div v-if="memory.location">
              Location: {{memory.location}}
            </div>
          </div>
          <div class="thumbnail">
             <img v-if="memory.imgUrl" :src="memory.imgUrl"/>
            <img v-else src= "http://savings.gov.pk/wp-content/plugins/ldd-directory-lite/public/images/noimage.png"/>
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
      searchedKeyword: '',
      baseURL: 'https://beaver-memories.now.sh',
    };
  },

  created() {
    this.filterSearch();
  },

  // Setters here
  computed: {
    filteredMemories() {
      return this.memories.filter(memory =>
        JSON.stringify(memory).toLowerCase().includes(this.searchedKeyword.toLowerCase()));
    },

  },

  // Methods here
  methods: {

    async filterSearch() {
      this.memories = [];
      await axios.get(`${this.baseURL}/memories`)
        .then((res) => {
          res.data.forEach((memory) => {
            this.memories.push({
              title: memory.title,
              description: memory.description,
              location: memory.location,
              coords: memory.coords,
              taggedPeople: memory.taggedPeople,
              username: memory.username,
              isPublic: memory.isPublic,
              date: memory.date,
              imgUrl: memory.imgUrl,
              // eslint-disable-next-line
              id: memory._id,
            });
          });
        });
    },

    getMemoryDate(date) {
      let a = '';
      if (!date.year && date.decade) {
        a = `${date.decade}s`;
        return a;
      }

      if (date.year) {
        a = date.year;
      }

      if (date.month && date.year) {
        a = `${date.month} ${a}`;
      }

      if (date.day && date.month && date.year) {
        a = `${date.month} ${date.day}th, ${date.year}`;
      }

      if (date.day && date.month && date.year && date.time) {
        a = `${date.time}, ${date.month} ${date.day}th, ${date.year}`;
      }
      return a;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#LivingMemory {
  display: grid;
  background-image: linear-gradient(to top,#f7e3d888 , #ced7f088);
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
  background-color: #ffffffbb !important;
  grid-template: " .          .                 .              .                      " 36px
                 " thumbnail  title             title          .                      " auto
                 " thumbnail  description       description    .                      " auto
                " thumbnail   .                 .              view-annotations       " 1fr
                 / auto       1fr               auto           auto;
  text-align: left;
  box-shadow: 8px 8px #00000017;
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
  font-weight: bold;
  color: #219c69;
}

.description {
  grid-area: description;
  margin-top: 24px;
}
.username {
  grid-row-start: username;
  margin-top: 24px;

}
.location {
  grid-area: location;
  margin-top: 24px;
}
.searchBar {
  grid-area: searchBar;
  margin-top: 24px
}

</style>
