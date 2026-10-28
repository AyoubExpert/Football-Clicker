<div class="game-wrapper">
    <div class="field-overlay"></div>
    <div class="ambient-glow"></div>

    <div class="game-wrapper">
    <div class="field-overlay"></div>
    <div class="ambient-glow"></div>

    <div class="game-container">
        <main class="game-card">
            <div class="game-card-bg">
                <img src="<?php echo images; ?>/Field.png" alt="Voetbalveld Achtergrond">
                    <div class="card-bg-overlay"></div>
                    <div class="card-light-beam"></div>
                </div>
    
                <header class="stats-header">
                    <div class="badge">
                        <span class="badge-dot"></span>
                        <span>Football Manager Clicker</span>
                    </div>
    
                    <div class="player-count-wrapper">
                        <div class="count-box">
                            <h1 class="player-count"><span id="player-count"><?php echo $initial_players; ?></span></h1>
                        </div>
                        <span class="unit-label">Spelers</span>
                    </div>
    
                    <div class="cps-badge">
                        <span id="pps">0</span> <small>spelers / sec</small>
                    </div>
    
                    <div class="progress-container">
                        <div class="progress-bar" id="progress-bar" style="width: 35%;"></div>
                    </div>
                </header>
    
                <div class="stats-strip">
                    <div class="stat-item">
                        <span class="stat-icon">🎯</span>
                        <div class="stat-info">
                            <span class="stat-label">Totaal Geklikt</span>
                            <span class="stat-value" id="total-clicks">0</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">👔</span>
                        <div class="stat-info">
                            <span class="stat-label">Staf Leden</span>
                            <span class="stat-value" id="total-staff">0</span>
                        </div>
                    </div>
                </div>
    
                <section class="click-section">
                    <div class="field-circle"></div>
                    <button type="button" id="player-btn" class="player-button" aria-label="Scout Speler">
                        <div class="button-inner">
                            <span class="player-icon">🏃‍♂️</span>
                        </div>
                        <div class="button-glow"></div>
                    </button>
                </section>
            </main>
            
            <?php include 'upgrades.php'; ?>
        </div>
    </div>
</div>