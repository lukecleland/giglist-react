<?php
// Keep this endpoint compatible with the production PHP 5.6 runtime.

// A live iCalendar feed for artist, venue, suburb and 25 km city URLs.
$slug = strtolower((string) (isset($_GET['slug']) ? $_GET['slug'] : ''));
$months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
$month = isset($_GET['month']) ? array_search(strtolower((string) $_GET['month']), $months, true) : null;
if ($month === false) { http_response_code(400); exit('Invalid calendar month'); }
if (!preg_match('/^[a-z0-9]{1,120}$/', $slug)) {
    http_response_code(400);
    exit('Invalid calendar name');
}

function compactName($value) {
    $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    if (class_exists('Normalizer')) $value = Normalizer::normalize($value, Normalizer::FORM_KD) ?: $value;
    $value = strtolower(iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value) ?: $value);
    return preg_replace('/[^a-z0-9]/', '', $value);
}
function escapeIcs($value) {
    $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return str_replace(["\\", "\r\n", "\r", "\n", ',', ';'], ["\\\\", '\\n', '\\n', '\\n', '\\,', '\\;'], $value);
}
function foldLine($value) {
    return implode("\r\n ", str_split($value, 70));
}
function withinCity(array $gig, array $city) {
    $lat = filter_var((isset($gig['lat']) ? $gig['lat'] : null), FILTER_VALIDATE_FLOAT);
    $lng = filter_var((isset($gig['lng']) ? $gig['lng'] : null), FILTER_VALIDATE_FLOAT);
    if ($lat === false || $lng === false || abs($lat) > 90 || abs($lng) > 180 || ($lat == 0 && $lng == 0)) {
        return strtolower(trim((string) (isset($gig['suburb']) ? $gig['suburb'] : ''))) === strtolower($city[0]) &&
            (empty($gig['state']) || strtoupper((string) $gig['state']) === $city[1]);
    }
    $dl = deg2rad($lat - $city[2]); $dg = deg2rad($lng - $city[3]);
    $a = sin($dl / 2) ** 2 + cos(deg2rad($city[2])) * cos(deg2rad($lat)) * sin($dg / 2) ** 2;
    return 6371 * 2 * atan2(sqrt($a), sqrt(max(0, 1 - $a))) <= 25;
}
function slugPart($value) {
    $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $value = str_replace('&', ' and ', $value);
    $value = strtolower(iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value) ?: $value);
    $value = trim(preg_replace('/[^a-z0-9]+/', '-', $value), '-');
    return $value !== '' ? $value : 'gig';
}

$cities = [
    'sydney'=>['Sydney','NSW',-33.86785,151.20732], 'melbourne'=>['Melbourne','VIC',-37.814,144.96332],
    'brisbane'=>['Brisbane','QLD',-27.46794,153.02809], 'perth'=>['Perth','WA',-31.95224,115.8614],
    'adelaide'=>['Adelaide','SA',-34.92866,138.59863], 'canberra'=>['Canberra','ACT',-35.28346,149.12807],
    'hobart'=>['Hobart','TAS',-42.87936,147.32941], 'darwin'=>['Darwin','NT',-12.46113,130.84185],
    'goldcoast'=>['Gold Coast','QLD',-28.00029,153.43088], 'newcastle'=>['Newcastle','NSW',-32.92953,151.7801],
    'wollongong'=>['Wollongong','NSW',-34.424,150.89345], 'geelong'=>['Geelong','VIC',-38.14711,144.36069],
    'townsville'=>['Townsville','QLD',-19.26639,146.80569], 'cairns'=>['Cairns','QLD',-16.92366,145.76613],
    'toowoomba'=>['Toowoomba','QLD',-27.56056,151.95386], 'launceston'=>['Launceston','TAS',-41.43876,147.13467],
    'sunshinecoast'=>['Sunshine Coast','QLD',-26.65682,153.07955],
];

$handle = curl_init('https://giglist.com.au/feed_national.php');
curl_setopt_array($handle, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_FOLLOWLOCATION=>false, CURLOPT_TIMEOUT=>15, CURLOPT_CONNECTTIMEOUT=>5]);
$json = curl_exec($handle);
$code = curl_getinfo($handle, CURLINFO_HTTP_CODE);
curl_close($handle);
$dates = $json !== false && $code === 200 ? json_decode($json, true) : null;
if (!is_array($dates)) {
    http_response_code(502);
    exit('Gig feed unavailable');
}
$all = [];
foreach ($dates as $day) foreach ((isset($day['listings']) ? $day['listings'] : []) as $gig) if (is_array($gig)) $all[] = $gig;
$artist = null; $venue = null; $suburb = null;
foreach ($all as $gig) {
    if ($artist === null && compactName((string) (isset($gig['artist']) ? $gig['artist'] : '')) === $slug) $artist = (string) $gig['artist'];
    if ($venue === null && compactName((string) (isset($gig['name']) ? $gig['name'] : '')) === $slug) $venue = (string) $gig['name'];
    if ($suburb === null && compactName((string) (isset($gig['suburb']) ? $gig['suburb'] : '')) === $slug) $suburb = (string) $gig['suburb'];
}
$mode = $artist !== null ? 'artist' : ($venue !== null ? 'venue' : (isset($cities[$slug]) ? 'city' : ($suburb !== null ? 'suburb' : 'unknown')));
$title = $artist !== null ? $artist : ($venue !== null ? $venue : (isset($cities[$slug]) ? $cities[$slug][0] : ($suburb !== null ? $suburb : $slug)));
$zones = ['WA'=>'Australia/Perth','SA'=>'Australia/Adelaide','NT'=>'Australia/Darwin','QLD'=>'Australia/Brisbane','NSW'=>'Australia/Sydney','ACT'=>'Australia/Sydney','VIC'=>'Australia/Melbourne','TAS'=>'Australia/Hobart'];
$events = [];$seen = [];
foreach ($all as $gig) {
    $matches = $mode === 'artist' ? compactName((string) (isset($gig['artist']) ? $gig['artist'] : '')) === $slug :
        ($mode === 'venue' ? compactName((string) (isset($gig['name']) ? $gig['name'] : '')) === $slug :
        ($mode === 'city' ? withinCity($gig, $cities[$slug]) :
        ($mode === 'suburb' && compactName((string) (isset($gig['suburb']) ? $gig['suburb'] : '')) === $slug)));
    if (!$matches || empty($gig['date']) || empty($gig['artist']) || empty($gig['name'])) continue;
    $date = substr((string) $gig['date'], 0, 10);
    if ($month !== null && (int) substr($date, 5, 2) !== $month + 1) continue;
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || $date < gmdate('Y-m-d')) continue;
    $key = strtolower(implode('|', [$date, (isset($gig['start']) ? $gig['start'] : ''), $gig['artist'], $gig['name'], (isset($gig['suburb']) ? $gig['suburb'] : '')]));
    if (isset($seen[$key])) continue;
    $seen[$key] = true;
    $link = 'https://giglist.com.au/gig-' . slugPart((string) $gig['artist']) . '-' . slugPart((string) $gig['name']) . '-' . slugPart($date);
    $event = ['BEGIN:VEVENT', 'UID:' . hash('sha256', $key) . '@giglist.com.au', 'DTSTAMP:' . gmdate('Ymd\THis\Z')];
    $time = strtoupper(trim((string) (isset($gig['start']) ? $gig['start'] : '')));
    if (preg_match('/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/', $time, $parts)) {
        $hour = ((int) $parts[1] % 12) + ($parts[3] === 'PM' ? 12 : 0);
        $state = strtoupper((string) (isset($gig['state']) ? $gig['state'] : ''));
        $zone = new DateTimeZone(isset($zones[$state]) ? $zones[$state] : 'Australia/Perth');
        $start = new DateTimeImmutable($date . sprintf(' %02d:%02d:00', $hour, (int) (isset($parts[2]) ? $parts[2] : 0)), $zone);
        $event[] = 'DTSTART:' . $start->setTimezone(new DateTimeZone('UTC'))->format('Ymd\THis\Z');
        $event[] = 'DURATION:PT2H';
    } else {
        $event[] = 'DTSTART;VALUE=DATE:' . str_replace('-', '', $date);
        $event[] = 'DTEND;VALUE=DATE:' . (new DateTimeImmutable($date))->modify('+1 day')->format('Ymd');
    }
    $event[] = 'SUMMARY:' . escapeIcs((string) $gig['artist'] . ' at ' . (string) $gig['name']);
    $event[] = 'LOCATION:' . escapeIcs(implode(', ', array_filter([(isset($gig['address']) ? $gig['address'] : ''), (isset($gig['suburb']) ? $gig['suburb'] : ''), (isset($gig['state']) ? $gig['state'] : '')])));
    $event[] = 'DESCRIPTION:' . escapeIcs('Gig details: ' . $link);
    $event[] = 'URL:' . $link;
    $event[] = 'END:VEVENT';
    $events[$date . '|' . $time . '|' . $key] = $event;
}
ksort($events);
$lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Giglist//Live music//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:' . escapeIcs($title . ' gigs' . ($month === null ? '' : ' in ' . ucfirst($months[$month]))),'X-PUBLISHED-TTL:PT1H','REFRESH-INTERVAL;VALUE=DURATION:PT1H'];
foreach ($events as $event) array_push($lines, ...$event);
$lines[] = 'END:VCALENDAR';
header('Content-Type: text/calendar; charset=utf-8');
header('Cache-Control: public, max-age=900');
if (isset($_GET['download'])) header('Content-Disposition: attachment; filename="giglist-' . $slug . '.ics"');
echo implode("\r\n", array_map('foldLine', $lines)) . "\r\n";
