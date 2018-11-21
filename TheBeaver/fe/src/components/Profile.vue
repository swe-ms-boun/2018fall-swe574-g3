<template>
  <div id="Profile">
    <div class="postMemory">
      <div class="inputText">
        <div class="thumbnail">
            <img src="../assets/thumb1.jpg"/>
        </div>
        <b-form-input class="editTitle"
                      type="text"
                      v-model="title"
                      placeholder="Enter a title"/>
        <b-form-textarea class="editDescription"
                      type="text"
                      v-model="message"
                      placeholder="Enter your memory..."/>
      </div>
      <b-button class="postButton" v-on:click="postMemory">POST</b-button>
    </div>
    <div class="memories">
      <ul class="memoryList" id="memoryList">
        <li class="memoryCell" v-for="memory in memories" :key="memory.id">
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

import axios from 'axios';

export default {

  name: 'Profile',
  // Variables here
  data() {
    return {
      memories: [],
      searchedKeyword: '',
      uploadedImage: 'http://img1.vued.vanthink.cn/vued0a233185b6027244f9d43e653227439a.png',
      message: '',
      title: '',
      baseURL: 'http://localhost:3001',
    };
  },

  // Setters here
  watch: {
    /* eslint-disable */
  },

  // On Create here
  async created() {
    await this.getAllMemories();
  },

  // Methods here
  methods: {

    async getAllMemories() {
      this.memories = [];
      await axios.get(`${this.baseURL}/memories`).then((res) => {
       res.data.forEach((memory) => {
          this.memories.push({
            description: memory.description,
            title: memory.title,
          })
       })
     });
    },

    async postMemory() {
      console.log(this.message);
      await axios.post(`${this.baseURL}/postMemory`,{
         description: this.message,
         title: this.title,
      })
          .then(async (response) => {
            console.log(response);
            debugger;
            this.getAllMemories();
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#Profile {
  display: grid;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  grid-template:  ". postMemory ."  auto
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
  background-color: rgb(240, 240, 240) !important;
  display: grid;
  grid-template: " thumbnail  title       " auto
                 " thumbnail  description " auto
                 / auto       1fr;
  text-align: left;
}

.thumbnail img {
  width: 256px;
  height: auto;
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

.inputText {
  grid-area: inputText;
  margin-top: 24px;
  display: grid;
  grid-template: " thumbnail  editTitle       " 20%
                 " thumbnail  editDescription " auto
                 / 256px       auto;
  margin-bottom: 48px;
}

.postMemory {
  grid-area: postMemory;
  margin-top: 24px;
  display: grid;
  grid-template: " inputText  inputText     " auto
                 " .          postButton    " auto
                 / auto       128px;
  margin-bottom: 48px;
}

.postButton {
  grid-area: postButton;
}

.editTitle {
  grid-area: editTitle;
  margin: 24px;
}

.editDescription {
  grid-area: editDescription;
  margin: 24px;

}
</style>
