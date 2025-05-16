<template>
	<a-card :bordered="false" class="card-info">
		<a-row type="flex">
			<a-col class="col-content" :span="24" :xl="12">
				<a-table 
					:columns="COLS" 
					:data-source="getDividendHistoryById(divlink)" 
					:pagination="false" 
					:rowKey="(record,i) => i"
					class='table table-small' style="margin: 6">
				</a-table>
			</a-col>
		</a-row>
	</a-card>
</template>

<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";

const COLS = [
	{
		title: 'Ex Date',
		dataIndex: 'exDate',
		width: 20
	},
	{
		title: 'Pay Date',
		dataIndex: 'payDate',
		width: 20
	},
	{
		title: 'Type',
		dataIndex: 'type',
		width: 20
	},
	{
		title: 'Amount',
		dataIndex: 'amount',
		width: 20
	},
];

export default ({
	props: {
		divlink: {
			type: String,
			default: null,
		}
	},
    computed: {
		...mapState("dd", ["dividendHistory"]),
		...mapGetters("dd", ["getDividendHistoryById"]),
  	},
	watch: {
        dividendHistory(nn, prv) {
			if(nn.length>0)
				console.log("dividendHistory:",nn)
		},
    },

	components: {},
	data() {
		return {
			COLS
		}
	},
	methods: {},
	mounted() {
		this.$store.dispatch("dd/getDividendHistory",{ divlink: this.divlink })
	}	
})
</script>