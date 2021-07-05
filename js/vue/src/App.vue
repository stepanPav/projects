<template>
  <h1>Anectodotes </h1>
    <h2> <input placeholder='поиск' @input="search" v-model="searchLine"> </h2>
      <ul>
        <li 
        v-for="sel in selected"
        :key = sel.text
        v-bind:class = '{ active: sel.isActive }'
        class = 'anectdote' >
          <p>
          {{ sel.text }}
          </p>
          <button v-on:click ='sel.isActive = !sel.isActive'>like</button>
        </li>
      </ul>
</template>

<script>
export default {
  name: 'App',
  data (){
    return {
      anectodes: [],
      selected: [],
      searchLine: ""
    };
  },
  created: function() {
  	this.getAnectodts();
  },
  methods: {
    getAnectodts : function(){
      fetch("https://v2.jokeapi.dev/joke/Any?amount=10", {
        "headers": {
          "accept": "*/*",
          "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site"
          },
          "referrer": "https://sv443.net/",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": null,
          "method": "GET",
          "mode": "cors",
          "credentials": "omit"
        }).then((response) => {
            return response.json();
        }).then((data)=> {
            data = data.jokes;
            for(var i = 0; i < data.length; i++) {
              this.anectodes.push({
                text: data[i].joke ? data[i].joke : data[i].setup + '\n' + data[i].delivery ,
                isActive : false
              })
            }
            this.selected = this.anectodes;
        });
    },
    likeHandeled : function (el){
      el.isActive = !el.isActive;
    },
    search: function() {
      if(this.searchLine){
        this.selected = this.anectodes.filter(e => 
          e.text.toLowerCase().includes(this.searchLine.toLowerCase())
        );
      }
      else 
        this.selected = this.anectodes;
    }
  },
}
</script>

<style src = './styles.css'></style>
