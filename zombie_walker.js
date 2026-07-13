class ZombieWalker {
    constructor(x, y) {
        this.x = x; this.y = y; this.radius = 15;
        this.speed = 1.2; this.hp = 3; this.color = '#1abc9c';
        this.isAwake = false; // Mặc định ngủ
    }
    update() {
        if (Game.players.length > 0) {
            let target = Game.players[0];
            let dist = Physics.getDistance(this.x, this.y, target.x, target.y);
            
            // Nếu người chơi vào gần 250px -> Tỉnh dậy đuổi theo
            if (dist < 250) this.isAwake = true;
            
            if (this.isAwake) {
                let angle = Physics.getAngle(this.x, this.y, target.x, target.y);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            } else {
                // Đi lang thang nhẹ ngẫu nhiên
                this.x += (Math.random() - 0.5) * 0.5;
                this.y += (Math.random() - 0.5) * 0.5;
            }
        }
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
        // Mắt đỏ nếu đang thức
        if(this.isAwake) { ctx.fillStyle='red'; ctx.fillRect(this.x-3, this.y-3, 6,6); }
    }
}
