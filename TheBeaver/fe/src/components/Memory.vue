<template>
<div>
  <div id="Memory">
    <div class="memoryCell">
        <p class="title">{{ memory.title }}</p>
        <!-- <p v-html="memory.description"> -->
        <div class="description">
          <Highlighter :searchWords="queries"
                       :textToHighlight="memory.description"
                       :autoEscape="true"
                       class="memory-description">
          </Highlighter>
          <br><br>
          <Highlighter v-if="memory.username"
                       :searchWords="queries"
                       :textToHighlight="'User: ' + memory.username"
                       :autoEscape="true"
                       class="memory-username">

          </Highlighter>
          <br>
          <div class="google-map" :id="mapName"></div>
          <br>
          <Highlighter v-if="memory.taggedPeople"
                       :searchWords="queries"
                       :textToHighlight="'People: ' + memory.taggedPeople"
                       :autoEscape="true"
                       class="memory-people">
          </Highlighter>
          <br>
          <Highlighter v-if="memory.time"
                       :searchWords="queries"
                       :textToHighlight="'Time: ' + memory.time"
                       :autoEscape="true"
                       class="memory-time">
          </Highlighter>
          <br>
          <br>
        </div>
        <!-- </p> -->
        <b-button class="annotate"
                variant="info"
                @click="annotate()">Annotate
        </b-button>
        <div class="thumbnail">
          <memory-img @anno-rect-changed="annoRectChanged"
                      @photo-loaded="photoLoaded"
                      v-if="memory.imgUrl"
                      :img-url="memory.imgUrl"
                      ref="memoryImage">
            <annotation-rect :position="annotationImageRect"></annotation-rect>
            <annotation-rect
              v-for="annotation in imageAnnotations"
              :key="annotation.id"
              :position="annotation.rect"
            >
            </annotation-rect>
          </memory-img>
        </div>
        <br>
    </div>
    <!-- <pre id="annot">{"type": "TextQuoteSelector","exact": "{{ annotatedText }}"}</pre> -->
    <pre id="debug" style="display:none">{{ annotationTextObject }}</pre>
  </div>
</div>
</template>
<script>

import axios from 'axios';
import $Scriptjs from 'scriptjs';
import TextHighlight from 'vue-text-highlight';
import Highlighter from 'vue-highlight-words';
import MemoryImg from './MemoryImg.vue';
import AnnotationRect from './AnnotationRect.vue';

export default {
  name: 'Memory',
  // Variables here
  props: ['name'],

  mounted() {
    $Scriptjs('https://maps.googleapis.com/maps/api/js?key=AIzaSyDizCTlHkRUed4C1f2E1dQxOz2Y93qVBZk', () => {
      this.initMap();
    });
  },
  components: {
    MemoryImg,
    AnnotationRect,
    TextHighlight,
    Highlighter,
  },

  data() {
    return {
      memory: {},
      annotatedText: '',
      id: '',
      // baseURL: 'https://beaver-memories.now.sh',
      baseURL: 'http://localhost:3001',
      annotationURL: 'https://beaver-annotations.now.sh',
      annotations: [],
      annotationImageRectRatio: {},
      annotationImageRect: {},
      isPhotoLoaded: false,
      mapName: `${this.name}-map`,
      map: null,
      bounds: null,
      markers: [],
    };
  },

  // On Create here
  async created() {
    this.id = this.$attrs.id;
    this.getMemory();
    this.getAnnotations();
  },

  // Setters here
  watch: {
    /* eslint-disable */

    coordinates() {
      if (!this.coordinates) { return []; };
      this.coordinates.forEach((coordinate => {
        console.log(this.coordinates);
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(coordinate.lat, coordinate.lng),
            map: this.map
          });
          this.markers.push(marker);
        }).bind(this));
    }
  },

  computed: {
    coordinates() {
        return this.memory.location;
    },

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
      if (!this.annotationImageRectRatio) {
        return {};
      }
      let annotationObject = {"@context": "http://www.w3.org/ns/anno.jsonld",
      "type": "Annotation",
      "created":new Date().toISOString(),
      "creator":{"type":"Human","name":sessionStorage["vue-session-key"]?JSON.parse(sessionStorage["vue-session-key"])["session_username"]:"Anonymous"},
      "generator":{"type":"Software", "name":"TheBeaver", "homepage":window.location.protocol+"//"+window.location.host},
      "motivation":"tagging",
      "target":{"source":window.location.protocol+"//"+window.location.host+window.location.pathname,
                          "selector":{"type": "ImageSelector", "rect" : this.annotationImageRectRatio}}
      };
      return annotationObject;
    },

    textAnnotations() {
      return this.annotations.filter(annotation => annotation.target.selector.type === 'TextQuoteSelector');
    },

    imageAnnotations() {
      return this.annotations
              .filter(annotation => annotation.target.selector.type === 'ImageSelector')
              .map(annotation => {
                if (!this.isPhotoLoaded || !this.$refs.memoryImage) { return annotation };
                const { width: imageWidth, height: imageHeight} = this.$refs.memoryImage.$refs.image.getBoundingClientRect();
                return {
                  id: annotation._id,
                  rect: this.getAbsoluteRect({
                    rect: annotation.target.selector.rect,
                    imageWidth,
                    imageHeight,
                  })
                }
              })
    },

    queries() {
      return this.textAnnotations.map(annotation => annotation.target.selector.exact);
    },
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
    },

    photoLoaded() {
      // setInterval is necessary to ensure browser paints
      // the image, b/c img onload does not take paint into acccount
      // when being fired;
      const resetInterval = setInterval(() => {
        if (this.$refs.memoryImage.$refs) {
          this.isPhotoLoaded = true;
          clearInterval(resetInterval);
        }
      }, 100);
    },

    async getMemory() {
        await axios.get(`${this.baseURL}/memory/${this.id}`)
        .then((res) => {
            this.memory = res.data[0];
        })
    },

    async getAnnotations() {
      await axios.get(`${this.annotationURL}/getAnnotations/${window.location.protocol+"//"+window.location.host+window.location.pathname}`)
      .then(res => {
        this.annotations = res.data;
      })
    },

    getAbsoluteRect({rect, imageWidth, imageHeight}) {
      let {x, y, width, height} = rect;
      x *= imageWidth;
      width *= imageWidth;
      y *= imageHeight;
      height *= imageHeight;
      return {x, y, width, height};
    },

    annoRectChanged(annoRect) {
      this.annotationImageRectRatio = annoRect;
      if (!this.$refs.memoryImage) { return ; };
      const { width: imageWidth, height: imageHeight} = this.$refs.memoryImage.$refs.image.getBoundingClientRect();
      this.annotationImageRect = this.getAbsoluteRect({
        rect: this.annotationImageRectRatio,
        imageWidth,
        imageHeight,
      });
    },

    getTextAnnotation() {
      if (window.getSelection) {
        if (window.getSelection().toString() === ' ') { return; };
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
      }

      if (this.annotationImageObject) {
        const res = await axios.post(
          `${this.annotationURL}/annotate`, {annotationObject: this.annotationImageObject},
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
      }

      await this.getAnnotations();
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
  grid-template:  " .     .           . "  10%
                  " .     memoryCell  . "  auto
                  / 13%   1fr         13%;
}

.memoryCell {
  grid-area: memoryCell;
  display: grid;
  grid-template: " thumbnail  title            .          .            " auto
                 " thumbnail  description   description   description  " auto
                 " thumbnail  description   description   description  " auto
                 " .          .             annotate      annotate     " auto
                 / auto       1fr           auto          auto;
  text-align: left;
}

.description {
  grid-area: description;
  display: grid;
  grid-template: "memory-description" auto
                 "memory-username"  auto
                 "memory-people"  auto
                 "map"  256px
                 "memory-time"  auto
                / auto;

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

.deleteButton {
  grid-area: deleteButton;
}

.google-map {
  margin: 15px;
  background: gray;
  grid-area: map;
}

.memory-people {
  margin: 15px;
  grid-area: memory-people;
}

.memory-description {
  margin: 15px;
  grid-area: memory-description;
}

.memory-time {
  margin: 15px;
  grid-area: memory-time;
}

.memory-username {
  margin: 15px;
  grid-area: memory-username;
}

</style>
