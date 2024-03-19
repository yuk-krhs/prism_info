var lastSortColumnId    = 5;
var lastSortOrder       = 'desc';

function resetVisible(id)
{
    id = id.startsWith('#') ? id : '#' + id;

    $(id).find(".removed-cell").each(function() {
        $(this).removeClass('removed-cell');
        $(this).attr('rowspan', 1);
    });
};

function sortTable(th)
{
    const table         = th.closest("table");
    const columnId      = th.data('id');
    const sortOrder     = th.hasClass('asc') ? 'desc' : 'asc';

    doSortTable(table, columnId, sortOrder);

    th.toggleClass('asc',  sortOrder === 'asc');
    th.toggleClass('desc', sortOrder === 'desc');

    lastSortColumnId    = columnId;
    lastSortOrder       = sortOrder;
}

function doSortTable(table, columnId, sortOrder)
{
    const rows = table.find("tr.content");

    rows.sort((a, b) => {
        const aElem  = $(a).find(`td[data-id="${columnId}"]`);
        const bElem  = $(b).find(`td[data-id="${columnId}"]`);

        if(aElem.css('display') == 'none')  return 1;
        if(bElem.css('display') == 'none')  return -1;

        const aValue = aElem.data('value');
        const bValue = bElem.data('value');

        if($.isNumeric(aValue) && $.isNumeric(bValue))
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        else
            return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

    rows.detach().appendTo(table);
}

function mergeTableRows(id)
{
    id = id.startsWith('#') ? id : '#' + id;

    $(id).find("th.mergeable").each(function() {
        doMergeTableRows($(id), $(this).data('id'));
    });
}

function doMergeTableRows(table, columnId)
{
    const rows  = table.find("tr.content");
    var count   = 0;

    for(var i = 0; i < rows.length; i+=count)
    {
        const curRow    = rows[i];
        const curCol    = $(curRow).find(`td[data-id="${columnId}"]`);
        const aValue    = curCol.css('display') + curCol.text();
        count           = 1;

        if($(curCol).css('display') != 'none')
        {
            for(var j= i + 1; j < rows.length; ++j)
            {
                const nextRow   = rows[j];
                const nextCol   = $(nextRow).find(`td[data-id="${columnId}"]`);
                const bValue    = nextCol.css('display') + nextCol.text();

                if(aValue != bValue)
                    break;

                nextCol.addClass('removed-cell');
                ++count;
            }

            curCol.attr('rowspan', count);
        } else
        {
            curCol.attr('rowspan', 1);
        }
    }
}
