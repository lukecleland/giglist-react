<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 1000");
    header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");
    header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE");
    
    try {

        date_default_timezone_set('Australia/Perth');
    
        $dbuser = 'giglistc_wp180';
        $dbpassword = 'D5o@p97)mS';
        $state_filter = 'WA';
        $searchsql = '';
        
        $months = 12;
        
        if (isset($_GET["mobile"])) {
            $months = 1;
        }
        
        if (isset($_GET["months"])) {
            $months = $_GET["months"];
        }
        
        $location = '';
        if (isset($_GET["location_id"])) {
            $location = ' AND wpdr_eme_locations.location_id = ' . $_GET["location_id"];
        }
    
        $query = "SELECT
          wpdr_eme_events_cf.answer as answer, wpdr_eme_events.event_url, wpdr_eme_events.event_id, wpdr_eme_events.event_name,
          wpdr_eme_events.event_start_time, wpdr_eme_events.event_start_date, wpdr_eme_locations.location_name,
          wpdr_eme_locations.location_url, wpdr_eme_locations.location_address1, wpdr_eme_locations.location_address2,
          wpdr_eme_locations.location_city, wpdr_eme_locations.location_state, wpdr_eme_locations.location_zip, wpdr_eme_locations.location_id,
          wpdr_eme_locations.location_country, wpdr_eme_locations.location_image_url,
          wpdr_eme_locations.location_latitude, wpdr_eme_locations.location_longitude, count(*)
          
        FROM wpdr_eme_events
        LEFT JOIN wpdr_eme_locations ON wpdr_eme_events.location_id = wpdr_eme_locations.location_id
        LEFT JOIN wpdr_eme_events_cf ON wpdr_eme_events_cf.event_id = wpdr_eme_events.event_id
          WHERE wpdr_eme_events.event_start_date >= DATE(DATE_ADD( NOW( ) , INTERVAL  '-5:00' HOUR_MINUTE ))
          AND wpdr_eme_events.event_start_date <= DATE(DATE_ADD( NOW( ) , INTERVAL  '".$months."' MONTH ))
          AND wpdr_eme_locations.location_url != ''
          ".$searchsql."
          ".$location."
          GROUP BY wpdr_eme_events_cf.answer, wpdr_eme_events.event_url, wpdr_eme_events.event_id, wpdr_eme_events.event_name,
          wpdr_eme_events.event_start_time, wpdr_eme_events.event_start_date, wpdr_eme_locations.location_name,
          wpdr_eme_locations.location_url, wpdr_eme_locations.location_address1, wpdr_eme_locations.location_address2,
          wpdr_eme_locations.location_city, wpdr_eme_locations.location_state, wpdr_eme_locations.location_zip,
          wpdr_eme_locations.location_country, wpdr_eme_locations.location_image_url,
          wpdr_eme_locations.location_latitude, wpdr_eme_locations.location_longitude
          HAVING count( * ) < 2
          ORDER BY wpdr_eme_events.event_start_date ASC, wpdr_eme_events.event_start_time ASC LIMIT 9999";
    
        function connect() {
          global $dbuser, $dbpassword;
          $conn = new mysqli('localhost', $dbuser, $dbpassword, 'giglistc_wp180');
          if ($conn->connect_error) {
              die("Connection failed: " . $conn->connect_error);
          }
          return $conn;
        }
    
        $conn = connect();
        $conn->set_charset("utf8mb4");
    
        $results = $conn->query($query);
        
        $newRowArray=array();
      	foreach($results as $key=>$value ){
      		$eventdate=$value["event_start_date"];
      		$newRowArray[$eventdate][]=$value;
      	}
      	
      	$giglist = new stdClass();
        $giglist->dates = [];
        
        $count = 0;
    
        foreach($newRowArray as $key=>$rRow ){
            
            $date = new stdClass();
            
            $date->datestring = date('D M jS', strtotime($key));
            $date->datetime = $key;
            
            $date->listings = [];
            
            foreach($rRow as $rval ) {
                
            
                $count = $count + 1;
                
                $gig = new stdClass();
                $gig->id = $count; 
                $gig->lat = $rval['location_latitude']; 
                $gig->lng = $rval['location_longitude'];
                
                $gig->name = $rval['location_name'];
                
                $gig->artist = $rval['event_name'];
                
                $gig->artist_url = $rval['event_url'];
                $gig->address = $rval['location_address1'];
                $gig->suburb = $rval['location_city'];
                $gig->location_url = filter_var($rval['location_url'], FILTER_SANITIZE_URL);
                $gig->location_image_url = $rval['location_image_url'];
                $dateString = $rval['event_start_date'].' '.$rval['event_start_time'];
                $dateObject = new DateTime($dateString);
                $gig->start = $dateObject->format('g:iA');
                $gig->date_formatted = date('F j, Y', strtotime($rval['event_start_date']));
                $gig->date = $rval['event_start_date']; 
                $gig->state = $rval['location_state']; 
                $gig->zip = $rval['location_zip']; 
                $gig->location_id = $rval['location_id']; 
                $gig->datestamp = $dateObject;
                
                $gig->answer = $rval['answer']; 
                array_push($date->listings, $gig);
            } 
            
            array_push($giglist->dates, $date);
            
        }
        
        
        
        $giglistJSON = json_encode($giglist->dates, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        echo $giglistJSON;
        
    } catch (Exception $e) {
        
        echo 'Caught exception: ',  $e->getMessage(), "\n";
        
    } 


    
?>