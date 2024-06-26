const HOLDINGColumns = [
    {title: 'Security', dataIndex: 'security', width: 140, scopedSlots: { customRender: 'security' }},
    {title: 'Weight', dataIndex: 'weight', width: 80, scopedSlots: { customRender: 'weight' }}
]
const PERIODColumns = [
    {title: 'Period',dataIndex: 'period',width: 140, scopedSlots: { customRender: 'period' }},
    {title: 'Return',dataIndex: 'retn',width: 80, scopedSlots: { customRender: 'retn' }}
]
const SECTORColumns = [
    {title: 'Sector',dataIndex: 'sector',width: 140, scopedSlots: { customRender: 'sector' }},
    {title: 'Weight',dataIndex: 'weight',width: 80, scopedSlots: { customRender: 'weight' }}
]
const COUNTRYColumns = [
    {title: 'Country',dataIndex: 'country',width: 140, scopedSlots: { customRender: 'country' }},
    {title: 'Weight',dataIndex: 'weight',width: 80, scopedSlots: { customRender: 'weight' }}
]
const SECTOR_PERFORMANCEColumns = [
    {title: 'Name',dataIndex: 'name',scopedSlots: { customRender: 'name' }},
    {title: 'Value',dataIndex: 'value',sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.value - b.value, scopedSlots: { customRender: 'value' }},
    {title: 'Change (p)',dataIndex: 'changePrice', sortDirections: ["descend", "ascend"],
		sorter: (a, b) => a.changePrice - b.changePrice, scopedSlots: { customRender: 'changePrice' }},
    
    {title: 'Change (%)',dataIndex: 'changePercent', 
        sortDirections: ["descend", "ascend"],
        defaultSortOrder: "ascend", 
        sorter: (a, b) => a.changePercent - b.changePercent, 
        scopedSlots: { customRender: 'changePercent' }
    },
    {title: 'Direction',dataIndex: 'direction', sortDirections: ["descend", "ascend"], 
        sorter: (a, b) => a.direction.localeCompare(b.direction), scopedSlots: { customRender: 'direction' }}
]
const CONSTITUENT_PERFORMANCE_Columns = [
    {title: 'Name',dataIndex: 'name',scopedSlots: { customRender: 'name' }},
    {title: 'Price',dataIndex: 'price',scopedSlots: { customRender: 'price' }},
    {title: 'Vol,',dataIndex: 'volume',scopedSlots: { customRender: 'volume' }},
    {title: 'Change (%)',dataIndex: 'changePercent', sortDirections: ["descend", "ascend"], 
        defaultSortOrder: "ascend", sorter: (a, b) => a.changePercent - b.changePercent, 
        scopedSlots: { customRender: 'changePercent'},
    },
    {title: 'Low',dataIndex: 'low',scopedSlots: { customRender: 'low' }},
    {title: 'High',dataIndex: 'high',scopedSlots: { customRender: 'high' }},
    {title: 'Trades',dataIndex: 'trades', sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.trades - b.trades, scopedSlots: { customRender: 'trades' }},
    {title: 'Direction',dataIndex: 'direction', sortDirections: ["descend", "ascend"], 
        sorter: (a, b) => a.direction.localeCompare(b.direction), scopedSlots: { customRender: 'direction' }}
]
module.exports = {
    HOLDINGColumns,
    PERIODColumns,
    SECTORColumns,
    COUNTRYColumns,
    SECTOR_PERFORMANCEColumns,
    CONSTITUENT_PERFORMANCE_Columns
}
