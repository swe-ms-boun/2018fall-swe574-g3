<template>
  <div id="Profile">
    <div class="postMemory">
      <div class="inputText">
        <div class="thumbnail">
            <img :src= imgUrl style="width:230px; height:auto"/>
        </div>
        <b-form-input class="editTitle"
                      type="text"
                      v-model="title"
                      placeholder="Enter a title"/>
        <b-form-input class="editTaggedPeople"
                      type="text"
                      v-model="taggedPeople"
                      placeholder="Names to be tagged"/>
        <b-form-input class="editLocation"
                      type="text"
                      v-model="location"
                      placeholder="Enter a location"/>
        <b-form-input class="editImage"
                      type="text"
                      v-model="imgUrl"
                      placeholder="Image URL"/>
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
            <samp style="font-family:Avenir;"> Location: {{ memory.location }} </samp>
            <br>
            <tt style="font-family:Avenir;">People: {{ memory.taggedPeople }}</tt>
            <br>
            Public: {{ memory.isPublic }}
            <br>
          </p>
          <a class="view-annotations" v-bind:href="'http://localhost:8003/post/'+memory.id" >View annotations..</a>
          <div class="thumbnail">
            <img :src="memory.imgUrl"/>
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
      location: '',
      imgUrl: '',
      taggedPeople: '',
      baseURL: 'http://localhost:3001',
      secondaryURL: 'http://localhost:8003',
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
              imgUrl: memory.imgUrl,
              taggedPeople : memory.taggedPeople,
              location: memory.location,
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
          imgUrl: this.imgUrl,
          location: this.location, 
          taggedPeople: this.taggedPeople,
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

ul.memoryList li p { margin: 15px; display: block; width: 100%; height: 100%; }

.memoryCell {
  background-color: #fffdea36 !important;
  display: grid;
  grid-template: " .          .           .                 deleteButton " 12%
                 " thumbnail  title       .                 .            " 7%
                 " thumbnail  description .                 .            " 71%
                 " thumbnail  .           view-annotations  .            " 10%
                 / auto       1fr         auto              auto;
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
  margin-top: 10px;
}
.view-annotations {
  grid-area: view-annotations;
  margin-top: 10px;

}

.inputText {
  grid-area: inputText;
  margin-top: 10px;
  display: grid;
  grid-template: " thumbnail  editTitle        " 15%
                 " thumbnail  editTaggedPeople " 15%
                 " thumbnail  editLocation     " 15%
                 " thumbnail  editImage        " 15%
                 " thumbnail  editDescription  " auto
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
  margin: 15px;
}

.editImage {
  grid-area: editImage;
  margin: 15px;
}

.editLocation {
  grid-area: editLocation;
  margin: 15px;
}

.editLocation {
  grid-area: editLocation;
  margin: 15px;
}
.editTaggedPeople {
  grid-area: editTaggedPeople;
  margin: 15px;
}

.editDescription {
  grid-area: editDescription;
  margin: 15px;

}

.deleteButton {
  grid-area: deleteButton;
}
</style>
