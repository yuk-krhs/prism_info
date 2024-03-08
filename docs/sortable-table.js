function sortTable(th)
{
    const table= th.closest("table");

    table.find("td.removed-cell").each(function() { $(this).removeClass('removed-cell'); });

    const columnId  = th.data('id');
    const sortOrder = th.hasClass('asc') ? 'desc' : 'asc';

    doSortTable(table, columnId, sortOrder);

    th.toggleClass('asc',  sortOrder === 'asc');
    th.toggleClass('desc', sortOrder === 'desc');
}

function doSortTable(table, columnId, sortOrder)
{
    const rows = table.find("tr.content");

    rows.sort((a, b) =>
    {
        const aValue = $(a).find(`td[data-id="${columnId}"]`).data('value');
        const bValue = $(b).find(`td[data-id="${columnId}"]`).data('value');

        if($.isNumeric(aValue) && $.isNumeric(bValue))
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        else
            return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

    rows.detach().appendTo(table);
}

function mergeTableRows(table, columnId)
{
    const rows  = table.find("tr.content");
    var count   = 0;

    for(var i = 0; i < rows.length; i+=count)
    {
        const curRow    = rows[i];
        const curCol    = $(curRow).find(`td[data-id="${columnId}"]`);
        const aValue    = curCol.text();
        count           = 1;

        for(var j= i + 1; j < rows.length; ++j)
        {
            const nextRow   = rows[j];
            const nextCol   = $(nextRow).find(`td[data-id="${columnId}"]`);
            const bValue    = nextCol.text();

            if(aValue != bValue)
                break;

            nextCol.addClass('removed-cell');
            ++count;
        }

        curCol.attr('rowspan', count);
    }
}
