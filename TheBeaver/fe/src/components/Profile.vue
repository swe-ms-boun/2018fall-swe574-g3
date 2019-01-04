<template>
  <div id="Profile">
    <div class="postMemory">
      <div class="inputText">
        <div class="thumbnail">
            <img v-if="imgUrl" :src= imgUrl style="width:230px; height:auto"/>
            <img v-else src="http://savings.gov.pk/wp-content/plugins/ldd-directory-lite/public/images/noimage.png" style="width:230px; height:auto"/>

        </div>
        <b-form-input class="editTitle"
                      type="text"
                      v-model="title"
                      placeholder="Tell us what"/>
        <b-form-input class="editTaggedPeople"
                      type="text"
                      v-model="taggedPeople"
                      placeholder="Tell us who"/>
        <div class="google-map" :id="mapName"></div>
        <b-form-input class="editImage"
                      type="text"
                      v-model="imgUrl"
                      placeholder="Image URL"/>
        <b-form-input class="editTime"
                      type="text"
                      v-model="time"
                      placeholder="Tell us when"/>
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
         <div class="description">
            {{ memory.description }}
            <br>
            <br>
            <div v-if="memory.taggedPeople">
              People: {{ memory.taggedPeople }}
            </div>
            <div v-if="memory.time">
              Time: {{ memory.time }}
            </div>
            <div v-if="memory.isPublic">
              Public: {{memory.isPublic}}
            </div>
          </div>
          <div class="thumbnail">
            <img :src="memory.imgUrl"/>
          </div>
          <router-link class="view-annotations"
                       :to="{ name: 'Memory', params: { id: memory.id }}">View annotations
          </router-link>

          <div class="thumbnail">
            <img v-if="memory.imgUrl" :src="memory.imgUrl"/>
            <img v-else src= "http://savings.gov.pk/wp-content/plugins/ldd-directory-lite/public/images/noimage.png"/>
          </div>
          <br>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

import axios from 'axios';
import $Scriptjs from 'scriptjs';

export default {

  name: 'Profile',
  // Variables here
  props: ['name'],

  mounted() {
    $Scriptjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyDizCTlHkRUed4C1f2E1dQxOz2Y93qVBZk', () => {
      this.initMap();
    });
  },

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
      time: '',
      taggedPeople: '',
      // baseURL: 'https://beaver-memories.now.sh',
      baseURL: 'http://localhost:3001',
      secondaryURL: 'https://beaver-annotations.now.sh',
      annotatedText: '',
      mapName: `${this.name}-map`,
      coordinates: [],
      map: null,
      bounds: null,
      markers: [],
    };
  },

  // Setters here
  watch: {
    /* eslint-disable */
  },

  // On Create here
  async created() {

    if(JSON.parse(sessionStorage.getItem("vue-session-key"))) {
      this.username = JSON.parse(sessionStorage.getItem("vue-session-key")).session_username;
    } else {
      this.username = 'anonymous';
    }
    await this.getAllMemories();
  },

  // Methods here
  methods: {

    initMap() {
      this.bounds = new google.maps.LatLngBounds();
      const element = document.getElementById(this.mapName)
      let mapCentre = {latitude: 41.015137, longitude: 28.979530}
      const options = {
        center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude)
      }
      const position = new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude);
      this.map = new google.maps.Map(element, options);
      this.map.setZoom(10);
      this.map.addListener('click', ((e) => {
        let latlng = e.latLng;
        this.coordinates.push({lat: latlng.lat(),lng: latlng.lng()})
        var marker = new google.maps.Marker({
          position: latlng,
          map: this.map
        });
        this.markers.push(marker);
      }).bind(this));
    },

    async getAllMemories() {
      this.memories = [];
      if (this.username == 'anonymous') {
        return;
      }
      await axios.get(`${this.baseURL}/memories`, {
        params: {
          username: this.username
        }
      }).then((res) => {
          res.data.forEach((memory) => {
            this.memories.push({
              username: memory.username,
              description: memory.description,
              imgUrl: memory.imgUrl,
              taggedPeople : memory.taggedPeople,
              location: memory.location,
              title: memory.title,
              time: memory.time,
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
          location: this.coordinates,
          time: this.time,
          taggedPeople: this.taggedPeople,
          username: this.username,
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#Profile {
  display: grid;
  background-image: linear-gradient(to top,#f7e3d888 , #ced7f088);
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
  background-color: #ffffffbb !important;
  display: grid;
  grid-template: " .          .               .                 deleteButton " 36px
                 " thumbnail  title           .                 .            " auto
                 " thumbnail  description     .                 .            " auto
                 " thumbnail  .               view-annotations  .            " 1fr
                 / auto       1fr             auto              auto;
  text-align: left;
  box-shadow: 3px 3px #0000001c;
}

.thumbnail img {
  width: 20vw;
  height: auto;
  padding: 16px;
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
  bottom: 10px;
  font-weight: bold;
  color: #219c69;
}

.inputText {
  grid-area: inputText;
  margin-top: 10px;
  display: grid;
  grid-template: " thumbnail         editTitle        " 1fr
                 " thumbnail         editTaggedPeople " 1fr
                 " thumbnail         editLocation     " 256px
                 " thumbnail         editTime         " 1fr
                 " thumbnail         editImage        " 1fr
                 " editDescription   editDescription  " auto
                 / 256px             auto;
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

.editTime {
  grid-area: editTime;
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

.links.view-annotations a  {
  font-weight: bold;
  color: #e7edf3;
}

.links.view-annotations a.router-link-exact-active  {
  color: #e6da70;
}

.google-map {
  margin: 15px;
  background: gray;
  grid-area: editLocation;
}

</style>
