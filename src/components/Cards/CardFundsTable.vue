<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
		<template #title>
			<a-row type="flex" align="middle">
				<a-col :span="24" :md="12">
					<h5 class="font-semibold m-0">Funds Table</h5>
				</a-col>
			</a-row>
		</template>

		<a-table :columns="columns" :data-source="data" :pagination="pagination">
			<template slot="name" slot-scope="name">
				<p class="m-0 font-regular text-muted">{{ name }}</p>
			</template>
			<template slot="type" slot-scope="type">
				<p class="m-0 font-regular text-muted">{{ type }}</p>
			</template>
			<template slot="sedol" slot-scope="sedol">
				<p class="m-0 font-regular text-muted">{{ sedol }}</p>
			</template>
			<template slot="bidPrice" slot-scope="bidPrice">
				<p class="m-0 font-regular text-muted">{{ bidPrice }}</p>
			</template>
			<template slot="askPrice" slot-scope="askPrice">
				<p class="m-0 font-regular text-muted">{{ askPrice }}</p>
			</template>
			<template slot="netIC" slot-scope="netIC">
				<p class="m-0 font-regular text-muted">{{ netIC }}</p>
			</template>
			<template slot="netIA" slot-scope="netIA">
				<p class="m-0 font-regular text-muted">{{ netIA }}</p>
			</template>
		</a-table>
	</a-card>
</template>

<script>
export default ({
	props: {
		data: {
			type: Array,
			default: () => [],
		},
		columns: {
			type: Array,
			default: () => [],
		},
		pagination: {
			type: Object,
			default: () => {return { pageSize: 20 }},
		}
	},
	data() {
		return {}
	},
})

</script>