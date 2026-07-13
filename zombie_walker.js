class Zombie {
    constructor(x, y, type = 'normal') {
        this.x = x; this.y = y; this.type = type;
        this.isAwake = false;
        
        // Chỉ số theo từng loại Zombie
        if (type === 'normal') {
            this.radius = 15; this.speed = 1.8; this.hp = 4; this.color = '#1abc9c'; this.score = 10;
        } else if (type === 'runner') {
            this.radius = 12; this.speed = 4.0; this.hp = 2; this.color = '#e74c3c'; this.score = 20; // Đỏ, nhỏ, chạy cực nhanh
        } else if (type === 'tanker') {
            this.radius = 28; this.speed = 0.8; this.hp = 25; this.color = '#8e44ad'; this.score = 50; // Tím, to, máu trâu
        }
    }
    update() {
        if (Game.players.length > 0) {
            let target = Game.players[0];
            let dist = Physics.getDistance(this.x, this.y, target.x, target.y);
            
            // Tanker phát hiện từ rất xa (500px), các con khác 300px
            let awakeDist = (this.type === 'tanker') ? 500 : 300; 
            if (dist < awakeDist) this.isAwake = true; 
            
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
        if(this.isAwake) { ctx.fillStyle='red'; ctx.fillRect(this.x - this.radius/2, this.y - 4, this.radius, 8); }
    }
}
