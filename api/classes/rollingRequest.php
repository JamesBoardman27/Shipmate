<?php
class rollingRequest extends request
{
    private const areas = array("ADRIA","AG","ALASKA","ANT","BALTIC","BSEA","CARIBS","CASPIAN","CCHINA","CISPAC","EAFR","EAUS","ECCA","ECCAN","ECI","ECSA",
    "EMED","GLAKES","INDO","INLSAM","INLCN","INLEU","INLRU","INLUS","JAPAN","NAUS","NCCIS","NCHINA","NCSA","NOATL","NORDIC","NPAC","PHIL","RSEA","SAFR","SCHINA","SEASIA","SIND","SPAC","UKC",
    "USEC","USG","USWC","WAFR","WAUS","WCCA","WCCAN","WCI","WCSA","WMED");
    private $requestprefix;
    private $index;

    function __construct()
    {
        parent::__construct();
        $this->requestprefix = "getVesselsInArea/";
        $this->index = 0;
        $this->nextArea();
    }

    public function nextArea(){

        $this->requestType = $this->requestprefix . self::areas[$this->index];
        #echo $this->requestType . ".\n";
        $this->index += 1;
        if ($this->index >49) {
            $this->index = 0;
        }
        parent::getData();
        #var_dump($this->data, true);
        self::saveData();
    }

    private function saveData(){
        foreach ($this->data as $vessel) {
            if (is_null($vessel["port_next_id"])){
                $vessel["port_next_id"] = "NULL";
            }
            if (is_null($vessel["cport_urrent_id"])){
                $vessel["port_current_id"] = "NULL";
            }
            $sql = "INSERT INTO vessels (name, id, mmsi, lat, lon, timestamp, imo, callsign, speed, area, type, country, destination, current_port_id, current_port, next_port_id, next_port) 
            VALUES ('" . $vessel["name"] . "'," . $vessel["id"] . "," . $vessel["mmsi"] . "," . $vessel["lat"] . "," . $vessel["lon"] . "," . $vessel["timestamp"] . "," . $vessel["imo"] . ",'" . $vessel["callsign"] . "'," . $vessel["speed"] . ",'" . $vessel["area"] . "','" . $vessel["type"] . "','" . $vessel["country"] . "','" . $vessel["destination"] . "'," . $vessel["port_current_id"] . ",'" . $vessel["port_current"] . "'," . $vessel["port_next_id"] . ",'" . $vessel["port_next"] . "')
            ON DUPLICATE KEY UPDATE
            name ='" . $vessel["name"] . "',id =" . $vessel["id"] . ",mmsi =" . $vessel["mmsi"] . ",lat =" . $vessel["lat"] . ",lon =" . $vessel["lon"] . ",timestamp =" . $vessel["timestamp"] . ",imo =" . $vessel["imo"] . ",callsign ='" . $vessel["callsign"] . "',speed =" . $vessel["speed"] . ",area ='" . $vessel["area"] . "',type ='" . $vessel["type"] . "',country ='" . $vessel["country"] . "',destination ='" . $vessel["destination"] . "',current_port_id =" . $vessel["port_current_id"] . ",current_port ='" . $vessel["port_current"] . "',next_port_id =" . $vessel["port_next_id"] . ",next_port ='" . $vessel["port_next"] ."'";
            if ($this->db->query($sql) === TRUE) {
                #echo "New record created successfully";
            } else {
                #echo "\nError: " . $sql . "<br>" . parent::$db->error;
                #echo "\n<br>" . var_dump($vessel) . "\n";
            }
        }
    }
    
}

?>
