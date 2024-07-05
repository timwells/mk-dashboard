const _SECURITY_COL = { title: 'Security', dataIndex: 'security', width: 140, scopedSlots: { customRender: 'security' }}
const _WEIGHT_COL   = { title: 'Weight', dataIndex: 'weight', width: 80, scopedSlots: { customRender: 'weight' }}
const _SECTOR_COL   = { title: 'Sector',dataIndex: 'sector',width: 120, scopedSlots: { customRender: 'sector' }}
const _PERDIOD_COL  = { title: 'Period',dataIndex: 'period',width: 120, scopedSlots: { customRender: 'period' }}
const _RETURN_COL   = { title: 'Return',dataIndex: 'retn',width: 80, scopedSlots: { customRender: 'retn' }}
const _COUNTRY_COL  = { title: 'Country',dataIndex: 'country',width: 100, scopedSlots: { customRender: 'country' }}
const _SORT_DIRECTIONS = ["descend", "ascend"]

const HOLDING_Columns = [_SECURITY_COL,_WEIGHT_COL]
const PERIOD_Columns = [_PERDIOD_COL,_RETURN_COL]
const SECTOR_Columns = [_SECTOR_COL,_WEIGHT_COL]
const COUNTRY_Columns = [_COUNTRY_COL,_WEIGHT_COL]

const SORT_TYPE = { NUMBER: "NUMBER",STRING: "STRING" };

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
        if(sortDefault.length) { Obj.defaultSortOrder = sortDefault }
    }
    return Obj
}   
const SECTOR_PERFORMANCE_Columns = [
    genCol('Name','name',100,false,null,""),
    genCol('Sensitivity','sensitivity',0,true,SORT_TYPE.STRING,""),
    genCol('Value','value',0,true,SORT_TYPE.NUMBER,""),
    genCol('Change (p)','changePrice',0,true,SORT_TYPE.NUMBER,""),
    genCol('Change (%)','changePercent',0,true,SORT_TYPE.NUMBER,"ascend"),
    genCol('Direction','direction',0,true,SORT_TYPE.STRING,""),
]
const CONSTITUENT_PERFORMANCE_Columns = [
    genCol('Name','name',100,false,null,""),
    genCol('Price','price',0,false,null,""),
    genCol('Vol.','volume',0,false,null,""),
    genCol('Change (%)','changePercent',0,true,SORT_TYPE.NUMBER,"ascend"),
    genCol('Low','low',0,false,null,""),
    genCol('High','high',0,false,null,""),
    genCol('Trades','trades',0,true,SORT_TYPE.NUMBER,""),
    genCol('Direction','direction',0,true,SORT_TYPE.STRING,""),
]
const BROKER_RATINGS_Columns = [
    genCol('Date','date',0,false,null,""),
    genCol('Broker','broker',0,true,SORT_TYPE.STRING,""),
    genCol('Recommendation','recommendation',0,true,SORT_TYPE.STRING,""),
    genCol('Old Target','oldTarget',0,false,null,""),
    genCol('New Target','newTarget',0,false,null,""),
    genCol('Rating','ratingType',0,true,SORT_TYPE.STRING,""),
]
const FUNDS_Columns = [
	{ title: 'Name', dataIndex:'name', sortDirections: _SORT_DIRECTIONS, sorter: (a, b) => a.name.localeCompare(b.name),
	    onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
		scopedSlots: { customRender: 'name', filterDropdown: 'filterDropdown', filterIcon: 'filterIcon' },width: 280, },
    
    genCol('Type','type',160,false,null,""),
    genCol('Sedol','sedol',120,false,null,""),
    genCol('Citi','citicode',80,false,null,""),
    genCol('Annual Charge','netAC',0,true,SORT_TYPE.NUMBER,"ascend"),
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