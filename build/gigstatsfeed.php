<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

$debugMode = isset($_GET['debug']) && (string) $_GET['debug'] === '1';

// Keep endpoint output JSON even when runtime fatals happen in production.
register_shutdown_function(function () use ($debugMode) {
    $err = error_get_last();
    if (!$err) {
        return;
    }

    $fatalTypes = array(E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR);
    if (!in_array($err['type'], $fatalTypes, true)) {
        return;
    }

    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }

    $payload = array(
        'error' => 'stats_generation_failed',
        'message' => isset($err['message']) ? $err['message'] : 'Fatal runtime error in stats endpoint',
        'fatal_file' => isset($err['file']) ? basename($err['file']) : null,
        'fatal_line' => isset($err['line']) ? (int) $err['line'] : null,
    );

    if ($debugMode) {
        $payload['debug'] = array(
            'fatal_type' => isset($err['type']) ? $err['type'] : null,
            'php_version' => PHP_VERSION,
        );
    }

    echo json_encode($payload);
});

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

date_default_timezone_set('Australia/Perth');

// Guard against common production fatals on shared hosting.
@ini_set('memory_limit', '512M');
@set_time_limit(120);

$dbUser = 'giglistc_wp180';
$dbPassword = 'D5o@p97)mS';
$dbName = 'giglistc_wp180';
$dbHost = 'localhost';
$dbPort = 3306;
$stateFilter = '';

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

function bindParamsCompat($stmt, $types, $params) {
    if ($types === '' || empty($params)) {
        return;
    }

    $bindArgs = array($types);
    foreach ($params as $idx => $value) {
        $bindArgs[] = &$params[$idx];
    }

    call_user_func_array(array($stmt, 'bind_param'), $bindArgs);
}

function stmtFetchAllAssoc($stmt) {
    $rows = [];

    if (method_exists($stmt, 'get_result')) {
        $result = $stmt->get_result();
        if ($result !== false) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            return $rows;
        }
    }

    $meta = $stmt->result_metadata();
    if (!$meta) {
        return $rows;
    }

    $fields = [];
    $bindValues = [];
    while ($field = $meta->fetch_field()) {
        $fields[] = $field->name;
        $bindValues[] = null;
    }
    $meta->close();

    $refs = [];
    foreach ($bindValues as $idx => $value) {
        $refs[$idx] = &$bindValues[$idx];
    }
    call_user_func_array([$stmt, 'bind_result'], $refs);

    while ($stmt->fetch()) {
        $row = [];
        foreach ($fields as $idx => $name) {
            $row[$name] = $bindValues[$idx];
        }
        $rows[] = $row;
    }

    return $rows;
}

function runPrepared($conn, $sql, $types = '', $params = array()) {
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new RuntimeException('Failed to prepare SQL statement');
    }

    if ($types !== '' && !empty($params)) {
        bindParamsCompat($stmt, $types, $params);
    }

    if (!$stmt->execute()) {
        $stmt->close();
        throw new RuntimeException('Failed to execute SQL statement');
    }

    $rows = stmtFetchAllAssoc($stmt);
    $stmt->close();
    return $rows;
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

function monthSeries($startMonth, $count) {
    $months = [];
    $cursor = $startMonth;
    for ($i = 0; $i < $count; $i++) {
        $key = $cursor->format('Y-m');
        $months[$key] = 0;
        $cursor = $cursor->modify('+1 month');
    }
    return $months;
}

function mapMonthlyCounts($rows) {
    $map = [];
    foreach ($rows as $row) {
        $map[$row['month_key']] = (int) $row['gig_count'];
    }
    return $map;
}

function buildMonthlyBreakdown(array $baseMonths, array $countsByMonth) {
    $out = [];
    foreach ($baseMonths as $monthKey => $defaultCount) {
        $out[] = [
            'month' => $monthKey,
            'count' => isset($countsByMonth[$monthKey]) ? $countsByMonth[$monthKey] : $defaultCount,
        ];
    }
    return $out;
}

function pickTopByMonth($rows, $nameKey) {
    $winners = [];
    foreach ($rows as $row) {
        $month = $row['month_key'];
        $name = trim((string) $row[$nameKey]);
        $count = (int) $row['gig_count'];

        if ($name === '') {
            continue;
        }

        if (!isset($winners[$month])) {
            $winners[$month] = [
                'count' => $count,
                'names' => [$name],
                'location_id' => isset($row['location_id']) ? (int) $row['location_id'] : null,
            ];
            continue;
        }

        if ($count > $winners[$month]['count']) {
            $winners[$month] = [
                'count' => $count,
                'names' => [$name],
                'location_id' => isset($row['location_id']) ? (int) $row['location_id'] : null,
            ];
            continue;
        }

        if ($count === $winners[$month]['count']) {
            $winners[$month]['names'][] = $name;
        }
    }

    return $winners;
}

try {
    $debug = array(
        'php_version' => PHP_VERSION,
        'db_attempts' => array(),
        'selected_schema' => null,
        'selected_db' => null,
    );

    $localDbCandidates = array($dbName, 'giglist');
    $localDbCandidates = array_values(array_unique($localDbCandidates));

    $attempts = array(
        array($dbHost, $dbUser, $dbPassword, $dbName, $dbPort),
    );

    // Local fallback helps when host detection or virtual host headers differ.
    foreach ($localDbCandidates as $candidateDb) {
        $attempts[] = array('localhost', 'root', 'root', $candidateDb, 8889);
        $attempts[] = array('localhost', 'root', 'root', $candidateDb, 3306);
    }

    $conn = null;
    $lastConnectError = '';
    foreach ($attempts as $attempt) {
        $debug['db_attempts'][] = array(
            'host' => $attempt[0],
            'user' => $attempt[1],
            'db' => $attempt[3],
            'port' => (int) $attempt[4],
        );
        try {
            $conn = connectDb($attempt[0], $attempt[1], $attempt[2], $attempt[3], $attempt[4]);
            $debug['selected_db'] = $attempt[3];
            break;
        } catch (Exception $connectEx) {
            $lastConnectError = $connectEx->getMessage();
        }
    }

    if ($conn === null) {
        throw new RuntimeException('Database connection failed: ' . $lastConnectError);
    }

    $isLegacySchema = tableExists($conn, 'wpdr_eme_events') && tableExists($conn, 'wpdr_eme_locations');
    $isGlSchema = tableExists($conn, 'gl_listings') && tableExists($conn, 'gl_venues');

    if ($isLegacySchema) {
        $eventIdCol = 'e.event_id';
        $eventDateCol = 'e.event_start_date';
        $locationIdCol = 'e.location_id';
        $eventNameExpr = 'e.event_name';
        $locationNameExpr = 'l.location_name';
        $stateExpr = 'l.location_state';
        $extraFilterSql = '';
        $schemaName = 'wpdr_eme';
        $debug['selected_schema'] = $schemaName;
        $baseFilterSql = "
            FROM wpdr_eme_events e
            INNER JOIN wpdr_eme_locations l ON l.location_id = e.location_id
            WHERE e.event_start_date IS NOT NULL
        ";
    } elseif ($isGlSchema) {
        $eventIdCol = 'e.id';
        $eventDateCol = 'e.startdate';
        $locationIdCol = 'e.venueId';
        $eventNameExpr = 'e.name';
        $locationNameExpr = 'l.name';
        $stateExpr = 'l.state';
        $extraFilterSql = ' AND (e.isPublished = 1 OR e.isPublished IS NULL)';
        $schemaName = 'gl';
        $debug['selected_schema'] = $schemaName;
        $baseFilterSql = "
            FROM gl_listings e
            INNER JOIN gl_venues l ON l.id = e.venueId
            WHERE e.startdate IS NOT NULL
        ";
    } else {
        throw new RuntimeException('No supported gigs schema found (expected wpdr_eme_* or gl_* tables)');
    }

    $stateSql = '';
    $stateTypes = '';
    $stateParams = [];
    if ($stateFilter !== '') {
        $stateSql = ' AND ' . $stateExpr . ' = ?';
        $stateTypes = 's';
        $stateParams = [$stateFilter];
    }

    $baseFilterSql .= $extraFilterSql . $stateSql;

    $allTimeResult = runPrepared(
        $conn,
        "SELECT COUNT(DISTINCT {$eventIdCol}) AS total {$baseFilterSql}",
        $stateTypes,
        $stateParams
    );
    $allTimeRow = isset($allTimeResult[0]) ? $allTimeResult[0] : array();
    $allTimeCount = isset($allTimeRow['total']) ? (int) $allTimeRow['total'] : 0;

    if ($isLegacySchema) {
        $venueCountSql = 'SELECT COUNT(*) AS total FROM wpdr_eme_locations';
        $venueCountTypes = '';
        $venueCountParams = array();
    } else {
        $venueCountSql = 'SELECT COUNT(*) AS total FROM gl_venues';
        $venueCountTypes = '';
        $venueCountParams = array();
    }

    $venueResult = runPrepared(
        $conn,
        $venueCountSql,
        $venueCountTypes,
        $venueCountParams
    );
    $venueRow = isset($venueResult[0]) ? $venueResult[0] : array();
    $totalVenues = isset($venueRow['total']) ? (int) $venueRow['total'] : 0;

    $currentMonthStart = new DateTimeImmutable('first day of this month 00:00:00');
    $nextMonthStart = $currentMonthStart->modify('+1 month');
    $lastMonthStart = $currentMonthStart->modify('-1 month');
    $avgStart = $currentMonthStart->modify('-12 months');
    $previousAvgStart = $currentMonthStart->modify('-24 months');
    $trendStart = $avgStart;

    $monthly12Sql = "
                SELECT DATE_FORMAT({$eventDateCol}, '%Y-%m') AS month_key,
                             COUNT(DISTINCT {$eventIdCol}) AS gig_count
        {$baseFilterSql}
                    AND {$eventDateCol} >= ?
                    AND {$eventDateCol} < ?
                GROUP BY DATE_FORMAT({$eventDateCol}, '%Y-%m')
    ";
    $monthly12Types = $stateTypes . 'ss';
    $monthly12Params = array_merge($stateParams, [$avgStart->format('Y-m-d'), $currentMonthStart->format('Y-m-d')]);
    $monthly12Map = mapMonthlyCounts(runPrepared($conn, $monthly12Sql, $monthly12Types, $monthly12Params));

    $monthly12Base = monthSeries($avgStart, 12);
    $monthly12Filled = [];
    $sum12 = 0;
    foreach ($monthly12Base as $monthKey => $defaultCount) {
        $count = isset($monthly12Map[$monthKey]) ? $monthly12Map[$monthKey] : $defaultCount;
        $monthly12Filled[$monthKey] = $count;
        $sum12 += $count;
    }

    $averagePerMonth = round($sum12 / 12, 2);
    $lastMonthKey = $lastMonthStart->format('Y-m');
    $lastMonthTotal = isset($monthly12Filled[$lastMonthKey]) ? (int) $monthly12Filled[$lastMonthKey] : 0;

    $weekdaySql = "
        SELECT DAYOFWEEK({$eventDateCol}) AS weekday_num,
               COUNT(DISTINCT {$eventIdCol}) AS gig_count
        {$baseFilterSql}
          AND {$eventDateCol} >= ?
          AND {$eventDateCol} < ?
        GROUP BY DAYOFWEEK({$eventDateCol})
    ";
    $weekdayTypes = $stateTypes . 'ss';
    $weekdayParams = array_merge($stateParams, [$avgStart->format('Y-m-d'), $currentMonthStart->format('Y-m-d')]);
    $weekdayRows = runPrepared($conn, $weekdaySql, $weekdayTypes, $weekdayParams);

    $weekdayMap = array(
        1 => 0,
        2 => 0,
        3 => 0,
        4 => 0,
        5 => 0,
        6 => 0,
        7 => 0,
    );
    foreach ($weekdayRows as $row) {
        $idx = (int) $row['weekday_num'];
        if (isset($weekdayMap[$idx])) {
            $weekdayMap[$idx] = (int) $row['gig_count'];
        }
    }

    $weekdayLabels = array(
        2 => 'Mon',
        3 => 'Tue',
        4 => 'Wed',
        5 => 'Thu',
        6 => 'Fri',
        7 => 'Sat',
        1 => 'Sun',
    );
    $weeklyDistribution = array();
    foreach ($weekdayLabels as $dayNum => $dayLabel) {
        $weeklyDistribution[] = array(
            'day' => $dayLabel,
            'count' => $weekdayMap[$dayNum],
        );
    }

    $monthly24Params = array_merge($stateParams, [$previousAvgStart->format('Y-m-d'), $currentMonthStart->format('Y-m-d')]);
    $monthly24Map = mapMonthlyCounts(runPrepared($conn, $monthly12Sql, $monthly12Types, $monthly24Params));
    $current12Total = 0;
    $previous12Total = 0;
    foreach (monthSeries($avgStart, 12) as $monthKey => $zero) {
        $current12Total += isset($monthly24Map[$monthKey]) ? (int) $monthly24Map[$monthKey] : 0;
    }
    foreach (monthSeries($previousAvgStart, 12) as $monthKey => $zero) {
        $previous12Total += isset($monthly24Map[$monthKey]) ? (int) $monthly24Map[$monthKey] : 0;
    }
    $yearOverYearChangePercent = $previous12Total > 0
        ? round((($current12Total - $previous12Total) / $previous12Total) * 100, 2)
        : null;

    $monthlyTrendSql = "
                SELECT DATE_FORMAT({$eventDateCol}, '%Y-%m') AS month_key,
                             COUNT(DISTINCT {$eventIdCol}) AS gig_count
        {$baseFilterSql}
                    AND {$eventDateCol} >= ?
                    AND {$eventDateCol} < ?
                GROUP BY DATE_FORMAT({$eventDateCol}, '%Y-%m')
        ORDER BY month_key ASC
    ";
    $monthlyTrendTypes = $stateTypes . 'ss';
    $monthlyTrendParams = array_merge($stateParams, [$trendStart->format('Y-m-d'), $currentMonthStart->format('Y-m-d')]);
    $monthlyTrendMap = mapMonthlyCounts(runPrepared($conn, $monthlyTrendSql, $monthlyTrendTypes, $monthlyTrendParams));

    $trendBase = monthSeries($trendStart, 12);
    $monthlyBreakdown = buildMonthlyBreakdown($trendBase, $monthlyTrendMap);

    $busiestMonth = ['month' => null, 'count' => 0];
    foreach ($monthlyBreakdown as $monthData) {
        if ($monthData['count'] > $busiestMonth['count']) {
            $busiestMonth = $monthData;
        }
    }

    $artistAggregateSql = "
                SELECT DATE_FORMAT({$eventDateCol}, '%Y-%m') AS month_key,
                             {$eventNameExpr} AS artist_name,
                             COUNT(DISTINCT {$eventIdCol}) AS gig_count
        {$baseFilterSql}
                    AND {$eventDateCol} >= ?
                    AND {$eventDateCol} < ?
                    AND LOWER({$eventNameExpr}) NOT LIKE '%open mic%'
                    AND LOWER({$eventNameExpr}) NOT LIKE '%open-mic%'
                    AND TRIM({$eventNameExpr}) <> ''
                GROUP BY DATE_FORMAT({$eventDateCol}, '%Y-%m'), {$eventNameExpr}
    ";
    $artistAwardsSql = "
        SELECT ranked.month_key, ranked.artist_name, ranked.gig_count
        FROM ({$artistAggregateSql}) ranked
        INNER JOIN (
            SELECT month_key, MAX(gig_count) AS max_count
            FROM ({$artistAggregateSql}) monthly_max
            GROUP BY month_key
        ) top ON top.month_key = ranked.month_key AND top.max_count = ranked.gig_count
        ORDER BY ranked.month_key ASC, ranked.artist_name ASC
    ";
    $artistAwardTypes = $stateTypes . 'ss' . $stateTypes . 'ss';
    $artistAwardParams = array_merge(
        $stateParams,
        [$trendStart->format('Y-m-d'), $currentMonthStart->format('Y-m-d')],
        $stateParams,
        [$trendStart->format('Y-m-d'), $currentMonthStart->format('Y-m-d')]
    );
    $artistRows = runPrepared($conn, $artistAwardsSql, $artistAwardTypes, $artistAwardParams);
    $artistWinners = [];
    foreach ($artistRows as $row) {
        $month = $row['month_key'];
        if (!isset($artistWinners[$month])) {
            $artistWinners[$month] = [
                'count' => (int) $row['gig_count'],
                'names' => [$row['artist_name']],
            ];
        } else {
            $artistWinners[$month]['names'][] = $row['artist_name'];
        }
    }

    $venueAggregateSql = "
                SELECT DATE_FORMAT({$eventDateCol}, '%Y-%m') AS month_key,
                             {$locationIdCol} AS location_id,
                             {$locationNameExpr} AS location_name,
                             COUNT(DISTINCT {$eventIdCol}) AS gig_count
        {$baseFilterSql}
                    AND {$eventDateCol} >= ?
                    AND {$eventDateCol} < ?
                    AND TRIM({$locationNameExpr}) <> ''
                GROUP BY DATE_FORMAT({$eventDateCol}, '%Y-%m'), {$locationIdCol}, {$locationNameExpr}
    ";
    $venueAwardsSql = "
        SELECT ranked.month_key, ranked.location_id, ranked.location_name, ranked.gig_count
        FROM ({$venueAggregateSql}) ranked
        INNER JOIN (
            SELECT month_key, MAX(gig_count) AS max_count
            FROM ({$venueAggregateSql}) monthly_max
            GROUP BY month_key
        ) top ON top.month_key = ranked.month_key AND top.max_count = ranked.gig_count
        ORDER BY ranked.month_key ASC, ranked.location_name ASC
    ";
    $venueAwardTypes = $stateTypes . 'ss' . $stateTypes . 'ss';
    $venueAwardParams = array_merge(
        $stateParams,
        [$trendStart->format('Y-m-d'), $currentMonthStart->format('Y-m-d')],
        $stateParams,
        [$trendStart->format('Y-m-d'), $currentMonthStart->format('Y-m-d')]
    );
    $venueRows = runPrepared($conn, $venueAwardsSql, $venueAwardTypes, $venueAwardParams);
    $venueWinners = [];
    foreach ($venueRows as $row) {
        $month = $row['month_key'];
        if (!isset($venueWinners[$month])) {
            $venueWinners[$month] = [
                'count' => (int) $row['gig_count'],
                'names' => [$row['location_name']],
                'location_id' => (int) $row['location_id'],
            ];
        } else {
            $venueWinners[$month]['names'][] = $row['location_name'];
        }
    }

    $awardsByMonth = [];
    foreach ($trendBase as $monthKey => $zero) {
        $artist = null;
        if (isset($artistWinners[$monthKey])) {
            $artist = [
                'name' => $artistWinners[$monthKey]['names'][0],
                'count' => $artistWinners[$monthKey]['count'],
                'tied_with' => array_slice($artistWinners[$monthKey]['names'], 1),
            ];
        }

        $venue = null;
        if (isset($venueWinners[$monthKey])) {
            $venue = [
                'location_id' => $venueWinners[$monthKey]['location_id'],
                'name' => $venueWinners[$monthKey]['names'][0],
                'count' => $venueWinners[$monthKey]['count'],
                'tied_with' => array_slice($venueWinners[$monthKey]['names'], 1),
            ];
        }

        $awardsByMonth[] = [
            'month' => $monthKey,
            'artist_most_listed' => $artist,
            'venue_most_listed' => $venue,
        ];
    }

    $allTimeArtistAggregateSql = "
        SELECT TRIM({$eventNameExpr}) AS artist_name,
               COUNT(DISTINCT {$eventIdCol}) AS gig_count
        {$baseFilterSql}
          AND LOWER({$eventNameExpr}) NOT LIKE '%open mic%'
          AND LOWER({$eventNameExpr}) NOT LIKE '%open-mic%'
          AND TRIM({$eventNameExpr}) <> ''
        GROUP BY TRIM({$eventNameExpr})
    ";
    $allTimeArtistSql = "
        SELECT ranked.artist_name, ranked.gig_count
        FROM ({$allTimeArtistAggregateSql}) ranked
        INNER JOIN (
            SELECT MAX(gig_count) AS max_count
            FROM ({$allTimeArtistAggregateSql}) all_time_max
        ) top ON top.max_count = ranked.gig_count
        ORDER BY ranked.artist_name ASC
    ";
    $allTimeArtistTypes = $stateTypes . $stateTypes;
    $allTimeArtistParams = array_merge($stateParams, $stateParams);
    $allTimeArtistRows = runPrepared($conn, $allTimeArtistSql, $allTimeArtistTypes, $allTimeArtistParams);

    $allTimeArtistWinner = null;
    if (!empty($allTimeArtistRows)) {
        $artistNames = [];
        foreach ($allTimeArtistRows as $row) {
            $artistNames[] = $row['artist_name'];
        }
        $allTimeArtistWinner = [
            'name' => $artistNames[0],
            'count' => (int) $allTimeArtistRows[0]['gig_count'],
            'tied_with' => array_slice($artistNames, 1),
        ];
    }

    $allTimeArtistLeaderboardSql = "
        SELECT TRIM({$eventNameExpr}) AS artist_name,
               COUNT(DISTINCT {$eventIdCol}) AS gig_count
        {$baseFilterSql}
          AND LOWER({$eventNameExpr}) NOT LIKE '%open mic%'
          AND LOWER({$eventNameExpr}) NOT LIKE '%open-mic%'
          AND TRIM({$eventNameExpr}) <> ''
        GROUP BY TRIM({$eventNameExpr})
        ORDER BY gig_count DESC, artist_name ASC
        LIMIT 10
    ";
    $allTimeArtistLeaderboardRows = runPrepared($conn, $allTimeArtistLeaderboardSql, $stateTypes, $stateParams);
    $allTimeArtistLeaderboard = array();
    foreach ($allTimeArtistLeaderboardRows as $row) {
        $allTimeArtistLeaderboard[] = array(
            'name' => $row['artist_name'],
            'count' => (int) $row['gig_count'],
        );
    }

    $allTimeVenueAggregateSql = "
        SELECT {$locationIdCol} AS location_id,
               TRIM({$locationNameExpr}) AS location_name,
               COUNT(DISTINCT {$eventIdCol}) AS gig_count
        {$baseFilterSql}
          AND TRIM({$locationNameExpr}) <> ''
        GROUP BY {$locationIdCol}, TRIM({$locationNameExpr})
    ";
    $allTimeVenueSql = "
        SELECT ranked.location_id, ranked.location_name, ranked.gig_count
        FROM ({$allTimeVenueAggregateSql}) ranked
        INNER JOIN (
            SELECT MAX(gig_count) AS max_count
            FROM ({$allTimeVenueAggregateSql}) all_time_max
        ) top ON top.max_count = ranked.gig_count
        ORDER BY ranked.location_name ASC
    ";
    $allTimeVenueTypes = $stateTypes . $stateTypes;
    $allTimeVenueParams = array_merge($stateParams, $stateParams);
    $allTimeVenueRows = runPrepared($conn, $allTimeVenueSql, $allTimeVenueTypes, $allTimeVenueParams);

    $allTimeVenueWinner = null;
    if (!empty($allTimeVenueRows)) {
        $venueNames = [];
        foreach ($allTimeVenueRows as $row) {
            $venueNames[] = $row['location_name'];
        }
        $allTimeVenueWinner = [
            'location_id' => (int) $allTimeVenueRows[0]['location_id'],
            'name' => $venueNames[0],
            'count' => (int) $allTimeVenueRows[0]['gig_count'],
            'tied_with' => array_slice($venueNames, 1),
        ];
    }

    $allTimeVenueLeaderboardSql = "
        SELECT {$locationIdCol} AS location_id,
               TRIM({$locationNameExpr}) AS location_name,
               COUNT(DISTINCT {$eventIdCol}) AS gig_count
        {$baseFilterSql}
          AND TRIM({$locationNameExpr}) <> ''
        GROUP BY {$locationIdCol}, TRIM({$locationNameExpr})
        ORDER BY gig_count DESC, location_name ASC
        LIMIT 10
    ";
    $allTimeVenueLeaderboardRows = runPrepared($conn, $allTimeVenueLeaderboardSql, $stateTypes, $stateParams);
    $allTimeVenueLeaderboard = array();
    foreach ($allTimeVenueLeaderboardRows as $row) {
        $allTimeVenueLeaderboard[] = array(
            'location_id' => (int) $row['location_id'],
            'name' => $row['location_name'],
            'count' => (int) $row['gig_count'],
        );
    }

    $response = [
        'generated_at' => (new DateTimeImmutable())->format(DATE_ATOM),
        'timezone' => 'Australia/Perth',
        'scope' => [
            'state' => $stateFilter,
            'schema' => $schemaName,
        ],
        'all_time_count' => $allTimeCount,
        'average_per_month' => $averagePerMonth,
        'last_month_total' => $lastMonthTotal,
        'total_venues' => $totalVenues,
        'weekly_distribution' => [
            'series' => $weeklyDistribution,
        ],
        'monthly_breakdown' => [
            'range_months' => 12,
            'series' => $monthlyBreakdown,
        ],
        'awards' => [
            'monthly' => $awardsByMonth,
            'all_time' => [
                'artist_most_listed' => $allTimeArtistWinner,
                'venue_most_listed' => $allTimeVenueWinner,
                'artist_leaderboard' => $allTimeArtistLeaderboard,
                'venue_leaderboard' => $allTimeVenueLeaderboard,
            ],
            'notes' => [
                'artist_excludes' => ['open mic', 'open-mic'],
                'ties_are_returned_in_tied_with' => true,
            ],
        ],
        'highlights' => [
            'busiest_month_last_12_months' => $busiestMonth,
            'busiest_month_last_5_years' => $busiestMonth,
            'trailing_12_month_total' => $current12Total,
            'year_over_year_change_percent' => $yearOverYearChangePercent,
        ],
    ];

    if ($debugMode) {
        $response['debug'] = $debug;
    }

    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Exception $e) {
    http_response_code(500);
    $errorPayload = [
        'error' => 'stats_generation_failed',
        'message' => $e->getMessage(),
    ];

    if ($debugMode) {
        $errorPayload['debug'] = $debug;
    }

    echo json_encode($errorPayload);
}

?>