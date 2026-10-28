<?php
// MOET HELEMAAL BOVENAAN STAAN (geen spatie of HTML hiervoor!)
session_start();

if (!isset($_SESSION['players'])) {
    $_SESSION['players'] = 0;
}

$initial_players = (int) $_SESSION['players'];
?>

<!DOCTYPE html>
<html lang="nl">
<?php
include_once 'config.php';
?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cookie Clicker</title>
    <link rel="stylesheet" href="<?php echo css; ?>/main.css">
</head>

<body>
    <header>

    </header>

    <main>
        <?php include_once resources_files . '/php/players.php'; ?>
    </main>

    <script type="module" src="<?php echo resources_files . '/js/script.js'; ?>"></script>
</body>

</html>