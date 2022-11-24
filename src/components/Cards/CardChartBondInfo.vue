<template>
	<a-card :bordered="false" class="card-info">
		<a-row type="flex">
			<a-col class="col-content" :span="24" :xl="12">
				<div class="card-content">
					<h6>{{title}}</h6>
					<img :src="url" alt="Performance Chart" height="340" width="100%"/>
				</div>
				<!--div class="card-footer">
					<span>Prices as at 31 May 2022</span>
				</div-->
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
				url: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/UK_bond_rates.webp/800px-UK_bond_rates.webp.png`,
			}
		},
		methods: {
		}		
	})
</script>