<template>
	<div>
		<a href="https://www.longtermtrends.net/" target="_blank">Longterm Trends</a>
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="8" :lg="12" :xl="12" class="mb-12" v-for="(tn, tni) in thumbnails" :key="tni">
				<a-card hoverable style="padding: 10px;">
					<a-card-meta>
						<template #title>
							<h4>{{ tn.title }}</h4>
						</template>
						<template #description>
							<p>{{ tn.footnote }}</p>
						</template>
					</a-card-meta>
					<template #cover>
						<img :src="tn.src"/>
					</template>
				</a-card>
			</a-col>
		</a-row>
	</div>	
</template>

<script>
import { mapState } from "vuex";
import CardLTTLineChart from '@/components/Cards/CardLTTLineChart';

export default ({
	components: {
		CardLTTLineChart
	},
	computed: {
		...mapState("ltt", ["thumbnails"]),
	},
	watch: {
    },
	data() {
		return {
		}
	},
	methods: {
	},	
	mounted() {
	    this.$store.dispatch("ltt/getThumbNails");
	}
})
</script>

<style lang="scss" scoped>
p {
	font-size: 16px;
}
</style>