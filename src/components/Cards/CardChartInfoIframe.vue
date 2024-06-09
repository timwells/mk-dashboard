<template>
	<div>
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :xl="24">
				<a-tabs default-active-key="0">
					<a-tab-pane key="0" tab="Chart">
						<div v-if="details(sedol) !=null" class="card-content" >
							<h5><a :href="details(sedol).href" target="_blank">{{details(sedol).name }}</a></h5>
							<div>
								<span class="price-divide">Bid:{{details(sedol).bidPrice}}</span>
								<span class="price-divide">Ask:{{details(sedol).askPrice}}</span>
								<span class="price-divide"><img :src="details(sedol).changeArrow"/></span>
								<span class="price-divide">{{details(sedol).changeAmount}}</span>
								<span class="price-divide">Type:{{details(sedol).type }}</span>
								<span class="price-divide">netIC:{{details(sedol).netIC}}%</span>							
								<span class="price-divide">netAC:{{details(sedol).netAC}}%</span>
							</div>
							<img :src="chart" height="300" width="100%">
						</div>
					</a-tab-pane>
					<a-tab-pane key="1" tab="Holdings">
						<a-card v-if="details(sedol)">
							<div class="card-content">
								<!-- Weights Table -->
								<a-table 
									:columns="hCols"
									:data-source="details(sedol).holdings"
									:pagination="pagination"
									class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
									<template slot="security" slot-scope="security">
										<p class="m-0 font-regular text-muted">{{ security }}</p>
									</template>

									<template slot="weight" slot-scope="weight">
										<p class="m-0 font-regular text-muted">{{ weight }}</p>
									</template>

								</a-table>
							</div>
						</a-card>
					</a-tab-pane>
					<a-tab-pane key="2" tab="Performance">
						<a-card v-if="details(sedol)">
							<div class="card-content">
								<!-- Returns Table -->
								<a-table 
									:columns="pCols"
									:data-source="details(sedol).performance"
									:pagination="pagination"
									class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
									<template slot="period" slot-scope="period">
										<p class="m-0 font-regular text-muted">{{ period }}</p>
									</template>

									<template slot="retn" slot-scope="retn">
										<p class="m-0 font-regular text-muted">{{ retn }}</p>
									</template>
								</a-table>
							</div>
						</a-card>
					</a-tab-pane>
					<a-tab-pane key="3" tab="Sectors">
						<a-card v-if="details(sedol)">
							<div class="card-content">
								<!-- Weights Table -->
								<a-table 
									:columns="sCols"
									:data-source="details(sedol).sectors"
									:pagination="pagination"
									class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
									<template slot="security" slot-scope="sector">
										<p class="m-0 font-regular text-muted">{{ sector }}</p>
									</template>

									<template slot="weight" slot-scope="weight">
										<p class="m-0 font-regular text-muted">{{ weight }}</p>
									</template>
								</a-table>
							</div>
						</a-card>
					</a-tab-pane>
					<a-tab-pane key="4" tab="Countries">
						<a-card v-if="details(sedol)">
							<div class="card-content">
								<!-- Weights Table -->
								<a-table 
									:columns="cCols"
									:data-source="details(sedol).countries"
									:pagination="pagination"
									class='table table-small' style="margin: 0; background-color: rgb(253, 253, 253);">			
									<template slot="security" slot-scope="country">
										<p class="m-0 font-regular text-muted">{{ country }}</p>
									</template>

									<template slot="weight" slot-scope="weight">
										<p class="m-0 font-regular text-muted">{{ weight }}</p>
									</template>
								</a-table>
							</div>
						</a-card>
					</a-tab-pane>
				</a-tabs>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

const hCols = [{
		title: 'Security',
		dataIndex: 'security',
		width: 140, 
		scopedSlots: { customRender: 'security' }
	},{
		title: 'Weight',
		dataIndex: 'weight',
		width: 80, 
		scopedSlots: { customRender: 'weight' }
	}
]

// "performance":[{"period":"26/02/19 to 26/02/20","retn":"4.66%"},
const pCols = [
	{
		title: 'Period',
		dataIndex: 'period',
		width: 140, 
		scopedSlots: { customRender: 'period' }
	},{
		title: 'Return',
		dataIndex: 'retn',
		width: 80, 
		scopedSlots: { customRender: 'retn' }
	}
]

const sCols = [{
		title: 'Sector',
		dataIndex: 'sector',
		width: 140, 
		scopedSlots: { customRender: 'sector' }
	},{
		title: 'Weight',
		dataIndex: 'weight',
		width: 80, 
		scopedSlots: { customRender: 'weight' }
	}
]

const cCols = [{
		title: 'Country',
		dataIndex: 'country',
		width: 140, 
		scopedSlots: { customRender: 'country' }
	},{
		title: 'Weight',
		dataIndex: 'weight',
		width: 80, 
		scopedSlots: { customRender: 'weight' }
	}
]

export default ({
	props: {
		title:       { type: String, default: "" },
		fund:        { type: String, default: "" },
		sedol:       { type: String, default: "" },
		citicode:    { type: String, default: ""},
		holdings:    {type: Array},
		performance: {type: Array}
	},
	computed: {
    	...mapState("funds", ["fundDetails"]),
		...mapGetters("funds",["gfundDetail"]),
	},
	watch: {
		fundDetails(o,n) {
			// console.log(o,n)
		}
	},
	data() {
		return {
			chart: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=F${this.citicode}&color=f65d1a&hide=&span=M120&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,				
			hCols,
			pCols,
			sCols,
			cCols,
			pagination: false
		}
	},
	methods: {
		details(key) {
			console.log("details:",key)
			return this.gfundDetail(key)
		}
	},
	mounted() {
		console.log("mounted:",this.fund);
		this.$store.dispatch("funds/getFundDetail",{fund: this.fund });
	}
})

/*
https://online.hl.co.uk/ajaxx/stocks.php?pid=1717879931068&sq=NG%2C&filters=funds,&offset=0&instance=&format=jsonp

http://www.hl.co.uk/shares/shares-search-results/0709954

http://www.hl.co.uk/shares/shares-search-results/3197794

https://online.hl.co.uk/ajaxx/stocks.php?pid=1717882723137&sq=Pru&filters=funds,&offset=0&instance=&format=jsonp


<select id="companyid" style="width:100%;" name="companyid" onchange="$('#investment').val('');$('#search-home').submit()" class="form__input -inputType-select">
<option value="">Please select</option><option value="128">Aberdeen Standard Investments</option>
<option value="041">AdvisorShares</option>
<option value="042">ALPS ETF Trust</option>
<option value="115">Amplify ETFs</option>
<option value="043">Amundi ETFs</option>
<option value="051">Ark Investment Management</option>
<option value="065">ArrowShares</option>
<option value="013">Barclays iPath ETNs (US)</option>
<option value="099">Bioshares</option>
<option value="076">Cambria Funds</option>
<option value="066">Credit Suisse ETNs</option>
<option value="033">CurrencyShares (Guggenheim)</option>
<option value="030">db ETCs</option>
<option value="003">db X-Trackers</option>
<option value="054">db X-Trackers (US)</option>
<option value="010">Direxion Shares ETFs</option>
<option value="078">DNB ETFs</option>
<option value="114">Fidelity ETFs</option>
<option value="008">Fidelity ETFs (US)</option>
<option value="046">First Trust Portfolios</option>
<option value="026">First Trust Portfolios (US)</option>
<option value="119">Franklin</option>
<option value="015">Global X Funds</option>
<option value="037">Gold Bullion Securities (ETFS)</option>
<option value="096">Goldman Sachs AM ETFs</option>
<option value="135">GraniteShares</option>
<option value="129">HANetf</option>
<option value="016">HSBC ETFs</option>
<option value="127">Invesco Markets</option>
<option value="001">iShares</option>
<option value="027">iShares (Germany)</option>
<option value="064">iShares (Switzerland)</option>
<option value="004">iShares (US)</option>
<option value="111">ITEQ ETFs</option>
<option value="086">JPMorgan ETFs</option>
<option value="077">KraneShares ETF</option>
<option value="138">KraneShares ICAV</option>
<option value="130">Legal &amp; General</option>
<option value="133">Leverage Shares plc</option>
<option value="109">Loncar Investments</option>
<option value="017">Lyxor</option>
<option value="039">Market Access</option>
<option value="098">MomentumShares</option>
<option value="073">Ossiam</option>
<option value="137">PIMCO</option>
<option value="052">PIMCO ETFs (US)</option>
<option value="007">Powershares (US)</option>
<option value="006">ProShares</option>
<option value="134">Robeco</option>
<option value="062">Robo-Stox</option>
<option value="053">Schwab ETFs</option>
<option value="061">SPDR</option>
<option value="012">SPDR (US)</option>
<option value="079">Sprott Asset Management</option>
<option value="132">Tabula</option>
<option value="059">UBS ETFs</option>
<option value="047">UBS Switzerland</option>
<option value="094">Vaneck Vectors</option>
<option value="009">Vaneck Vectors (US)</option>
<option value="058">Vanguard ETFs</option>
<option value="022">Vanguard ETFs (US)</option>
<option value="019">Wisdomtree ETFs</option>
<option value="023">Wisdomtree ETFs (US)</option>
<option value="106">XBT Provider</option>
<option value="084">YieldShares</option>
<option value="029">ZKB ETFs</option>
</select>

<select id="sectorid" name="sectorid" onchange="$('#investment').val('');$('#search-home').submit()" class="form__input -inputType-select">
<option value="">Please select</option>
<option value="301">Bond, Money Market &amp; Fixed Interest ETP - Emerging Market</option>
<option value="302">Bond, Money Market &amp; Fixed Interest ETP - Europe</option>
<option value="303">Bond, Money Market &amp; Fixed Interest ETP - North America</option>
<option value="304">Bond, Money Market &amp; Fixed Interest ETP - UK</option>
<option value="305">Bond, Money Market &amp; Fixed Interest ETP - World</option>
<option value="306">Commodity ETP - Agriculture</option>
<option value="307">Commodity ETP - Composite</option>
<option value="308">Commodity ETP - Energy</option>
<option value="354">Commodity ETP - Gold</option>
<option value="309">Commodity ETP - Industrial Metals</option>
<option value="310">Commodity ETP - Livestock</option>
<option value="356">Commodity ETP - Oil</option>
<option value="311">Commodity ETP - Precious Metals</option>
<option value="355">Commodity ETP - Silver</option>
<option value="312">Commodity ETP - Soft</option>
<option value="314">Currency ETP - Europe</option>
<option value="315">Currency ETP - North America</option>
<option value="316">Currency ETP - Rest of the World</option>
<option value="317">Currency ETP - UK</option>
<option value="050">Delisted/Unlisted</option>
<option value="318">Equity ETP by Area - Africa &amp; Middle East</option>
<option value="319">Equity ETP by Area - Asia Pacific</option>
<option value="320">Equity ETP by Area - Developed Mkt</option>
<option value="321">Equity ETP by Area - Emerging Market</option>
<option value="322">Equity ETP by Area - Europe</option>
<option value="357">Equity ETP by Area - FTSE 100</option>
<option value="358">Equity ETP by Area - FTSE 250</option>
<option value="323">Equity ETP by Area - Japan</option>
<option value="324">Equity ETP by Area - Latin &amp; South America</option>
<option value="325">Equity ETP by Area - North America</option>
<option value="326">Equity ETP by Area - Other</option>
<option value="327">Equity ETP by Area - Russia</option>
<option value="328">Equity ETP by Area - UK</option>
<option value="329">Equity ETP by Area - World</option>
<option value="330">Equity ETP by Sector - Banks &amp; Financials</option>
<option value="331">Equity ETP by Sector - Basic Materials</option>
<option value="332">Equity ETP by Sector - Consumer goods</option>
<option value="333">Equity ETP by Sector - Energy</option>
<option value="334">Equity ETP by Sector - Health</option>
<option value="335">Equity ETP by Sector - Industrials</option>
<option value="336">Equity ETP by Sector - Large, Mid, Small and Micro Cap</option>
<option value="337">Equity ETP by Sector - Oil &amp; Gas</option>
<option value="338">Equity ETP by Sector - Property</option>
<option value="339">Equity ETP by Sector - Technology</option>
<option value="340">Equity ETP by Sector - Telecoms</option>
<option value="341">Equity ETP by Sector - Utilities</option>
<option value="342">Equity ETP by Sector - Volatility Index</option>
<option value="359">ETP - Other</option>
</select>



*/

// https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=FKSFU&color=f65d1a&hide=&span=M60&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_
/*
	data() {
		return {
			url: `https://webfund6.financialexpress.net/clients/Hargreaves/chartingTool.aspx?code=${this.sedol}&CodeType=SEDOL&InstrType=F`,
			url2: `https://webfund6.financialexpress.net/clients/Hargreaves/chartbuilder.aspx?codes=F${this.citicode}&color=f65d1a&hide=&span=M60&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`,				
			holdingsCols
			// pagination: { pageSize: 20 }
		},
	},

*/
</script>

<style lang="scss">
.ant-card-body {
	.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    	padding: 6px 6px;
	}
}

.change-divide .change {
    font-size: 1.3em;
    margin-right: 0.1em;
    font-weight: bold;
}

.price-divide {
    font-size: 1.3em;
    font-weight: bold;
    margin-right: 0.4em;
    padding-right: 0.4em;
    border-right: 0.13em solid #1e1d56;
}
</style>
