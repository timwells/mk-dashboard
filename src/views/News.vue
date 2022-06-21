<template>
  <div v-if="news">
    <ul>
      <li v-for="(n, index) in news" :key="index">
        <h1>{{n.title}}</h1>
      </li>
    </ul>  
  </div>
</template>

<script>
import { mapState } from "vuex";

export default ({
	components: {
	},
	computed: {
    	...mapState("newsfeed", ["news"])
	},
	data() {
		return {}
	},
	methods: {
	},
	mounted() {
    this.$store.dispatch("newsfeed/getNews");
	}
})  
</script>

<style>

</style>