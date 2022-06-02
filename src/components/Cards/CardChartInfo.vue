<template>

	<a-card :bordered="false" class="card-info">
		<a-row type="flex">
			<a-col class="col-content" :span="24" :xl="12">
				<div class="card-content">
					<h6>{{title}}</h6>
					<!--h5>S:129.41p B:129.65p </h5-->
					<p>{{ticker}}</p>
					<!--p>Prices as at 31 May 2022</p-->
					
					<img v-if="ticker.length>1" :src="url" alt="performance chart" height="230" width="640"/>

				</div>
				<div class="card-footer">
					<span>Prices as at 31 May 2022</span>
				</div>
			</a-col>
			<!--a-col class="col-img" :span="24" :xl="12">
				<div class="card-img-bg">
					<img src="images/info-card-1.jpg" alt="">
				</div>
			</a-col-->
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
				url: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=${this.ticker}&color=f65d1a&hide=&span=M60&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,
				//url: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=${this.ticker}&amp;color=f65d1a&amp;hide=&amp;span=M60&amp;plotSingleAsPrice=true&amp;totalReturn=false&amp;yAxisLabel=_`
			}
		},
		methods: {
		}		
	})

</script>