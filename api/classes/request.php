<?php

abstract class request
{
    protected static $db;

    protected $data;
    protected $requestType;

    private $request;
    private $url = "https://swift-bobcat-80.loca.lt/";
    #private $url = "http://localhost:5000/";

    public function __construct()
    {
      require("../config.inc.php");
      if (isset($db) == false) {
        $this->db = new mysqli("dbhost.cs.man.ac.uk", $database_user, $database_pass , "2021_comp10120_z17");
        if ($this->db->connect_error) {
          die("Connection failed: " . $this->db->connect_error);
        }
        #echo "Connected successfully <br>";
      }
    }
    protected function getData(){
      $this->request = $this->url . $this->requestType;
      #echo $this->request . "\n";
      $response = file_get_contents($this->request);
      $this->data = json_decode($response,true);
    }
}
?>