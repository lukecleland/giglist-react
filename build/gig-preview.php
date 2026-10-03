<?php
// PHP 5.6 compatible: serve the React shell with crawler-readable gig metadata.
function gigSlug($value) {
    $value = str_replace('&', ' and ', html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    if (class_exists('Normalizer')) $value = Normalizer::normalize($value, Normalizer::FORM_KD) ?: $value;
    $value = preg_replace('/\p{Mn}/u', '', $value);
    $value = strtolower($value);
    $value = trim(preg_replace('/[^a-z0-9]+/', '-', $value), '-');
    return $value !== '' ? $value : 'gig';
}
function gigEscape($value) { return htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); }
$path = rawurldecode(parse_url(isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/', PHP_URL_PATH));
$html = file_get_contents(__DIR__ . '/index.html');
$handle = curl_init('https://giglist.com.au/feed_national.php');
curl_setopt_array($handle, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_TIMEOUT=>15, CURLOPT_CONNECTTIMEOUT=>5]);
$json = curl_exec($handle);
$code = curl_getinfo($handle, CURLINFO_HTTP_CODE);
curl_close($handle);
$dates = $json !== false && $code === 200 ? json_decode($json, true) : null;
header('Content-Type: text/html; charset=UTF-8');
if (!is_array($dates)) {
    http_response_code(503);
    header('Retry-After: 60');
    echo $html;
    exit;
}
$match = null;
foreach ($dates as $day) {
    foreach (isset($day['listings']) ? $day['listings'] : [] as $gig) {
        $canonical = '/gig-' . gigSlug($gig['artist']) . '-' . gigSlug($gig['name']) . '-' . gigSlug($gig['date']);
        $legacy = strtolower(preg_replace('/\s+/', '-', '/gig-' . $gig['artist'] . '-' . $gig['name'] . '-' . $gig['date']));
        if (rtrim($path, '/') === $canonical || rtrim($path, '/') === $legacy) {
            $match = $gig;
            break 2;
        }
    }
}
if ($match !== null) {
    $url = 'https://giglist.com.au' . $canonical;
    $title = html_entity_decode($match['artist'] . ' @ ' . $match['name'], ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $date = DateTime::createFromFormat('!Y-m-d', $match['date']);
    $description = ($date ? $date->format('l, j F Y') : $match['date']) . ' at ' . $match['start'] . '. ' . $match['name'] . ', ' . $match['address'] . ', ' . $match['suburb'] . ', ' . (isset($match['state']) ? $match['state'] : '');
    $description = html_entity_decode($description, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $image = isset($match['location_image_url']) ? trim($match['location_image_url']) : '';
    if (substr($image, 0, 2) === '//') $image = 'https:' . $image;
    elseif (substr($image, 0, 1) === '/') $image = 'https://giglist.com.au' . $image;
    if (!preg_match('~^https?://~i', $image)) $image = 'https://giglist.com.au/placeholder-gig.jpeg';
    $html = preg_replace('~<title>.*?</title>|<link\b[^>]*rel=["\']canonical["\'][^>]*>|<meta\b[^>]*(?:property=["\']og:[^"\']+["\']|name=["\'](?:description|twitter:[^"\']+)["\'])[^>]*>~is', '', $html);
    $tags = '<title>' . gigEscape($title . ' | Giglist') . '</title><link rel="canonical" href="' . gigEscape($url) . '">';
    foreach (['title'=>$title, 'description'=>$description, 'url'=>$url, 'image'=>$image, 'image:alt'=>$title, 'type'=>'website', 'site_name'=>'Giglist'] as $key=>$value) {
        $tags .= '<meta property="og:' . $key . '" content="' . gigEscape($value) . '">';
    }
    foreach (['description'=>$description, 'twitter:card'=>'summary_large_image', 'twitter:title'=>$title, 'twitter:description'=>$description, 'twitter:image'=>$image] as $key=>$value) {
        $tags .= '<meta name="' . $key . '" content="' . gigEscape($value) . '">';
    }
    $html = str_replace('</head>', $tags . '</head>', $html);
}
echo $html;
