<template>
<div>
  <div id="Memory">
    <div class="memoryCell">
        <p class="title">{{ memory.title }}</p>
        <!-- <p v-html="memory.description"> -->
        <div class="description" @click="clickHandle($event)">
          <Highlighter :searchWords="queries"
                       :textToHighlight="memory.description"
                       :autoEscape="true"
                       class="memory-description">
          </Highlighter>
          <Highlighter v-if="memory.username"
                       :searchWords="queries"
                       :textToHighlight="'User: ' + memory.username"
                       :autoEscape="true"
                       class="memory-username">
          </Highlighter>
          <Highlighter v-if="memory.location"
                       :searchWords="queries"
                       :textToHighlight="'Location: ' + memory.location"
                       :autoEscape="true"
                       class="memory-location">
          </Highlighter>
          <div class="google-map" :id="mapName"></div>
          <Highlighter v-if="memory.taggedPeople"
                       :searchWords="queries"
                       :textToHighlight="'People: ' + memory.taggedPeople"
                       :autoEscape="true"
                       class="memory-people">
          </Highlighter>
          <Highlighter v-if="memory.date"
                       :searchWords="queries"
                       :textToHighlight="'Date: ' + getMemoryDate(memory.date)"
                       :autoEscape="true"
                       class="memory-time">
          </Highlighter>
        </div>
        <!-- </p> -->
        <b-button class="annotate"
                variant="info"
                @click="annotate()">Annotate
        </b-button>
         <b-form-textarea
          class="comment"
          type="text"
          v-model="comment"
          placeholder="Enter your annotation..."
        />
        <div class="thumbnail">
          <memory-img @anno-rect-hover="isInAnnoRect"
                      @anno-rect-changed="annoRectChanged"
                      @photo-loaded="photoLoaded"
                      v-if="memory.imgUrl"
                      :img-url="memory.imgUrl"
                      ref="memoryImage">
            <annotation-rect :position="annotationImageRect"></annotation-rect>
            <annotation-rect
              v-for="annotation in imageAnnotations"
              :key="annotation.id"
              :position="annotation.rect">
            </annotation-rect>
          </memory-img>
        </div>
        <br>
    </div>
    <div class="annotationComments">
      <h2>Annotations</h2>
      <ul class="comments" id="comments">
        <li v-for="comment in comments" :key="comment">
          <p>{{comment}}</p>
        </li>
      </ul>
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

const $ = require('jquery');

window.$ = $;
require('jquery-confirm');

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
      // annotationURL: 'https://beaver-annotations.now.sh',
      annotationURL: 'http://localhost:8004',
      annotations: [],
      annotationImageRectRatio: {},
      annotationImageRect: {},
      isPhotoLoaded: false,
      mapName: `${this.name}-map`,
      map: null,
      bounds: null,
      markers: [],
      comment: '',
      clickedText: '',
      imageComments: [],
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
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(coordinate.lat, coordinate.lng),
            map: this.map
          });
          this.markers.push(marker);
        }).bind(this));
      this.centerMap();
    },
  },

  computed: {

    comments() {
      if (this.imageComments && this.imageComments.length !== 0) {
        return this.imageComments;
      }
      if (!this.clickedText || !this.textAnnotations) {return;};
      this.textAnnotations.forEach(anno => {
      });
      try {
      var a = this.textAnnotations
                .filter(annotation => annotation.target.selector.exact.includes(this.clickedText))
                .map(annotation => annotation.body.value)
      } catch (e) {
        console.log(e);
      }
      return a;
    },

    imgRatioText() {
      return `${this.annotationImageRectRatio.x},${this.annotationImageRectRatio.y},${this.annotationImageRectRatio.width},${this.annotationImageRectRatio.height}`
    },

    coordinates() {
        return this.memory.coords;
    },

    annotationTextObject() {
      if (!this.annotatedText) {
        return {};
      }
      let annotationObject = {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      // annotationObject = Object.assign({"id":1}, annotationObject);
      "type": "Annotation",
      "body": {
        "type": "TextualBody",
        "value": this.comment,
        "format": "text/plain"
      },
      "created":new Date().toISOString(),
      "creator":{"type":"Human","name":sessionStorage["vue-session-key"]?JSON.parse(sessionStorage["vue-session-key"])["session_username"]:"Anonymous"},
      "generator":{"type":"Software", "name":"TheBeaver", "homepage":window.location.protocol+"//"+window.location.host},
      "motivation":"tagging",
      "target":{"source":window.location.protocol+"//"+window.location.host+window.location.pathname,
                          "selector":{"type": "TextQuoteSelector","exact": this.annotatedText }},
      }
      return annotationObject;
    },

    annotationImageObject() {
      if (!this.annotationImageRectRatio) {
        return {};
      }
      let annotationObject = {
      "@context": "http://www.w3.org/ns/anno.jsonld",
        "type": "Annotation",
        "body": {
          "type": "TextualBody",
          "value": this.comment,
          "format": "text/plain"
        },
        "created":new Date().toISOString(),
        "creator":{"type":"Human","name":sessionStorage["vue-session-key"]?JSON.parse(sessionStorage["vue-session-key"])["session_username"]:"Anonymous"},
        "generator":{"type":"Software", "name":"TheBeaver", "homepage":window.location.protocol+"//"+window.location.host},
        "motivation":"tagging",
        "target":{"source":window.location.protocol+"//"+window.location.host+window.location.pathname,
                  "id": this.memory.imgUrl+"#xywh%3D"+this.imgRatioText,
                  "type": "Image",
                  "format": "image/jpeg",
        }
      };
      return annotationObject;
    },

    textAnnotations() {
      return this.annotations.filter(annotation => annotation.target.selector && annotation.target.selector.type === 'TextQuoteSelector');
    },

    imageAnnotations() {
      return this.annotations
              .filter(annotation => annotation.target.type === 'Image')
              .map(annotation => {
                if (!this.isPhotoLoaded ||
                    !this.$refs.memoryImage ||
                    !annotation.target.id ||
                    !annotation.target.id.includes('#xywh=')) {
                      return null;
                };
                const { width: imageWidth, height: imageHeight} = this.$refs.memoryImage.$refs.image.getBoundingClientRect();
                return {
                  id: annotation._id,
                  rect: this.getAbsoluteRect({
                    rect: this.rect(annotation),
                    imageWidth,
                    imageHeight,
                  })
                }
              })
    },

    imageAnnotationsRaw() {
       return this.annotations
              .filter(annotation => annotation.target.type === 'Image')
              .map(annotation => {
                if (!this.isPhotoLoaded ||
                    !this.$refs.memoryImage ||
                    !annotation.target.id ||
                    !annotation.target.id.includes('#xywh=')) {
                      return null;
                };
                return annotation;
              });
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
        center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude),
        maxZoom: 15,
      }
      const position = new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude);
      this.map = new google.maps.Map(element, options);
      this.map.setZoom(10);
    },

    centerMap() {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach((coord) => {
        const position = new google.maps.LatLng(coord.position.lat(), coord.position.lng());
        this.map.fitBounds(bounds.extend(position))
      });
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

    rect(annotation) {
      let imgLink = annotation.target.id;
      if(!imgLink) {return;};
      let ratios = imgLink.split("#xywh=");
      let rectParams = ratios[1].split(',');
      return {x: rectParams[0], y: rectParams[1], width: rectParams[2], height: rectParams[3]};
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

    isInAnnoRect(relPos) {
      if(!this.isPhotoLoaded || !this) {return;};
      let commentArray = [];
      this.imageAnnotationsRaw.forEach(annotation => {
        const rectangle = this.rect(annotation);
        const{x: x, y: y, width: width, height: height} = rectangle
        if (( relPos.xPosition > x &&
              relPos.xPosition < Number(x) + Number(width)) &&
              (relPos.yPosition > y &&
              relPos.yPosition < ( Number(y)+ Number(height)))) {
               commentArray.push(annotation.body.value);
            }
      });
      this.imageComments = commentArray;
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
        let annotationObject = this.annotationImageObject;
        const res = await axios.post(
          `${this.annotationURL}/annotate`, {annotationObject},
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
      }

      await this.getAnnotations();
    },

    clickHandle(e) {
      try {
        let s = window.getSelection();
        var range = s.getRangeAt(0);
        var node = s.anchorNode;

        while (range.toString().indexOf(' ') != 0 && range.startOffset != 0) {
            range.setStart(node, (range.startOffset - 1));
        }
        range.setStart(node, range.startOffset + 1);

        do {
            range.setEnd(node, range.endOffset + 1);
        } while (range.toString().indexOf(' ') == -1 && range.toString().trim() != '' && range.endOffset < range.endContainer.length);

        var str = range.toString().trim();
        this.clickedText = str;
      } catch (error) {

      }
    }
  },

}

  // $(".description").on('contextmenu', function(evt) {
  //     evt.preventDefault();
  //     var e = window.event;
  //     if (e.button == 2) {
  //         var range = document.caretRangeFromPoint(e.pageX, e.pageY - $(document).scrollTop());
  //         var selection = window.getSelection();
  //         selection.removeAllRanges();
  //         selection.addRange(range);
  //         jQuery(document.elementFromPoint(e.pageX, e.pageY - $(document).scrollTop())).click();
  //     }
  // });
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#Memory {
  display: grid;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  grid-template:  " .     .           .           "  10%
                  " .     memoryCell  annotations "  auto
                  / 5%   1fr         256px;
}

.memoryCell {
  grid-area: memoryCell;
  display: grid;
  grid-template: " thumbnail  .             .              .             " auto
                 " thumbnail  title         title          title         " auto
                 " thumbnail  description   description    description   " auto
                 " comment    comment       annotate       annotate      " auto
                 / auto       1fr           auto       auto;
  text-align: left;
}

.description {
  grid-area: description;
  display: grid;
  grid-template: "memory-description" auto
                 "memory-username"  auto
                 "memory-people"  auto
                 "memory-location"  auto
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
  margin: 15px;
}

.description {
  grid-area: description;
  margin-top: 10px;
}

.annotate {
  grid-area: annotate;
  padding-bottom: 15px;
  margin: 15px;
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
.memory-location {
  margin: 15px;
  grid-area: memory-location;
}
.memory-username {
  margin: 15px;
  grid-area: memory-username;
}
.comment {
  grid-area: comment;
  padding-bottom: 15px;
  margin: 15px;
}

.annotationComments {
  grid-area: annotations;
  margin: 15px;
  align-self: start;
}



</style>
