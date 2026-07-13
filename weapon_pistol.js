//... (Các phần khác của file giữ nguyên) ...
    shoot: function(player) {
        let weapon = this.stats[player.currentWeapon];
        if (player.isReloading) return;
        
        // Trên mobile, chỉ cần giữ cần gạt phải là tự bắn. PC thì xét thêm súng Auto.
        let isMobileShooting = Game.mobile && Game.mobile.isShooting;
        if (!weapon.auto && !Game.mouse.justClicked && !isMobileShooting) return;
        
        let now = Date.now();
        if (now - this.lastShotTime > weapon.fireRate) {
            if (player.ammo <= 0) {
                if (Game.mouse.justClicked || isMobileShooting) AudioSys.play('empty', 0.3);
                Game.mouse.justClicked = false; return;
            }
            
            // Lấy góc bắn (Mobile hoặc PC)
            let angle = 0;
            if (isMobileShooting) {
                angle = Game.mobile.aimAngle;
            } else {
                angle = Physics.getAngle(player.x, player.y, Game.worldMouse.x, Game.worldMouse.y);
            }
            
            if (player.currentWeapon === 'shotgun') {
                for(let i = 0; i < 5; i++) {
                    let spread = (Math.random() - 0.5) * 0.6; 
                    Game.bullets.push(new Bullet(player.x, player.y, angle + spread, weapon.speed * (0.8 + Math.random() * 0.4), weapon.color));
                }
                FX.triggerShake(5);
            } else {
                Game.bullets.push(new Bullet(player.x, player.y, angle, weapon.speed, weapon.color));
                if(weapon.auto) FX.triggerShake(2);
            }
            
            AudioSys.play(weapon.audio);
            player.ammo--; 
            
            if(window.UpdateHUD) window.UpdateHUD(player);
            
            this.lastShotTime = now; Game.mouse.justClicked = false; 
        }
    }
//...
