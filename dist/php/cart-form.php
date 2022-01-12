<!DOCTYPE html>

<head lang="ru">
    <meta charset="UTF-8">
</head>

<body>
    <?php
    // получатель
    $to = 'francuz-avto74@mail.ru';

    // тема письма
    $subject = 'Новый заказ';

    //данные инпутов
    $info = $_POST['spare-parts'];
    $name = $_POST['name'];
    $phone = $_POST['phone-num'];
    $email = $_POST['e-mail'];
    
    $from = 'webmaster@example.com';

    // текст письма

    $message = 'Новый заказ товаров: ' . "\r\n\n" . 'Информация о деталях:' . "\r\n" . $info . "\r\n\n" . 'Контактные данные: ' . "\r\n" . 'Имя: ' . $name . "\r\n" . 'E-mail: ' . $email . "\r\n" . 'Номер телефона: ' . $phone . "\r\n";
    $message = wordwrap($message, 70, "\r\n");

    //headers
    $headers = array(
        'From' => $from,
        'Reply-To' => $from,
        'X-Mailer' => 'PHP/' . phpversion()
    );

    //отправка и редирект
    if (mail($to, $subject, $message, $headers)) {
        echo "<meta http-equiv='refresh' content='0;url=https://fra174.ru/redirect.html#cartRequestSuccess'>";
    } else {
        echo "<meta http-equiv='refresh' content='0;url=https://fra174.ru/redirect.html#cartRequestFail'>";
    }

    ?>
</body>

</html>