<?php
try {
    header('Content-Type: application/json');
    require_once 'simple_html_dom.php';

    $arrContextOptions = array(
        "ssl" => array(
            "verify_peer" => false,
            "verify_peer_name" => false,
        ),
    );

    $url = isset($_POST['url']) ? $_POST['url'] : 'https://store.line.me/stickershop/product/13992900/en';

    $context = stream_context_create($arrContextOptions);
    $html = @file_get_html($url, false, $context);

    if ($html === FALSE)
        throw new Exception('Sticker Not Found');

    $ret = $html->find('.mdCMN09Li');
    $title = $html->find('.mdCMN38Item01Ttl', 0);

    if (count($ret) == 0)
        throw new Exception("Sticker Images Not Found");

    $resorcesArray = array();

    foreach ($ret as $element) {
        $element->getAllAttributes();
        $jsonString = str_replace('&quot;', '"', $element->attr['data-preview']);

        $resorcesArray[] = json_decode($jsonString, true)['animationUrl'];
    }

    $i = 0;
    $files = $resorcesArray;

    $host = gethostname();
    $zipname = $title->plaintext . '.zip';
    $zipname = str_replace(" ", "", $zipname);
    $zip = new ZipArchive();
    $zip->open($zipname, ZipArchive::CREATE);

    foreach ($files as $link) {
        $i++;

        $linkname = $title->plaintext . '_' . $i;
        $linkname = str_replace(" ", "", $linkname);

        if($host == 'DESKTOP-EEV9QVH') {
            file_put_contents($linkname . ".png", fopen($link, 'r'));
            $x = iconv("cp950", "UTF-8", shell_exec("apng2gif " . $linkname . ".png " . $linkname . ".gif"));

            $zip->addFromString(basename($linkname . '.gif'), file_get_contents($linkname . ".gif"));
        } else
            $zip->addFromString(basename($title->plaintext . '_' . $i .'.png'),  file_get_contents($link));
    }

    $zip->close();

    echo json_encode(array('success' => 1, 'params' => $_POST, 'stickers' => $resorcesArray, 'zipname' => $zipname));
} catch (Exception $e) {
    echo json_encode(array('success' => 0, 'params' => $_POST, 'msg' => $e->getMessage()));
}
