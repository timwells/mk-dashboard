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
    {title: 'Name',dataIndex: 'name',width: 140, scopedSlots: { customRender: 'name' }},
    {title: 'Value',dataIndex: 'value',width: 80, scopedSlots: { customRender: 'value' }},
    {title: 'Change (p)',dataIndex: 'changePrice',width: 80, scopedSlots: { customRender: 'changeValue' }},
    {title: 'Change (%)',dataIndex: 'changePercent',width: 80, scopedSlots: { customRender: 'changePercent' }}
]

module.exports = {
    HOLDINGColumns,
    PERIODColumns,
    SECTORColumns,
    COUNTRYColumns,
    SECTOR_PERFORMANCEColumns
}
