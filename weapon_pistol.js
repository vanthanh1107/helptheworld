class Bullet {
    constructor(x, y, angle, speed, color) {
        this.x = x; this.y = y; this.radius = 4;
        this.speed = speed; this.color = color;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.isDestroyed = false;
    }
    update() { this.x += this.vx; this.y += this.vy; }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
    }
}

window.WeaponSystem = {
    lastShotTime: 0,
    stats: {
        'pistol': { fireRate: 350, speed: 10, color: '#ffff00', auto: false },
        'machine_gun': { fireRate: 80, speed: 15, color: '#ff5500', auto: true }
    },
    shoot: function(player) {
        let now = Date.now();
        let weapon = this.stats[player.currentWeapon];
        if (!weapon.auto && !Game.mouse.justClicked) return;
        
        if (now - this.lastShotTime > weapon.fireRate) {
            // Viên đạn nhắm thẳng vào worldMouse thay vì mouse trên màn hình
            let angle = Physics.getAngle(player.x, player.y, Game.worldMouse.x, Game.worldMouse.y);
            Game.bullets.push(new Bullet(player.x, player.y, angle, weapon.speed, weapon.color));
            this.lastShotTime = now;
            Game.mouse.justClicked = false; 
        }
    }
};
