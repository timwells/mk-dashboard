<template>
	<!-- Main Sidebar -->
	<a-layout-sider
		collapsible
		class="sider-primary"
		breakpoint="lg"
		collapsed-width="0"
		width="220px"
		:collapsed="sidebarCollapsed"
		@collapse="$emit('toggleSidebar', ! sidebarCollapsed)"
		:trigger="null"
		:class="['ant-layout-sider-' + sidebarColor, 'ant-layout-sider-' + sidebarTheme]"
		theme="light"
		:style="{ backgroundColor: 'transparent',}">
			<div class="brand"><img src="images/logo-ct-black.png" alt=""> <span>MK</span></div>
			<hr>
			<!-- Sidebar Navigation Menu -->
			<a-menu theme="light" mode="inline">
				<a-menu-item v-for="item in sidebarItems" :key="item.linkTo">
					<router-link :to="item.linkTo">
						<span class="icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z" fill="#111827"/>
								<path d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z" fill="#111827"/>
								<path d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z" fill="#111827"/>
							</svg>
						</span>
						<span class="label">{{item.title}}</span>
					</router-link>
				</a-menu-item>
			</a-menu>
			<!-- / Sidebar Navigation Menu -->
	</a-layout-sider>
	<!-- / Main Sidebar -->
</template>

<script>
const sidebarItems = [
	// {title: "Markets-Dev", linkTo: "/dashboard-bk"},
	{title: "Markets", linkTo: "/dashboard"},
	// {title: "Curvo", linkTo: "/curvo"},
	{title: "Cypress", linkTo: "/cypress-capital"},
	// {title: "DCF Notes", linkTo: "/dcf"},
	{title: "Ratios",linkTo: "/market-ratios"},
	{title: "Funds",linkTo: "/funds"},
	{title: "ETFs",linkTo: "/etfs"},
	{title: "Pensions",linkTo: "/pensions"},
	{title: "P.Bonds",linkTo: "/premium-bonds"},
	{title: "NakedTrades",linkTo: "/trades"},
	{title: "Dividends",linkTo: "/dividend-data"},

	{title: "Coins",linkTo:'/coins'},
	
	{title: "FED",linkTo: "/fed-insights"},
	{title: "Models",linkTo: "/models"},
	{title: "Dataroma",linkTo: "/dataroma"},

	// {title: "BoE",linkTo: "/boe-irates"},
	{title: "StockWatch",linkTo: "/stock-watch"},

	// {title: "Heatmap",linkTo: "/stock-heatmap"},
	// {title: "Screener",linkTo: "/stock-screener"},
	// {title: "Indicators",linkTo: "/market-indicators"},
	// {title: "News",linkTo: "/news"},
	// {title: "Trading",linkTo: "/trading"},
	// {title: "Quotes",linkTo: "/quotes"},
	// {title: "Trends",linkTo: "/trends"},
	// {title: "SeekingAlpha",linkTo: "/seeking-alpha"},
	// {title: "Fear&Greed",linkTo: "/fear-n-greed"}
];

export default ({
	props: {
		// Sidebar collapsed status.
		sidebarCollapsed: {
			type: Boolean,
			default: true,
		},
		
		// Main sidebar color.
		sidebarColor: {
			type: String,
			default: "primary",
		},
		
		// Main sidebar theme : light, white, dark.
		sidebarTheme: {
			type: String,
			default: "light",
		},
	},
	data() {
		return {
			sidebarCollapsedModel: this.sidebarCollapsed,
			sidebarItems
		}
	},
})

</script>
