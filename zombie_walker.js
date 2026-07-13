class ZombieWalker {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.speed = 1 + Math.random() * 0.5; // Tốc độ ngẫu nhiên từ 1 đến 1.5
        this.hp = 2; // Cần 2 viên đạn để hạ
        this.color = '#1abc9c'; // Màu xanh lá thẫm
        this.isDead = false;
    }

    update() {
        // Tìm người chơi gần nhất (hiện tại chỉ có 1 người)
        if (Game.players.length > 0) {
            let target = Game.players[0]; // Đuổi theo player 1
            let angle = Physics.getAngle(this.x, this.y, target.x, target.y);
            
            // Di chuyển về phía người chơi
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

window.ZombieSystem = {
    spawnZombie: function() {
        // Xuất hiện ngẫu nhiên ở 4 viền màn hình
        let x, y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 : Game.width;
            y = Math.random() * Game.height;
        } else {
            x = Math.random() * Game.width;
            y = Math.random() < 0.5 ? 0 : Game.height;
        }
        Game.zombies.push(new ZombieWalker(x, y));
    }
};
