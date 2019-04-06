<?php
try {
    header('Content-Type: application/json');
    require_once 'simple_html_dom.php';

    $warframeParts = array('Chassis', 'Systems', 'Neuroptics', 'Wings', 'Harness');
    $weaponParts = array('Stock', 'Receiver', 'Barrel', 'Upper Limb', 'Lower Limb', 'Grip', 'String', 'Blade', 'Handle', 'Stars', 'Pouch');
    $arrContextOptions = array(
        "ssl" => array(
            "verify_peer" => false,
            "verify_peer_name" => false,
        ),
    );

    $url = isset($_POST['url']) ? ucwords(strtolower($_POST['url'])) : 'Wukong';
    $build = isset($_POST['build']) ? $_POST['build'] : true;
    $research = isset($_POST['research']) ? $_POST['research'] != 'Y' : true;
    $type = isset($_POST['type']) ? $_POST['type'] : 'War';

    $context = stream_context_create($arrContextOptions);
    $html = @file_get_html('https://warframe.fandom.com/wiki/' . str_replace(" ", $type == 'Wea' ? '_' : '#', $url), false, $context);

    if($html === FALSE)
        throw new Exception(($type == 'Wea' ? 'Weapon/Sentinel ' : 'Warframe/Archwing ') . 'Not Found');

    $ret = $html->find('.foundrytable');

    if(count($ret) == 0)
        throw new Exception("Baro Ki'Teer Exclusive");

    $hasResearch = !is_null($ret[0]->find('a[href=/wiki/Research]', 0));

    $resorcesArray = array();
    $totalResources = array();
    $resorcesArrayResearch = array();

    if($type == 'Wea') {
        if($build) {
            $tbody = $ret[0]->find('tr');

            foreach (str_get_html($tbody[1])->find('td') as $element) {
                if(is_null($element->find('a', 0)))
                    continue;

                $resource = $element->find('a', 0)->title;
                $resource = in_array($resource, $weaponParts) ? $url . ' ' . $resource : $resource;
                $amount = (int) str_replace(",", "", $element->plaintext);

                if(array_key_exists($resource, $resorcesArray))
                    $resorcesArray[$resource] += $amount;
                else
                    $resorcesArray[$resource] = $amount;

                if(array_key_exists($resource, $totalResources))
                    $totalResources[$resource] += $amount;
                else
                    $totalResources[$resource] = $amount;
            }

            $element = str_get_html($tbody[3])->find('td', 1)->plaintext;
            $element = substr($element, strrpos($element, ":") + 1);

            if(trim($element) == 'N/A')
                $element = '0';

            $resource = "Credits";
            $amount = (int) str_replace(",", "", $element);

            if(array_key_exists($resource, $resorcesArray))
                $resorcesArray[$resource] += $amount;
            else
                $resorcesArray[$resource] = $amount;

            if(array_key_exists($resource, $totalResources))
                $totalResources[$resource] += $amount;
            else
                $totalResources[$resource] = $amount;
        }

        if($research && $hasResearch) {
            $tbody = $ret[0]->find('tr');

            foreach (str_get_html($tbody[5])->find('td') as $element) {
                if(is_null($element->find('a', 0)))
                    continue;

                $resource = $element->find('a', 0)->title;
                $resource = in_array($resource, $weaponParts) ? $url . ' ' . $resource : $resource;
                $amount = (int) str_replace(",", "", $element->plaintext);

                if(array_key_exists($resource, $resorcesArrayResearch))
                    $resorcesArrayResearch[$resource] += $amount;
                else
                    $resorcesArrayResearch[$resource] = $amount;

                if(array_key_exists($resource, $totalResources))
                    $totalResources[$resource] += $amount;
                else
                    $totalResources[$resource] = $amount;
            }
        }
    } else if ($type == 'War') {
        if($build) {
            $foundryIndex = strpos(strtoupper($url), 'PRIME') === false ? 0 : 1;

            $tbody = $ret[$foundryIndex]->find('tr');
            $rowsToCheck = array();
            $rowsToCheck[] = 1;

            if(!isset($_POST['neuroptics']))
                $rowsToCheck[] = 5;
            if(!isset($_POST['chassis']))
                $rowsToCheck[] = 8;
            if(!isset($_POST['systems']))
                $rowsToCheck[] = 11;

            foreach ($rowsToCheck as $row) {
                foreach (str_get_html($tbody[$row])->find('td') as $element) {
                    if(is_null($element->find('a', 0)))
                        continue;

                    $resource = $element->find('a', 0)->title;
                    $resource = in_array($resource, $warframeParts) ? $url . ' ' . $resource : $resource;
                    $amount = (int) str_replace(",", "", $element->plaintext == '' ? '1' : $element->plaintext);

                    if(array_key_exists($resource, $resorcesArray))
                        $resorcesArray[$resource] += $amount;
                    else
                        $resorcesArray[$resource] = $amount;

                    if(array_key_exists($resource, $totalResources))
                        $totalResources[$resource] += $amount;
                    else
                        $totalResources[$resource] = $amount;
                }
            }

            $element = str_get_html($tbody[3])->find('td', 1)->plaintext;
            $element = substr($element, strrpos($element, ":") + 1);

            if(trim($element) == 'N/A')
                $element = '0';

            $resource = "Credits";
            $amount = (int) str_replace(",", "", $element);

            if(array_key_exists($resource, $resorcesArray))
                $resorcesArray[$resource] += $amount;
            else
                $resorcesArray[$resource] = $amount;

            if(array_key_exists($resource, $totalResources))
                $totalResources[$resource] += $amount;
            else
                $totalResources[$resource] = $amount;
        }

        if($research && $hasResearch) {
            $foundryIndex = strpos(strtoupper($url), 'PRIME') === false ? 0 : 1;

            $tbody = $ret[$foundryIndex]->find('table')[0]->find('tr');
            $rowsToCheck = array();

            if(!isset($_POST['frame_res']))
                $rowsToCheck[] = 1;
            if(!isset($_POST['neuroptics_res']))
                $rowsToCheck[] = 4;
            if(!isset($_POST['chassis_res']))
                $rowsToCheck[] = 7;
            if(!isset($_POST['systems_res']))
                $rowsToCheck[] = 10;

            foreach ($rowsToCheck as $row) {
                foreach (str_get_html($tbody[$row])->find('td') as $element) {
                    if(is_null($element->find('a', 0)))
                        continue;

                    $resource = $element->find('a', 0)->title;
                    $resource = in_array($resource, $warframeParts) ? $url . ' ' . $resource : $resource;
                    $amount = (int) str_replace(",", "", $element->plaintext == '' ? '1' : $element->plaintext);

                    if(array_key_exists($resource, $resorcesArrayResearch))
                        $resorcesArrayResearch[$resource] += $amount;
                    else
                        $resorcesArrayResearch[$resource] = $amount;

                    if(array_key_exists($resource, $totalResources))
                        $totalResources[$resource] += $amount;
                    else
                        $totalResources[$resource] = $amount;
                }
            }
        }
    }

    echo json_encode(array('success' => 1, 'total' => $totalResources, 'build' => $resorcesArray, 'research' => $resorcesArrayResearch));
} catch (Exception $e) {
    echo json_encode(array('success' => 0, 'msg' => $e->getMessage()));
}
