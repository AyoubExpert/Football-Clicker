<?php
$upgrades = [
    [
        'id'    => 'scout',
        'title' => 'Jeugd Scout',
        'icon'  => '🔍',
        'rate'  => 1,
        'cost'  => 10,
        'owned' => 0
    ],
    [
        'id'    => 'academy',
        'title' => 'Voetbalacademie',
        'icon'  => '🏆',
        'rate'  => 5,
        'cost'  => 50,
        'owned' => 0
    ],
    [
        'id'    => 'agent',
        'title' => 'Top Agent',
        'icon'  => '💼',
        'rate'  => 20,
        'cost'  => 200,
        'owned' => 0
    ]
];
?>

<aside class="upgrades-card">
    <div class="section-header">
        <div class="header-title">
            <span class="header-icon">⚡</span>
            <h2>Transfers & Staf</h2>
        </div>
        <span class="upgrades-count" id="upgrades-count">0/<?php echo count($upgrades); ?> Actief</span>
    </div>

    <div class="upgrades-list">
        <?php foreach ($upgrades as $upgrade): ?>
            <button type="button" 
                    class="upgrade-card" 
                    id="buy-<?php echo $upgrade['id']; ?>"
                    data-cost="<?php echo $upgrade['cost']; ?>"
                    data-rate="<?php echo $upgrade['rate']; ?>">
                
                <div class="upgrade-left">
                    <div class="upgrade-icon-box"><?php echo $upgrade['icon']; ?></div>
                    <div class="upgrade-details">
                        <span class="upgrade-title"><?php echo htmlspecialchars($upgrade['title']); ?></span>
                        <span class="upgrade-rate">+<?php echo $upgrade['rate']; ?> / sec</span>
                    </div>
                </div>

                <div class="upgrade-right">
                    <span class="owned-badge" id="owned-<?php echo $upgrade['id']; ?>"><?php echo $upgrade['owned']; ?></span>
                    <span class="cost-badge">
                        <span id="cost-<?php echo $upgrade['id']; ?>"><?php echo $upgrade['cost']; ?></span> spelers
                    </span>
                </div>
            </button>
        <?php endforeach; ?>
    </div>
</aside>