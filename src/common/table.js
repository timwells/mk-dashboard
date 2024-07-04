const _SECURITY_COL = { title: 'Security', dataIndex: 'security', width: 140, scopedSlots: { customRender: 'security' }}
const _WEIGHT_COL   = { title: 'Weight', dataIndex: 'weight', width: 80, scopedSlots: { customRender: 'weight' }}
const _SECTOR_COL   = { title: 'Sector',dataIndex: 'sector',width: 120, scopedSlots: { customRender: 'sector' }}
const _PERDIOD_COL  = { title: 'Period',dataIndex: 'period',width: 120, scopedSlots: { customRender: 'period' }}
const _RETURN_COL   = { title: 'Return',dataIndex: 'retn',width: 80, scopedSlots: { customRender: 'retn' }}
const _NAME_COL     = { title: 'Name',dataIndex: 'name',scopedSlots: { customRender: 'name' }}
const _COUNTRY_COL  = {title: 'Country',dataIndex: 'country',width: 100, scopedSlots: { customRender: 'country' }}
const _SORT_DIRECTIONS = ["descend", "ascend"]

const HOLDING_Columns = [_SECURITY_COL,_WEIGHT_COL]
const PERIOD_Columns = [_PERDIOD_COL,_RETURN_COL]
const SECTOR_Columns = [_SECTOR_COL,_WEIGHT_COL]
const COUNTRY_Columns = [_COUNTRY_COL,_WEIGHT_COL]

const SORT_TYPE = {
    NUMBER: "NUMBER",
    STRING: "STRING",
};

const genCol = (_title,_index,_width, sortReq, sortType,sortDefault) => {
    let Obj = { title: _title, dataIndex: _index, width: _width, scopedSlots: {customRender: _index},}
    if(_width > 0) { Obj.width = _width }
    if(sortReq) {
        Obj.sortDirections = _SORT_DIRECTIONS
        switch(sortType) {
            case SORT_TYPE.NUMBER: Obj.sorter = (a, b) => a[_index] - b[_index]; break;
            case SORT_TYPE.STRING: Obj.sorter = (a, b) => a[_index].localeCompare(b[_index]); break;
            default: //
        }
    }
    if(sortDefault.length) {
        Obj.defaultSortOrder = sortDefault
    }
    return Obj
}   

const SECTOR_PERFORMANCE_Columns = [
    _NAME_COL,
    genCol('Sensitivity','sensitivity',0,true,SORT_TYPE.STRING,""),
    genCol('Value','value',0,true,SORT_TYPE.NUMBER,""),
    genCol('Change (p)','changePrice',0,true,SORT_TYPE.NUMBER,""),
    genCol('Change (%)','changePercent',0,true,SORT_TYPE.NUMBER,"ascend"),
    genCol('Direction','direction',0,true,SORT_TYPE.STRING,""),
]
const CONSTITUENT_PERFORMANCE_Columns = [
    _NAME_COL,
    {title: 'Price',dataIndex: 'price',scopedSlots: { customRender: 'price' }},
    {title: 'Vol,',dataIndex: 'volume',scopedSlots: { customRender: 'volume' }},
    {title: 'Change (%)',dataIndex: 'changePercent', sortDirections: _SORT_DIRECTIONS, 
        defaultSortOrder: "ascend", sorter: (a, b) => a.changePercent - b.changePercent, 
        scopedSlots: { customRender: 'changePercent'},
    },
    {title: 'Low',dataIndex: 'low',scopedSlots: { customRender: 'low' }},
    {title: 'High',dataIndex: 'high',scopedSlots: { customRender: 'high' }},
    {title: 'Trades',dataIndex: 'trades', sortDirections: _SORT_DIRECTIONS,
        sorter: (a, b) => a.trades - b.trades, scopedSlots: { customRender: 'trades' }},
    {title: 'Direction',dataIndex: 'direction', sortDirections: _SORT_DIRECTIONS, 
        sorter: (a, b) => a.direction.localeCompare(b.direction), scopedSlots: { customRender: 'direction' }}
]
const BROKER_RATINGS_Columns = [
    {title: 'Date',dataIndex: 'date', scopedSlots: { customRender: 'date' }},
    {title: 'Broker',dataIndex: 'broker', 
        sortDirections: _SORT_DIRECTIONS, 
        sorter: (a, b) => a.broker.localeCompare(b.broker),scopedSlots: { customRender: 'broker' }},
    {title: 'Recommendation',dataIndex: 'recommendation', 
        sortDirections: _SORT_DIRECTIONS,
		sorter: (a, b) => a.recommendation.localeCompare(b.recommendation),scopedSlots: { customRender: 'recommendation' }},
    {title: 'Old Target', dataIndex: 'oldTarget',scopedSlots: { customRender: 'oldTarget' }},
    {title: 'New Target', dataIndex: 'newTarget',scopedSlots: { customRender: 'newTarget' }},
    {title: 'Rating',dataIndex: 'ratingType', 
        sortDirections: _SORT_DIRECTIONS, 
        sorter: (a, b) => a.ratingType.localeCompare(b.ratingType),scopedSlots: { customRender: 'ratingType' }}
]
const FUNDS_Columns = [
	{ title: 'Name', dataIndex:'name', sortDirections: _SORT_DIRECTIONS, sorter: (a, b) => a.name.localeCompare(b.name),
	    onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
		scopedSlots: { customRender: 'name', filterDropdown: 'filterDropdown', filterIcon: 'filterIcon' },width: 400, },
    { title: 'Type', dataIndex: 'type', scopedSlots: { customRender: 'type' }, width: 160, },
	{ title: 'Sedol', dataIndex: 'sedol', scopedSlots: { customRender: 'sedol' }, width: 120, },
	{ title: 'Citi Code', dataIndex: 'citicode', scopedSlots: { customRender: 'citicode' }, width: 80 },
	{ title: 'Annual Charge', defaultSortOrder: "ascend",dataIndex: 'netAC', 
        sorter: (a, b) => a.netAC - b.netAC, 
        sortDirections: _SORT_DIRECTIONS, scopedSlots: { customRender: 'netAC' }}
];

module.exports = {
    PERIOD_Columns,
    SECTOR_Columns,
    COUNTRY_Columns,
    SECTOR_PERFORMANCE_Columns,
    CONSTITUENT_PERFORMANCE_Columns,
    BROKER_RATINGS_Columns,
    FUNDS_Columns,
    HOLDING_Columns,
}
