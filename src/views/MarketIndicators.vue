<template>
    <a-row :gutter="24" type="flex" align="stretch">
        <a-col :span="24" :lg="12" :xl="12" class="mb-24" v-for="(indicator, index) in indicators" :key="index">
            <CardIndicatorInfo :title="indicator.title" :url="indicator.url" :type="indicator.type"/>
        </a-col>
    </a-row>
</template>

<script>
import { mapState } from "vuex";
import CardIndicatorInfo from '@/components/Cards/CardIndicatorInfo';

export default ({
	components: {
        CardIndicatorInfo
	},
	computed: {
    	...mapState("indicators", ["indicators"])
	},
	data() {
		return {}
	},
	mounted() {
        this.$store.dispatch("indicators/getIndicators");
	}
})
</script>

<style>

</style>