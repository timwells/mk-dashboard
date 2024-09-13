<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 8}">

		
		<a-table 
			:columns="columns" 
			:data-source="data" 
			:pagination="pagination" 
			:rowKey="(record,i) => i"
			class='table table-small' style="margin: 6">
                <div slot="filterDropdown"
                	slot-scope="{setSelectedKeys,selectedKeys,confirm,clearFilters,column}"
                  	style="padding: 8px">
                  	<a-input
                    	v-ant-ref="c => (searchInput = c)"
                    	:placeholder="`Search ${column.dataIndex}`"
                    	:value="selectedKeys[0]"
                    	style="width:188px; margin-bottom:8px; display: block"
                    	@change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                    	@pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"/>
                  	<a-button
                    	type="primary"
                    	icon="search"
                    	size="small"
                    	style="width: 90px; margin-right: 8px"
                    	@click="() => handleSearch(selectedKeys, confirm, column.dataIndex)">
						Search</a-button>
                  	<a-button
                    	size="small"
                    	style="width: 90px"
                    	@click="() => handleReset(clearFilters)">
						Reset
					</a-button>
                </div>
                <a-icon
                  slot="filterIcon"
                  slot-scope="filtered"
                  type="search"
                  :style="{ color: filtered ? '#108ee9' : undefined }"
                />
			<a-button icon="plus" type="primary" slot="action" slot-scope="record" @click="onExpand(record.key)"></a-button>

			<div slot="expandedRowRender" slot-scope="record" style="margin: 0">
				<CardFundDetails
					:fundTitle="record.full_description">
				</CardFundDetails>
			</div>
			
			<!-- Fund Name -->
			<template slot="full_description" slot-scope="text, record, index, column">
				<span v-if="searchText && searchedColumn === column.dataIndex">
                    <template v-for="(fragment, i) in text
                        .toString()
                        .split(new RegExp(`(?<=${searchText})|(?=${searchText})`,'i'))">
                      	<mark v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                        	:key="i"
                        	class="highlight">{{ fragment }}</mark>
                      	<template v-else>{{ fragment }}</template>
                    </template>
				</span>
                <template v-else>
                	{{ text }}
                </template>
			</template>
			<!-- Fund Type -->
			<!--template slot="type" slot-scope="type">
				<p class="m-0 font-regular text-muted">{{ type }}</p>
			</template-->
			<!-- Fund SEDOL -->
			<!--template slot="sedol" slot-scope="sedol">
				<p class="m-0 font-regular text-muted">{{ sedol }}</p>
			</template-->
			<!-- Fund CITICODE -->
			<!--template slot="citicode" slot-scope="citicode">
				<p class="m-0 font-regular text-muted">F{{ citicode }}</p>
			</template-->
			<!-- Fund Annual Charge -->
			<!--template slot="netAC" slot-scope="netAC">
				<p class="m-0 font-regular text-muted">{{ netAC }}</p>
			</template-->
		</a-table>
	</a-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import CardFundDetails from '@/components/Cards/CardFundDetails';
import CardChartInfoIframe from '@/components/Cards/CardChartInfoIframe';

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
			default: () => {return { pageSize: 1000 }},
		},
		searchIndex: {
			type: String,
			default: "full_description"
		}
	},
	components: {
		CardFundDetails
	},
	computed: {
	},
	data() {
		return {
			curExpandedRowKeys: [],
			selectedRowKeys: [],
			searchText: "",
	    	searchInput: null,
    		searchedColumn: "",
		}
	},
	methods: {
   		onExpand(rowkey) {
			if (this.curExpandedRowKeys.length > 0) {
				let index = this.curExpandedRowKeys.indexOf(rowkey);
				if (index > -1) {
					this.curExpandedRowKeys.splice(index, 1);
				} else {
					this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length);
					this.curExpandedRowKeys.push(rowkey);
				}
			} else {
				this.curExpandedRowKeys.push(rowkey);
			}
	    },
		handleSearch(selectedKeys, confirm, dataIndex) {
      		confirm();
      		this.searchText = selectedKeys[0];
      		this.searchedColumn = dataIndex;
    	},
    	handleReset(clearFilters) {
      		clearFilters();
      		this.searchText = "";
    	},
  	}
})

</script>