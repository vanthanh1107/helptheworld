class Zombie {
    constructor(x, y, type = 'normal') {
        this.x = x; this.y = y; this.type = type; this.isAwake = false;
        this.angle = 0; // Thêm biến lưu góc quay của zombie
        
        if (type === 'normal') { this.radius = 15; this.speed = 1.8; this.hp = 4; this.color = '#1abc9c'; this.score = 10; this.scale = 1.0; }
        else if (type === 'runner') { this.radius = 12; this.speed = 4.0; this.hp = 2; this.color = '#e74c3c'; this.score = 20; this.scale = 0.8; }
        else if (type === 'tanker') { this.radius = 28; this.speed = 0.8; this.hp = 25; this.color = '#8e44ad'; this.score = 50; this.scale = 1.6; } // Khổng lồ
    }
    update() {
        if (Game.players.length > 0) {
            let target = Game.players[0]; let dist = Physics.getDistance(this.x, this.y, target.x, target.y);
            let awakeDist = (this.type === 'tanker') ? 500 : 300; 
            if (dist < awakeDist) this.isAwake = true; 
            
            if (this.isAwake) {
                this.angle = Physics.getAngle(this.x, this.y, target.x, target.y);
                this.x += Math.cos(this.angle) * this.speed; this.y += Math.sin(this.angle) * this.speed;
            } else { 
                this.x += (Math.random() - 0.5) * 0.5; this.y += (Math.random() - 0.5) * 0.5; 
                this.angle += (Math.random() - 0.5) * 0.1; // Cựa quậy nhẹ khi ngủ
            }
        }
    }
    draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
        
        if (Assets.zombie.complete) {
            // Hiệu ứng màu sắc cho từng loại (Runner màu đỏ, Tanker ám tím) bằng filter
            if(this.type === 'runner') ctx.filter = 'sepia(1) hue-rotate(300deg) saturate(3)';
            if(this.type === 'tanker') ctx.filter = 'sepia(1) hue-rotate(220deg) saturate(2) brightness(0.7)';
            
            ctx.drawImage(Assets.zombie, -22.5 * this.scale, -22.5 * this.scale, 45 * this.scale, 45 * this.scale);
            ctx.filter = 'none'; // Trả lại filter bình thường
        } else {
            // Fallback nếu lỗi mạng
            ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    }
}
