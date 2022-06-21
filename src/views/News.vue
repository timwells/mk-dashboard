<template>
  <div v-if="news">
	<a-row :gutter="24" type="flex" align="stretch">
		<a-col :span="24" :lg="12" :xl="12" class="mb-24" v-for="n in news.results" :key="n.index">
			<CardNewsInfo 
				:title="n.title"
				:description="n.description"
				:published="n.published_utc" 
				:imageUrl="n.image_url" 
				:articleUrl="n.article_url"/>	
		</a-col>
	</a-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CardNewsInfo from '@/components/Cards/CardNewsInfo';

export default ({
	components: {
		CardNewsInfo
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