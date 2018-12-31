<template>
  <div id="Memory">
    <div class="memoryCell">
        <p class="title">{{ memory.title }}</p>
        <p  v-html="memory.description" class="description">
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
        <b-button class="annotate"
                variant="info"
                @click="annotate()">Annotate
        </b-button>
        <div class="thumbnail">
          <memory-img @anno-rect-changed="annoRectChanged"
                      v-if="memory.imgUrl"
                      :img-url="memory.imgUrl"/>
        </div>
        <br>
    </div>
      <!-- <pre id="annot">{"type": "TextQuoteSelector","exact": "{{ annotatedText }}"}</pre> -->
      <pre id="debug" style="display:none">{{ annotationTextObject }}</pre>
  </div>

</template>
<script>

import axios from 'axios';
import MemoryImg from './MemoryImg.vue';

export default {

  name: 'Memory',
  // Variables here
  components: {
    MemoryImg,
  },

  data() {
    return {
      memory: {},
      annotatedText: '',
      id: '',
      baseURL: 'http://localhost:3001',
      annotationURL: 'http://localhost:8004',
      annotationImageRect: {},
    };
  },

  // On Create here
  async created() {
    this.id = this.$attrs.id;
    this.getMemory();
  },

  // Setters here
  watch: {
    /* eslint-disable */
  },

  computed: {
    annotationTextObject() {
      if (!this.annotatedText) {
        return {};
      }
      let annotationObject = {};
      annotationObject = Object.assign({"@context": "http://www.w3.org/ns/anno.jsonld"}, annotationObject);
      // annotationObject = Object.assign({"id":1}, annotationObject);
      annotationObject = Object.assign({"type": "Annotation"}, annotationObject);
      annotationObject = Object.assign({"created":new Date().toISOString()}, annotationObject);
      annotationObject = Object.assign({"creator":{"type":"Human","name":sessionStorage["vue-session-key"]?JSON.parse(sessionStorage["vue-session-key"])["session_username"]:"Anonymous"}}, annotationObject);
      annotationObject = Object.assign({"generator":{"type":"Software", "name":"TheBeaver", "homepage":window.location.protocol+"//"+window.location.host}}, annotationObject);
      annotationObject = Object.assign({"motivation":"tagging"}, annotationObject);
      annotationObject = Object.assign({"target":{"source":window.location.protocol+"//"+window.location.host+window.location.pathname,
                          "selector":{"type": "TextQuoteSelector","exact": this.annotatedText }}}, annotationObject);
      return annotationObject;
    },

    annotationImageObject() {
      if (!this.annotationImageRect) {
        return {};
      }
      let annotationObject = {"@context": "http://www.w3.org/ns/anno.jsonld",
      "type": "Annotation",
      "created":new Date().toISOString(),
      "creator":{"type":"Human","name":sessionStorage["vue-session-key"]?JSON.parse(sessionStorage["vue-session-key"])["session_username"]:"Anonymous"},
      "generator":{"type":"Software", "name":"TheBeaver", "homepage":window.location.protocol+"//"+window.location.host},
      "motivation":"tagging",
      "target":{"source":window.location.protocol+"//"+window.location.host+window.location.pathname,
                          "selector":{"type": "ImageSelector", "rect" : this.annotationImageRect}}
      };
      return annotationObject;
    }
  },


  // Methods here
  methods: {

    async getMemory() {
        await axios.get(`${this.baseURL}/memory/${this.id}`)
        .then((res) => {
            this.memory = res.data[0];
        })
    },

    annoRectChanged(annoRect) {
      this.annotationImageRect = annoRect;
    },

    getTextAnnotation() {
      if (window.getSelection) {
        this.annotatedText = window.getSelection().toString();
      }
      else if (document.selection) {
        this.annotatedText =  document.selection.createRange().text;
      }
    },

    async annotate() {

      this.getTextAnnotation()

      if (this.annotationTextObject) {
        const res = await axios.post(
          `${this.annotationURL}/annotate`, {annotationObject: this.annotationTextObject},
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
        console.log(res.data);
      }

      if (this.annotationImageObject) {
        console.log(this.annotationImageObject);
        return;
        const res = await axios.post(
          `${this.annotationURL}/annotate`, {annotationObject: this.annotationImageObject},
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
        console.log(res.data);
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#Memory {
  display: grid;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  grid-template:  " . memoryCell  . "  auto
                  / 13% 1fr 13%;
}

.memoryCell {
  grid-area: memoryCell;
  background-color: #fffdea36 !important;
  display: grid;
  grid-template: " .          .             .          .            " auto
                 " thumbnail  title         .          .            " auto
                 " thumbnail  description   .          .            " auto
                 " thumbnail  annotatedText annotate   annotate     " auto
                 / auto       1fr           auto       auto;
  text-align: left;
  box-shadow: 3px 3px #0000001c;

}
/*
.thumbnail img {
  width: 256px;
  height: auto;
} */

.thumbnail {
  grid-area: thumbnail;
  overflow: hidden;
  object-fit: cover;
  margin: 16px;
 }

.title {
  grid-area: title;
  font-weight: bold;
}

.description {
  grid-area: description;
  margin-top: 10px;
}

.annotate {
  grid-area: annotate;
  padding-bottom: 10px;
}

.annotatedText {
  grid-area: annotatedText;
  padding-bottom: 10px;
}

.deleteButton {
  grid-area: deleteButton;
}

</style>
