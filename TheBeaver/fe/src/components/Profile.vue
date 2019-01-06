<template>
  <div id="Profile">
    <div class="postMemory">
      <div class="inputText">
        <div class="thumbnail">
          <img v-if="imgUrl" :src="imgUrl" style="width:230px; height:auto">
          <img
            v-else
            src="http://savings.gov.pk/wp-content/plugins/ldd-directory-lite/public/images/noimage.png"
            style="width:230px; height:auto"
          >
        </div>
        <b-form-input class="editTitle"
                      type="text"
                      v-model="title"
                      placeholder="Tell us what"/>
        <b-form-input class="editTaggedPeople"
                      type="text"
                      v-model="taggedPeople"
                      placeholder="Tell us who"/>
        <b-form-input class="editImage"
                      type="text"
                      v-model="imgUrl"
                      placeholder="Image URL"/>
        <div class="google-map" :id="mapName"></div>
        <div class="selectDate">
          <b-form-select class="selectDecade" v-model="decadesInt">
            <option v-for="option in decadeOptions"
                    :value="option.value"
                    :key="option.value">
                      {{ option.key }}
            </option>
          </b-form-select>
          <b-form-select class="selectYear" :disabled="!decadesInt" v-model="yearsInt">
            <option v-for="option in years"
                    :value="option.value"
                    :key="option.value">
                      {{ option.key }}
            </option>
          </b-form-select>

          <b-form-select class="selectMonth" :disabled="!yearsInt" v-model="monthString">
            <option v-for="option in monthOptions"
                    :value="option.value"
                    v-bind:key="option.value">
                      {{ option.key }}
            </option>
          </b-form-select>
          <b-form-select class="selectDay" :disabled="!monthString || !yearsInt " v-model="dayInt">
            <option v-for="option in days"
                    :value="option.value"
                    v-bind:key="option.value">
                    {{ option.key }}
            </option>
          </b-form-select>
        </div>
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
                    @click="deleteMemory(memory.id)">X</b-button>
          <p class="title">{{ memory.title }}</p>
          <div class="description">
            {{ memory.description }}
            <br>
            <br>
            <div v-if="memory.date">
              Date: {{ getMemoryDate(memory.date)}}
            </div>
            <div v-if="memory.taggedPeople">
              <tt style="font-family:Avenir;">People: {{ memory.taggedPeople }}</tt>
            </div>
            <div v-if="memory.isPublic">Public: {{memory.isPublic}}</div>
          </div>
          <div class="thumbnail">
            <img :src="memory.imgUrl">
          </div>
          <router-link
            class="view-annotations"
            :to="{ name: 'Memory', params: { id: memory.id }}">
            View annotations
          </router-link>

          <div class="thumbnail">
            <img v-if="memory.imgUrl" :src="memory.imgUrl">
            <img
              v-else
              src="http://savings.gov.pk/wp-content/plugins/ldd-directory-lite/public/images/noimage.png">
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
import Vue from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import datePicker from 'vue-bootstrap-datetimepicker';
// import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';

Vue.use(datePicker);

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
      uploadedImage:
        'http://img1.vued.vanthink.cn/vued0a233185b6027244f9d43e653227439a.png',
      message: '',
      title: '',
      isPublic: '',
      username: '',
      location: '',
      imgUrl: '',
      decadesInt: null,
      yearsInt: null,
      monthString: null,
      dayInt: null,
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
      decadeOptions: [
        { key: 'Select a decade', value: null },
        { key: '1900s', value: 1900 },
        { key: '1910s', value: 1910 },
        { key: '1920s', value: 1920 },
        { key: '1930s', value: 1930 },
        { key: '1940s', value: 1940 },
        { key: '1950s', value: 1950 },
        { key: '1960s', value: 1960 },
        { key: '1970s', value: 1970 },
        { key: '1980s', value: 1980 },
        { key: '1990s', value: 1990 },
        { key: '2000s', value: 2000 },
        { key: '2010s', value: 2010 },
      ],

      date: new Date(),
      options: {
        format: 'DD.MM.YYYY',
        useCurrent: false,
        viewMode: 'years',
      },
      components: {
        datePicker,
      },
    };
  },

  computed: {

    memoryDate() {
      return {
        decade: this.decadesInt,
        year: this.yearsInt,
        month: this.monthString,
        day: this.dayInt,
      };
    },

    years() {
      return [
        { key: 'Select a year', value: null },
        { key: this.decadesInt, value: this.decadesInt },
        { key: this.decadesInt + 1, value: this.decadesInt + 1 },
        { key: this.decadesInt + 2, value: this.decadesInt + 2 },
        { key: this.decadesInt + 3, value: this.decadesInt + 3 },
        { key: this.decadesInt + 4, value: this.decadesInt + 4 },
        { key: this.decadesInt + 5, value: this.decadesInt + 5 },
        { key: this.decadesInt + 6, value: this.decadesInt + 6 },
        { key: this.decadesInt + 7, value: this.decadesInt + 7 },
        { key: this.decadesInt + 8, value: this.decadesInt + 8 },
        { key: this.decadesInt + 9, value: this.decadesInt + 9 },
      ];
    },

    monthOptions() {
      return [
        { key: 'Select a month', value: null },
        { key: 'January', value: 'Jan' },
        { key: 'February', value: 'Feb' },
        { key: 'March', value: 'Mar' },
        { key: 'April', value: 'Apr' },
        { key: 'May', value: 'May' },
        { key: 'June', value: 'Jun' },
        { key: 'July', value: 'Jul' },
        { key: 'August', value: 'Aug' },
        { key: 'September', value: 'Sep' },
        { key: 'October', value: 'Oct' },
        { key: 'November', value: 'Nov' },
        { key: 'December', value: 'Dec' },
      ];
    },

    days() {
      return [
        { key: 'Select a day', value: null },
        { key: '1', value: 1 },
        { key: '2', value: 2 },
        { key: '3', value: 3 },
        { key: '4', value: 4 },
        { key: '5', value: 5 },
        { key: '6', value: 6 },
        { key: '7', value: 7 },
        { key: '8', value: 8 },
        { key: '9', value: 9 },
        { key: '10', value: 10 },
        { key: '11', value: 11 },
        { key: '12', value: 12 },
        { key: '13', value: 13 },
        { key: '14', value: 14 },
        { key: '15', value: 15 },
        { key: '16', value: 16 },
        { key: '17', value: 17 },
        { key: '18', value: 18 },
        { key: '19', value: 19 },
        { key: '20', value: 20 },
        { key: '21', value: 21 },
        { key: '22', value: 22 },
        { key: '23', value: 23 },
        { key: '24', value: 24 },
        { key: '25', value: 25 },
        { key: '26', value: 26 },
        { key: '27', value: 27 },
        { key: '28', value: 28 },
        { key: '29', value: 29 },
        { key: '30', value: 30 },
        { key: '31', value: 31 },
      ];
    },
  },

  // On Create here
  async created() {
    if (JSON.parse(sessionStorage.getItem('vue-session-key'))) {
      this.username = JSON.parse(sessionStorage.getItem('vue-session-key')).session_username;
    } else {
      this.username = 'anonymous';
    }
    await this.getAllMemories();
  },

  // Methods here
  methods: {

    initMap() {
      this.bounds = new google.maps.LatLngBounds();
      const element = document.getElementById(this.mapName);
      const mapCentre = { latitude: 41.015137, longitude: 28.979530 };
      const options = {
        center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude),
      };
      const position = new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude);
      this.map = new google.maps.Map(element, options);
      this.map.setZoom(10);
      this.map.addListener('click', ((e) => {
        const latlng = e.latLng;
        this.coordinates.push({ lat: latlng.lat(), lng: latlng.lng() });
        const marker = new google.maps.Marker({
          position: latlng,
          map: this.map,
        });
        this.markers.push(marker);
      }));
    },

    async getAllMemories() {
      this.memories = [];
      if (this.username === 'anonymous') {
        return;
      }
      await axios
        .get(`${this.baseURL}/memories`, {
          params: {
            username: this.username,
          },
        })
        .then((res) => {
          res.data.forEach((memory) => {
            this.memories.push({
              username: memory.username,
              description: memory.description,
              imgUrl: memory.imgUrl,
              taggedPeople: memory.taggedPeople,
              location: memory.location,
              date: memory.date,
              title: memory.title,
              isPublic: memory.isPublic,
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
      return a;
    },

    async postMemory() {
      await axios
        .post(`${this.baseURL}/postMemory`, {
          description: this.message,
          title: this.title,
          imgUrl: this.imgUrl,
          location: this.coordinates,
          taggedPeople: this.taggedPeople,
          username: this.username,
          date: this.memoryDate,
          isPublic: true,
        })
        .then(async (response) => {
          this.getAllMemories();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async deleteMemory(id) {
      axios
        .delete(`${this.baseURL}/deleteMemory`, {
          data: {
            id,
          },
        })
        .then(async (response) => {
          this.getAllMemories();
        })
        .catch((error) => {
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
  background-image: linear-gradient(to top, #f7e3d888, #ced7f088);
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  grid-template:
    ". postMemory ." auto
    ". memories  ." auto
    / 13% 1fr 13%;
}

.memories {
  display: grid;
  justify-content: center;
  align-items: center;
  grid-area: memories;
  grid-template:
    " memoryList " auto
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

ul.memoryList li p {
  margin: 15px;
  display: block;
  width: 100%;
  height: 100%;
}

.memoryCell {
  background-color: #ffffffbb !important;
  display: grid;
  grid-template:
    " .          .               .                 deleteButton " 36px
    " thumbnail  title           .                 .            " auto
    " thumbnail  description     .                 .            " auto
    " thumbnail  .               view-annotations  .            " 1fr
    / auto 1fr auto auto;
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
.selectDecade {
  grid-area: selectDecade;
  margin: 15px;
}

.selectYear {
  grid-area: selectYear;
  margin: 15px;
}

.selectMonth {
  grid-area: selectMonth;
  margin: 15px;
}

.selectDay {
  grid-area: selectDay;
  margin: 15px;
}

.selectExactDate {
  grid-area: selectExactDate;
  margin-top: 15px;
  margin-left: 15px;
}

.view-annotations {
  grid-area: view-annotations;
  bottom: 10px;
}

.inputText {
  grid-area: inputText;
  margin-top: 12px;
  display: grid;
  grid-template:  " thumbnail         editTitle        " auto
                  " thumbnail         editTaggedPeople " auto
                  " thumbnail         editImage        " auto
                  " thumbnail         selectDate       " auto
                  " thumbnail         editLocation     " 256px
                  " editDescription   editDescription  " auto
                  / 256px             auto;
}

.postMemory {
  grid-area: postMemory;
  display: grid;
  grid-template:
    " inputText  inputText     " auto
    " .          postButton    " auto
    / auto 128px;
  margin-bottom: 48px;
}

.postButton {
  grid-area: postButton;
}

.selectDate {
  grid-area: selectDate;
  display: grid;
  grid-template: " selectDecade selectYear selectMonth selectDay " auto
                  /1fr          1fr        1fr         1fr;
}

.editTitle {
  grid-area: editTitle;
  margin: 15px;
}

.editImage {
  grid-area: editImage;
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

.links.view-annotations a {
  font-weight: bold;
  color: #e7edf3;
}

.links.view-annotations a.router-link-exact-active {
  color: #e6da70;
}

.google-map {
  margin: 15px;
  background: gray;
  grid-area: editLocation;
}

</style>

