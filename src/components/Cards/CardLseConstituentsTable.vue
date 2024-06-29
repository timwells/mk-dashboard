<template>
	<div v-if="gConstituents(constituents) != undefined">
		<div v-if="gConstituents(constituents) !== null">
			<a :href="gConstituents(constituents).webSource" target="_blank">Click for: lse constituents performance - 
				<span>{{gConstituents(constituents).source }} / {{gConstituents(constituents).created}}</span>
			</a>
			<span style="float:right;">
				Live <a-switch size="small" v-model="live" @click="liveToggle" />			
			</span>
		</div>
		<a-table
			:loading="loading"
			:columns="CONSTITUENT_PERFORMANCE_Columns" 
			:data-source="gConstituents(constituents).data" 
			:pagination="false" 
			:rowKey="(record,i) => i"
			:row-class-name="setRowClassName">

			<template slot="expandedRowRender" slot-scope="record">
				<CardLseConstituentDetails :epic="record.epic"></CardLseConstituentDetails>
			</template>
		</a-table>
	</div>
</template>

<script>
import {mapState, mapGetters } from "vuex";
import CardLseConstituentDetails from "@/components/Cards/CardLseConstituentDetails"

import { 
	CONSTITUENT_PERFORMANCE_Columns
} from '@/common/table'

export default ({
	props: {
		constituents: {
			type: String,
			default: ""
		}
	},
	components: {
		CardLseConstituentDetails
	},
	computed: {
		...mapState("lse",["constituentsPerformance"]),
		...mapGetters("lse",["gConstituents"]),
	},
	data() {
		return {
			CONSTITUENT_PERFORMANCE_Columns,
			loading: false,
			live: false
		}
	},
	methods: {		
		setRowClassName(record) {
 			return this.getClassName(record.changePercent);
    	},
    	getClassName(changePercent) {
      		switch (true) {
        		case changePercent > 2.0: return 'green-bold-font';
        		case changePercent > 0.5: return 'green-font';

				case changePercent < -2.0: return 'red-bold-font';
        		case changePercent < -0.5: return 'red-font';

				default: return 'blue-font';
      		}
    	},
		liveToggle() {
			if(this.live) {
				this.$store.dispatch("lse/getConstituentsPeformance",{constituents: this.constituents, live: this.live})
				this.live = false;
			}
		}
	},
	mounted() {
	  this.$store.dispatch("lse/getConstituentsPeformance",{constituents: this.constituents, live: this.live})
	}
})

</script>

<style>
.red-font {
  color: red !important;
}
.red-bold-font {
  color: red !important;
  font-weight: bold !important;
}

.green-font {
  color: green !important;
}

.green-bold-font {
  color: green !important;
  font-weight: bold !important;
}

.blue-font {
  color: blue !important;
}
</style>