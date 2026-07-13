class Bullet {
    constructor(x, y, angle, speed, color) {
        this.x = x; this.y = y; this.radius = 4; this.speed = speed; this.color = color;
        this.vx = Math.cos(angle) * this.speed; this.vy = Math.sin(angle) * this.speed; this.isDestroyed = false;
    }
    update() { this.x += this.vx; this.y += this.vy; }
    draw(ctx) { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); }
}

class Grenade {
    constructor(x, y, targetX, targetY) {
        this.x = x; this.y = y; this.radius = 6;
        let angle = Physics.getAngle(x, y, targetX, targetY);
        let dist = Math.min(Physics.getDistance(x, y, targetX, targetY), 300); 
        this.vx = Math.cos(angle) * (dist / 30); this.vy = Math.sin(angle) * (dist / 30);
        this.timer = 90; this.isDestroyed = false;
    }
    update() {
        this.x += this.vx; this.y += this.vy; this.vx *= 0.92; this.vy *= 0.92;
        this.timer--; if (this.timer <= 0) this.explode();
    }
    explode() {
        this.isDestroyed = true; FX.triggerShake(15); FX.explosionSplatter(this.x, this.y);
        AudioSys.play('explosion', 0.8); Game.explosionLight = { x: this.x, y: this.y, life: 10 }; 
        Game.zombies.forEach(z => {
            if (Physics.getDistance(this.x, this.y, z.x, z.y) < 150) {
                z.hp -= 20; z.isAwake = true; FX.bloodSplatter(z.x, z.y); FX.showDamage(z.x, z.y, 20, '#e74c3c');
            }
        });
    }
    draw(ctx) {
        ctx.fillStyle = '#2c3e50'; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
        if(this.timer % 10 < 5) { ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(this.x, this.y, 3, 0, Math.PI*2); ctx.fill(); }
    }
}

window.WeaponSystem = {
    lastShotTime: 0,
    stats: {
        'pistol': { fireRate: 350, speed: 12, clip: 12, audio: 'shoot_pistol', color: '#ffff00', auto: false, name: "LỤC CƠ BẢN" },
        'machine_gun': { fireRate: 90, speed: 15, clip: 30, audio: 'shoot_machine', color: '#ff5500', auto: true, name: "SÚNG LIÊN THANH" },
        'shotgun': { fireRate: 750, speed: 10, clip: 5, audio: 'shoot_shotgun', color: '#ff3333', auto: false, name: "SHOTGUN" }
    },
    shoot: function(player) {
        let weapon = this.stats[player.currentWeapon];
        if (player.isReloading) return;
        if (!weapon.auto && !Game.mouse.justClicked) return;
        
        let now = Date.now();
        if (now - this.lastShotTime > weapon.fireRate) {
            if (player.ammo <= 0) {
                if (Game.mouse.justClicked) AudioSys.play('empty', 0.3);
                Game.mouse.justClicked = false; return;
            }
            let angle = Physics.getAngle(player.x, player.y, Game.worldMouse.x, Game.worldMouse.y);
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
            
            if(window.UpdateHUD) window.UpdateHUD(player); // Cập nhật an toàn
            
            this.lastShotTime = now; Game.mouse.justClicked = false; 
        }
    }
};
