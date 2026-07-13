class Bullet {
    constructor(x, y, angle, speed, color) {
        this.x = x; this.y = y; this.radius = 4;
        this.speed = speed; this.color = color;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.isDestroyed = false;
    }
    update() { this.x += this.vx; this.y += this.vy; }
    draw(ctx) { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); }
}

window.WeaponSystem = {
    lastShotTime: 0,
    stats: {
        'pistol': { fireRate: 350, speed: 12, color: '#ffff00', auto: false, name: "Lục" },
        'machine_gun': { fireRate: 80, speed: 15, color: '#ff5500', auto: true, name: "Liên Thanh" },
        'shotgun': { fireRate: 700, speed: 10, color: '#ff3333', auto: false, name: "Shotgun" } // Súng mới
    },
    shoot: function(player) {
        let now = Date.now();
        let weapon = this.stats[player.currentWeapon];
        if (!weapon.auto && !Game.mouse.justClicked) return;
        
        if (now - this.lastShotTime > weapon.fireRate) {
            let angle = Physics.getAngle(player.x, player.y, Game.worldMouse.x, Game.worldMouse.y);
            
            if (player.currentWeapon === 'shotgun') {
                // Shotgun văng 5 viên đạn tỏa ra xung quanh
                for(let i = 0; i < 5; i++) {
                    let spread = (Math.random() - 0.5) * 0.6; // Độ lệch góc
                    let randSpeed = weapon.speed * (0.8 + Math.random() * 0.4);
                    Game.bullets.push(new Bullet(player.x, player.y, angle + spread, randSpeed, weapon.color));
                }
                FX.triggerShake(5); // Rung màn hình cực mạnh
            } else {
                // Các súng khác bắn 1 viên
                Game.bullets.push(new Bullet(player.x, player.y, angle, weapon.speed, weapon.color));
                if(weapon.auto) FX.triggerShake(2); // Liên thanh rung nhẹ
            }
            
            this.lastShotTime = now;
            Game.mouse.justClicked = false; 
        }
    }
};
