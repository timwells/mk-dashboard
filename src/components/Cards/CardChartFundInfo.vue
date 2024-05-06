<template>
	<a-card :bordered="false" class="card-info">
		<a-row type="flex">
			<a-col class="col-content" :span="24" :xl="12">
				<div class="card-content">
					<h6>{{title}}</h6>
					<p>{{ticker}}</p>					
					<img v-if="ticker.length>1" :src="url" alt="Performance Chart" height="280" width="98%"/>
				</div>
			</a-col>
		</a-row>
	</a-card>
</template>

<script>
	export default ({
		props: {
			title: {
				type: String,
				default: "",
			},
			ticker: {
				type: String,
				default: "",
			}
		},
		computed: {
			chartUrl() {
			}
		},
		data() {
			return {
				url: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=${this.ticker}&color=f65d1a&hide=&span=M120&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,
			}
		},
		methods: {
		}		
	})
</script>