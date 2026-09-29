<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

date_default_timezone_set('Australia/Perth');

$dbUser = 'giglistc_wp180';
$dbPassword = 'D5o@p97)mS';
$dbName = 'giglistc_wp180';
$dbHost = 'localhost';
$dbPort = 3306;

$hostHeader = isset($_SERVER['HTTP_HOST']) ? strtolower((string) $_SERVER['HTTP_HOST']) : '';
$isLocalHost = strpos($hostHeader, 'localhost') !== false || strpos($hostHeader, '127.0.0.1') !== false;
if ($isLocalHost) {
    $dbUser = 'root';
    $dbPassword = 'root';
    $dbPort = 8889;
}

function connectDb($dbHost, $dbUser, $dbPassword, $dbName, $dbPort = 3306) {
    $conn = new mysqli($dbHost, $dbUser, $dbPassword, $dbName, $dbPort);
    if ($conn->connect_error) {
        throw new RuntimeException('Database connection failed');
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

// Bind results directly so this works on shared hosts without mysqlnd.
function queryStatsRow($conn, $sql, $params = []) {
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new RuntimeException('Could not prepare stats query');
    }
    if ($params) {
        $stmt->bind_param(str_repeat('s', count($params)), ...$params);
    }
    if (!$stmt->execute()) {
        throw new RuntimeException('Could not execute stats query');
    }
    $metadata = $stmt->result_metadata();
    $row = [];
    $references = [];
    while ($field = $metadata->fetch_field()) {
        $row[$field->name] = null;
        $references[] = &$row[$field->name];
    }
    $metadata->close();
    $stmt->bind_result(...$references);
    if (!$stmt->fetch()) {
        throw new RuntimeException('No stats returned');
    }
    $stmt->close();
    return $row;
}

function tableExists($conn, $tableName) {
    $tableEscaped = $conn->real_escape_string($tableName);
    $result = $conn->query("SHOW TABLES LIKE '{$tableEscaped}'");
    if (!$result) {
        return false;
    }
    $exists = $result->num_rows > 0;
    $result->close();
    return $exists;
}

try {
    $conn = connectDb($dbHost, $dbUser, $dbPassword, $dbName, $dbPort);

    if (tableExists($conn, 'wpdr_eme_events') && tableExists($conn, 'wpdr_eme_locations')) {
        $id = 'e.event_id';
        $date = 'e.event_start_date';
        $venueTable = 'wpdr_eme_locations';
        $base = 'FROM wpdr_eme_events e INNER JOIN wpdr_eme_locations l ON l.location_id = e.location_id WHERE e.event_start_date IS NOT NULL';
        $currentFilter = " AND l.location_url != ''";
    } elseif (tableExists($conn, 'gl_listings') && tableExists($conn, 'gl_venues')) {
        $id = 'e.id';
        $date = 'e.startdate';
        $venueTable = 'gl_venues';
        $base = 'FROM gl_listings e INNER JOIN gl_venues l ON l.id = e.venueId WHERE e.startdate IS NOT NULL AND (e.isPublished = 1 OR e.isPublished IS NULL)';
        $currentFilter = '';
    } else {
        throw new RuntimeException('No supported gigs schema found');
    }

    $now = new DateTimeImmutable();
    $monthStart = $now->modify('first day of this month')->format('Y-m-d');
    $lastMonthStart = $now->modify('first day of last month')->format('Y-m-d');
    // Match the listings' 5am rollover and 12-month display window.
    $currentStart = $now->modify('-5 hours')->format('Y-m-d');
    $currentEnd = $now->modify('+12 months')->format('Y-m-d');

    $counts = queryStatsRow($conn, "
        SELECT COUNT(DISTINCT {$id}) AS all_time_count,
            COUNT(DISTINCT CASE WHEN {$date} >= ? AND {$date} < ? THEN {$id} END) AS last_month_total,
            COUNT(DISTINCT CASE WHEN {$date} >= ? AND {$date} <= ? {$currentFilter} THEN {$id} END) AS currently_listed_count
        {$base}", [$lastMonthStart, $monthStart, $currentStart, $currentEnd]
    );
    $venues = queryStatsRow($conn, "SELECT COUNT(*) AS total FROM {$venueTable}");

    echo json_encode([
        'all_time_count' => (int) $counts['all_time_count'],
        'last_month_total' => (int) $counts['last_month_total'],
        'total_venues' => (int) $venues['total'],
        'currently_listed_count' => (int) $counts['currently_listed_count'],
    ]);
    $conn->close();
} catch (Throwable $error) {
    error_log('Simple gig stats failed: ' . $error->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'stats_generation_failed']);
}
