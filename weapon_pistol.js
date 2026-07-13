class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.radius = 4;
        this.speed = 10;
        this.color = '#ffff00'; // Đạn màu vàng
        
        // Tính vận tốc x, y dựa trên góc bắn
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.isDestroyed = false;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Xóa đạn nếu bay ra khỏi màn hình
        if (this.x < 0 || this.x > Game.width || this.y < 0 || this.y > Game.height) {
            this.isDestroyed = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

window.WeaponSystem = {
    lastShotTime: 0,
    fireRate: 200, // Mili-giây giữa 2 lần bắn
    
    shootPistol: function(player) {
        let now = Date.now();
        if (now - this.lastShotTime > this.fireRate) {
            let angle = Physics.getAngle(player.x, player.y, Game.mouse.x, Game.mouse.y);
            let bullet = new Bullet(player.x, player.y, angle);
            Game.bullets.push(bullet);
            this.lastShotTime = now;
        }
    }
};
