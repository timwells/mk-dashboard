<template>
	<!--a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 8}"-->
	<div v-if="gConstituents(constituents) != undefined">
		<div>
			<a :href="gConstituents(constituents).webSource" target="_blank">Click for: lse constituents performance - 
				<span>{{gConstituents(constituents).source }} / {{gConstituents(constituents).created}}</span>
			</a>
			<!--span style="float:right;">Live <a-switch size="small" v-model:checked="live" @click="liveToggle" /></span-->
		</div>
		<a-table
			:loading="loading"
			:columns="CONSTITUENT_PERFORMANCE_Columns" 
			:data-source="gConstituents(constituents).data" 
			:pagination="false" 
			:rowKey="(record,i) => i"
			:row-class-name="setRowClassName">

			<div slot="expandedRowRender" slot-scope="record" style="margin:0">
				<iframe :src="epic(record)" style="width: 100%; height: 600px; border: 0"></iframe>
			</div>
		</a-table>
	<!--/a-card-->
	</div>
</template>

<script>

// https://www.dividenddata.co.uk/dividend-history.py?epic=SVT
import {mapState, mapGetters } from "vuex";
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
	},
	computed: {
		...mapState("lse",["constituentsPerformance"]),
		...mapGetters("lse",["gConstituents","gConstituents2"])
	},
	data() {
		return {
			CONSTITUENT_PERFORMANCE_Columns,
			loading:false
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
		epic(record) {
			return `https://www.dividenddata.co.uk/dividend-history.py?epic=${record.epic.split('.')[0]}` 
		}
	},
	mounted() {
	  this.$store.dispatch("lse/getConstituentsPeformance",{constituents: this.constituents});
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