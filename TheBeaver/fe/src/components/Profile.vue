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
      <b-button class="postButton" variant="success" v-on:click="postMemory">POST</b-button>
    </div>
    <div class="memories">
      <ul class="memoryList" id="memoryList">
        <li class="memoryCell" v-for="memory in memories" :key="memory._id">
          <b-button class="deleteButton"
                    variant="danger"
                    @click="deleteMemory(memory.id)">X
          </b-button>
          <p class="title">{{ memory.title }}</p>
          <p class="description">{{ memory.description }}
            <br><br>
            Username: {{ memory.username }}
            <br>
            isPublic: {{ memory.isPublic }}
            <br>
            <a v-bind:href="'http://localhost:8003/post/'+memory.id" >View annotations..</a>
          </p>
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
      isPublic: '',
      username: '',
      baseURL: 'http://localhost:3001',
      secondaryURL : 'http://localhost:8003',
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
      await axios.get(`${this.baseURL}/memories`)
        .then((res) => {
          res.data.forEach((memory) => {
            this.memories.push({
              username: memory.username,
              description: memory.description,
              title: memory.title,
              isPublic: memory.isPublic,
              id: memory._id,
            })
          })
        });
    },

    async postMemory() {
      await axios.post(`${this.baseURL}/postMemory`,{
          description: this.message,
          title: this.title,
          username: JSON.parse(sessionStorage.getItem("vue-session-key")).session_username,
          isPublic: true
      })
        .then(async (response) => {
          this.getAllMemories();
        })
        .catch(function (error) {
          console.log(error);
        });
      },

    async deleteMemory(id) {
      axios.delete(`${this.baseURL}/deleteMemory`, { 
        data: {
          id: id
        }
      })
        .then(async (response) => {
          this.getAllMemories();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  }

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
}

ul.memoryList li p { margin: 24px; display: block; width: 100%; height: 100%; }

.memoryCell {
  background-color: #fffdea36 !important;
  display: grid;
  grid-template: " .          .           deleteButton " auto
                 " thumbnail  title       .            " auto
                 " thumbnail  description .            " 80%
                 / auto       1fr         auto;
  text-align: left;
  box-shadow: 3px 3px #0000001c;

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
  font-weight: bold;
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
}

.postMemory {
  grid-area: postMemory;
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

.deleteButton {
  grid-area: deleteButton;
}
</style>
