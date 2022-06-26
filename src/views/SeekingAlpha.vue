<template>
  <div v-if="trending">
	<a-row :gutter="24" type="flex" align="stretch">
		<a-col :span="24" :lg="12" :xl="12" class="mb-24" v-for="n in trending.data" :key="n.index">
			<CardNewsInfo 
				:title="n.attributes.title"
				:description="n.attributes.content"
				:published="n.attributes.publishOn" 
				:imageUrl="n.attributes.gettyImageUrl" 
				:articleUrl="article(n.links.self)"/>	
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
    	...mapState("sa", ["self","trending"]),    
	},

    data() {
        return {}
    },
    methods: {
        article(articleLink) {return `${this.self}${articleLink}`} 
    },
    mounted() {
        this.$store.dispatch("sa/getTrending")
    }
})
</script>

<style>

</style>