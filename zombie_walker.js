class ZombieWalker {
    constructor(x, y) {
        this.x = x; this.y = y; this.radius = 15;
        this.speed = 1.8; this.hp = 4; this.color = '#1abc9c'; // Zombie trâu hơn, chạy nhanh hơn chút
        this.isAwake = false; 
    }
    update() {
        if (Game.players.length > 0) {
            let target = Game.players[0];
            let dist = Physics.getDistance(this.x, this.y, target.x, target.y);
            if (dist < 300) this.isAwake = true; // Bán kính phát hiện rộng hơn (300px)
            
            if (this.isAwake) {
                let angle = Physics.getAngle(this.x, this.y, target.x, target.y);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            } else {
                this.x += (Math.random() - 0.5) * 0.5; this.y += (Math.random() - 0.5) * 0.5;
            }
        }
    }
    draw(ctx) {
        ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
        if(this.isAwake) { ctx.fillStyle='red'; ctx.fillRect(this.x-4, this.y-4, 8,8); }
    }
}
