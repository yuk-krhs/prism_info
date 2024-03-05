let cookies = null;

function parse_cookies() {
    cookies = document.cookie.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({...accumulator, [decodeURIComponent(key.trim())]: decodeURIComponent(value)}), {});
}

function set_cookie(key, value) {
    let date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
    cookies[key]= value;
}

function get_cookie(key, defaultValue) {
    if (cookies === null) {
        parse_cookies();
    }
    return cookies[key] || defaultValue;
}

function rhythm_display(b) {
	const visible   = b ? 'tr.list.rhythm.level' : 'tr.list.rhythm.notes';
	const invisible = b ? 'tr.list.rhythm.notes' : 'tr.list.rhythm.level';

	document.querySelectorAll(visible)  .forEach(function(e) { e.classList.remove('invisible-row'); });
	document.querySelectorAll(invisible).forEach(function(e) { e.classList.add('invisible-row'); });

	set_cookie('rhythm_label', b);

	return false;
}
