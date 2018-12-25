<template>
  <div id="Memory">
    <div class="memoryCell">
        <b-button class="deleteButton"
                variant="danger"
                @click="deleteMemory(memory.id)">X
        </b-button>
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
        <img :src="memory.imgUrl"/>
        </div>
        <br>
    </div>
      <!-- <pre id="annot">{"type": "TextQuoteSelector","exact": "{{ annotatedText }}"}</pre> -->
      <pre id="debug" style="display:none">{{ annotationObject }}</pre>
  </div>

</template>
<script>

import axios from 'axios';

export default {

  name: 'Memory',
  // Variables here
  data() {
    return {
      memory: {},
      annotatedText: '',
      id: '',
      baseURL: 'http://localhost:3001',
      annotationURL: 'http://172.20.10.2:8004',
      annotationObject: {},
    };
  },

  // Setters here
  watch: {
    /* eslint-disable */
  },

  // On Create here
  async created() {
    this.id = this.$attrs.id;
    this.getMemory();
    },

  // Methods here
  methods: {

    async getMemory() {
        await axios.get(`${this.baseURL}/memory/${this.id}`)
        .then((res) => {
            this.memory = res.data[0];
        })
    },

    async annotate() {
        if (window.getSelection) {
        this.annotatedText = window.getSelection().toString();
        }
        else if (document.selection) {
        this.annotatedText =  document.selection.createRange().text;
        }
        let annotationObject = {};
        annotationObject = Object.assign({"@context": "http://www.w3.org/ns/anno.jsonld"}, annotationObject);
        annotationObject = Object.assign({"id":1}, annotationObject);
        annotationObject = Object.assign({"type": "Annotation"}, annotationObject);
        annotationObject = Object.assign({"created":new Date()}, annotationObject);
        annotationObject = Object.assign({"creator":{"type":"Human","name":JSON.parse(sessionStorage["vue-session-key"])["session_username"]}}, annotationObject);
        annotationObject = Object.assign({"generator":{"type":"Software", "name":"TheBeaver", "homepage":"https://thebeaver.blabla/"}}, annotationObject);
        annotationObject = Object.assign({"motivation":"tagging"}, annotationObject);
        annotationObject = Object.assign({"target":{"source":window.location.protocol+"//"+window.location.host+window.location.pathname, 
                            "selector":{"type": "TextQuoteSelector","exact": this.annotatedText }}}, annotationObject);
        this.annotationObject = annotationObject;
        await axios.post(`${this.annotationURL}/annotate`, { annotationObject }, 
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
            })
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
  grid-template: " .          .             .                 deleteButton " 12%
                 " thumbnail  title         .                 .            " 7%
                 " thumbnail  description   .                 .            " 71%
                 " thumbnail  annotatedText . annotate     " 10%
                 / auto       1fr           auto              auto;
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
