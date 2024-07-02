<template>
	<a-tabs default-active-key="1">
		<a-tab-pane key="1" tab="Movement">
			<a-row :gutter="24" type="flex">
				<a-col :span="24" class="mb-24">
					<a-table
						:loading="loading"
						:columns="cols"
						:data-source="indexData" 
						:pagination="pagination"
						:rowKey="(record,i) => i"
						@expand="onExpand"
						@expandedRowsChange="expandedRowsChange"
						class='table table-small' style="margin: 0; background-color: white;">	
						<template slot="expandedRowRender" slot-scope="record">
							<a-tabs default-active-key="1">
								<a-tab-pane key="1" tab="TradeView">
									<a :href="tradeView(record.epic)" target="_blank">{{record.epic}}</a>
								</a-tab-pane>
							</a-tabs>
						</template>
					</a-table>
				</a-col>
			</a-row>
		</a-tab-pane>
		<a-tab-pane key="2" tab="Stats">
			<!--`apexchart 
				height="auto" 
				:options="chartOptions" 
				:series="chartOptions.series">
			</apexchart-->
			<apexchart 
				height="auto" 
				:options="chartOptions2" 
				:series="optionsChart2.series">
			</apexchart>
		</a-tab-pane>
	</a-tabs>
</template>

<script>
import { mapState } from "vuex";

const epicCorrections = [
	{in:"T17",out:"TM17"},
	{in:"BAE",out:"BA."}
]

const cols = [
	{ 
		title: 'Index', dataIndex: 'index', 
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.index.localeCompare(b.index),	
		scopedSlots: { customRender: 'index' }
	},
	{ title: 'Epic', dataIndex: 'epic', scopedSlots: { customRender: 'epic' }},
	{ title: 'Name', dataIndex: 'name', scopedSlots: { customRender: 'name' }},
	{ title: 'Price', dataIndex: 'price', scopedSlots: { customRender: 'price' }},
	{ 
		title: 'Change', dataIndex: 'change', 
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.change - b.change,
		scopedSlots: { customRender: 'change' }
	},
	{ 
		title: '%', dataIndex: 'percentage', 
		sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.percentage - b.percentage,
		scopedSlots: { customRender: 'percentage' }
	},
];

export default ({
	components: {},
	computed: {
		...mapState("funds", ["indexData"]),
		...mapState("app", ["secrets"])
	},
	watch: {
        indexData(nn, prv) {
			if(nn.length > 0) this.loading = false;
		},
	},
	data() {
		return {
			cols,
			loading: true,
			pagination: { pageSize: 1000, onChange: (p) => {}},
			expandedIdList: [],
			expandedRowKeys: [],

			optionsChart2 :{
          		series: [{
          			name: 'Inflation',
          			data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
        		}],
          		chart: {
          			height: 350,
          			type: 'bar',
        		},
        		plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          }
        		},
        		dataLabels: {
          		enabled: true,
          			formatter: function (val) {
            		return val + "%";
          		},
          		offsetY: -20,
          		style: {
            		fontSize: '12px',
            		colors: ["#304758"]
          		}
        		},
        
				xaxis: {
					categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
					position: 'top',
					axisBorder: {
						show: false
					},
					axisTicks: {
						show: false
					},
					crosshairs: {
					fill: {
						type: 'gradient',
						gradient: {
							colorFrom: '#D8E3F0',
							colorTo: '#BED1E6',
							stops: [0, 100],
							opacityFrom: 0.4,
							opacityTo: 0.5,
						}
					}
				},
				tooltip: {
					enabled: true,
					}
				},
				yaxis: {
					axisBorder: {
						show: false
					},
					axisTicks: {
						show: false,
					},
					labels: {
						show: false,
						formatter: function (val) {
						return val + "%";
						}
					}        
	        	},
				title: {
					text: 'Monthly Inflation in Argentina, 2002',
					floating: true,
					offsetY: 330,
					align: 'center',
					style: {
						color: '#444'
					}
				},
			},
			
			chartOptions :{
				chart: {
					height: 350,
					type: "line",
					stacked: false
				},
				dataLabels: {
					enabled: false
				},
				colors: ["#FF1654", "#247BA0"],
				series: [
					{
					name: "Series A",
					data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
					},
					{
					name: "Series B",
					data: [20, 29, 37, 36, 44, 45, 50, 58]
					}
				],
				stroke: {
					width: [4, 4]
				},
				plotOptions: {
					bar: {
					columnWidth: "20%"
					}
				},
				xaxis: {
					categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
				},
				yaxis: [
					{
					axisTicks: {
						show: true
					},
					axisBorder: {
						show: true,
						color: "#FF1654"
					},
					labels: {
						style: {
						colors: "#FF1654"
						}
					},
					title: {
						text: "Series A",
						style: {
						color: "#FF1654"
						}
					}
					},
					{
						opposite: true,
						axisTicks: {
							show: true
					},
					axisBorder: {
						show: true,
						color: "#247BA0"
					},
					labels: {
						style: {
						colors: "#247BA0"
						}
					},
					title: {
						text: "Series B",
						style: {
						color: "#247BA0"
						}
					}
				}
			],
				tooltip: {
					shared: false,
					intersect: true,
					x: {
					show: false
					}
				},
				legend: {
					horizontalAlign: "left",
					offsetX: 40
				}
			},
		}
	},
	mounted() {
        this.$store.dispatch("funds/getIndexData")
	},
	methods: {
		fullSymbol(epic) {
			// fix epics
			const nEpic = epicCorrections.find(e => (epic == e.in))		
			if(nEpic) return "LSE:" + nEpic.out; 
			return "LSE:" + epic; 
		},
		onExpand(exp,r) { 
			if(!exp) {}
		},
		expandedRowsChange(r) {},
		tradeView(epic) {
			return `https://www.tradingview.com/chart/${this.secrets.tradingviewid}?symbol=${this.fullSymbol(epic)}&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=${this.fullSymbol(epic)}`
		},
	}
})


// https://api.octopus.energy/v1/accounts/A-5C05B1B2

</script>

<style>
.ant-table-thead > tr > th, .ant-table-tbody > tr > td { padding: 8px 8px; }
</style>