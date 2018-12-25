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
        <p class="annotatedText">{{ annotatedText }}</p>
        <b-button class="annotate"
                variant="info"
                @click="getSelectedText()">Annotate
        </b-button>
        <div class="thumbnail">
        <img :src="memory.imgUrl"/>
        </div>
        <br>
    </div>
      <pre id="debug" style="display:none">{"type": "TextQuoteSelector","exact": "{{ annotatedText }}"}</pre>
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

    getSelectedText() {
      if (window.getSelection) {
          this.annotatedText = window.getSelection().toString();
      }
      else if (document.selection) {
          this.annotatedText =  document.selection.createRange().text;
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

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
                 " thumbnail  annotatedText view-annotations  annotate     " 10%
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
.view-annotations {
  grid-area: view-annotations;
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

</style>
