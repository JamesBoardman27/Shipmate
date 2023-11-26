<?php
class getDataByFilters extends request
{
    private $sql;

    function __construct($long,$lat,$radius,$filterArray){ //[Cargo,Passenger...]
        parent::__construct();
        $this->sql = "SELECT name, id, mmsi, lat, lon, timestamp, imo, callsign, speed, area, type, country, destination, current_port_id, current_port, next_port_id, next_port
        FROM vessels WHERE lat > " . ($lat - $radius) . " AND lat < " . ($lat + $radius) . " AND lon > " . ($long - $radius) . " AND lon < " . ($long + $radius);

        $filters = str_replace("[","(",$filterArray);
        $filters = str_replace("]",")",$filters);

        $this->sql = $this->sql . " AND type IN " . $filters;
    }

    public function getData(){
        $result = $this->db->query($this->sql);
        $data = array();
        while($row = $result->fetch_assoc()) {
            array_push($data, $row);
          }
        return json_encode($data);
    }
}

?>