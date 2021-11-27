<!DOCTYPE html>

<head lang="ru">
    <meta charset="UTF-8">
</head>

<body>
    <?php
    // получатель
    $to = 'francuz-avto74@mail.ru';

    // тема письма
    $subject = 'VIN-запрос';

    //данные инпутов
    $vin = $_POST['vin'];
    $brand = $_POST['brand'];
    $model = $_POST['model'];
    $year = $_POST['year'];
    $info = $_POST['spare-parts'];
    $name = $_POST['name'];
    $phone = $_POST['phone-num'];
    $email = $_POST['e-mail'];
    
    $from = 'webmaster@example.com';

    // текст письма
    $message = 'Новый заказ по VIN: ' . "\r\n" . 'VIN: ' . $vin . "\r\n\n" . 'Дополнительная информация:' . "\r\n" . 'Марка: ' . $brand . "\r\n" . 'Модель: ' . $model . "\r\n" . 'Год выпуска: ' . $year . "\r\n\n" . 'Информация о деталях:' . "\r\n" . $info . "\r\n\n" . 'Контактные данные: ' . "\r\n" . 'Имя: ' . $name . "\r\n" . 'E-mail: ' . $email . "\r\n" . 'Номер телефона: ' . $phone . "\r\n";
    $message = wordwrap($message, 70, "\r\n");

    //headers
    $headers = array(
        'From' => $from,
        'Reply-To' => $from,
        'X-Mailer' => 'PHP/' . phpversion()
    );

    //отправка и редирект
    if (mail($to, $subject, $message, $headers)) {
        echo "<meta http-equiv='refresh' content='0;url=https://fra174.ru/redirect.html#vinRequestSuccess'>";
    } else {
        echo "<meta http-equiv='refresh' content='0;url=https://fra174.ru/redirect.html#vinRequestFail'>";
    }
    ?>
</body>

</html>