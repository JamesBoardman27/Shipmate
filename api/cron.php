<?php
#requires cron task to call at wanted intervals using lynx command
 echo "Started...";
 require("inc/config.php");
 try {
     $update = new rollingRequest();
     for ($i = $bound; $i < $bound + 50; $i++) { 
         $update -> nextArea();
         sleep(1);
    }
 } catch (\Throwable $th) {
     echo("Server is not available at the moment.");
 }
?>