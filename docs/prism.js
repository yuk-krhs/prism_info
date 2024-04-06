let cookies = null;

document.addEventListener('keydown', function(event) { if(event.key === 'Escape') history.back(); });

window.onload = function()
{
    var hash    = window.location.hash.substr(1);
    var element = document.getElementById(hash);

    if(element)
        element.classList.add('highlight');
}

function parse_cookies()
{
    cookies = document.cookie.split(';')
        .map(cookie => cookie.split('='))
        .reduce((accumulator, [key, value]) => ({...accumulator, [decodeURIComponent(key.trim())]: decodeURIComponent(value)}), {});
}

function set_cookie(key, value)
{
    let date        = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
    cookies[key]    = String(value);

    //console.log('[' + key + ']=' + String(value));
}

function get_cookie(key, defaultValue)
{
    if(cookies === null)
        parse_cookies();

    return cookies[key] || defaultValue;
}

function rhythm_display(b)
{
    //console.log('rhythm_display=' + b);

	const visible   = String(b) == 'true' ? 'tr.list.rhythm.level' : 'tr.list.rhythm.notes';
	const invisible = String(b) == 'true' ? 'tr.list.rhythm.notes' : 'tr.list.rhythm.level';

	document.querySelectorAll(visible)  .forEach(function(e) { e.classList.remove('invisible-row'); });
	document.querySelectorAll(invisible).forEach(function(e) { e.classList.add('invisible-row'); });

	set_cookie('rhythm_label', String(b));

	return false;
}

function toggleTableCells(visibleDisps, visibleStars, visibleObtains, visibleUnits)
{
    visibleUnits.push('.unit-0');

    var selector1   = visibleDisps  .join(',');
    var selector2   = visibleStars  .join(',');
    var selector3   = visibleObtains.join(',');
    var selector4   = visibleUnits  .join(',');

    $('tr th').each(function() {
        if(!$(this).is(selector1))
            $(this).addClass('removed-cell');
    });

    $('tr.content td').each(function() {
        if(!$(this).is(selector1)
        || !$(this).is(selector2)
        || !$(this).is(selector3)
        || !$(this).is(selector4))
            $(this).addClass('removed-cell');
    });
}

function getVisibleDisps()      { return [ '.disp-0', $("#disp-selector input[name='disp']:checked").val() ]; }
function getVisibleUnits()      { return $($('#unit-checker'))  .find('input[name="unit"]:checked')  .map(function() { return $(this).val(); }).get(); }
function getVisibleObtainss()   { return $($('#obtain-checker')).find('input[name="obtain"]:checked').map(function() { return $(this).val(); }).get(); }
function getVisibleStars()      { return $($('#star-checker'))  .find('input[name="star"]:checked')  .map(function() { return $(this).val(); }).get(); }
function getVisibleRarities()   { return $($('#rarity-checker')).find('input[name="rarity"]:checked').map(function() { return $(this).val(); }).get(); }

function restructPIdolTable(th)
{
    const id = '#pidol-list';

    resetVisible(id);
    toggleTableCells(getVisibleDisps(), getVisibleStars(), getVisibleObtainss(), getVisibleUnits());

    if(th)
        sortTable(th);
    else
        doSortTable($(id), lastSortColumnId, lastSortOrder);

    mergeTableRows(id);

    // todo クッキーに選択状態を保存
}

function restructSCharaTable(th)
{
    const id = '#schara-list';

    resetVisible(id);
    toggleTableCells([ ".disp-0" ], getVisibleRarities(), getVisibleObtainss(), getVisibleUnits());

    if(th)
        sortTable(th);
    else
        doSortTable($(id), lastSortColumnId, lastSortOrder);

    mergeTableRows(id);

    // todo クッキーに選択状態を保存
}
