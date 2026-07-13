class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y;
        this.radius = Math.random() * 3 + 1;
        // Bắn ngẫu nhiên ra mọi hướng
        let angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1.0; // Tuổi thọ hạt (1.0 là 100%)
        this.color = color;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.vx *= 0.85; // Ma sát làm hạt chậm dần
        this.vy *= 0.85;
        this.life -= 0.05; // Mờ dần
    }
    draw(ctx) {
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

window.FX = {
    // Rung màn hình
    shakeAmount: 0,
    triggerShake: function(intensity) {
        this.shakeAmount = intensity;
    },
    applyShake: function(ctx) {
        if (this.shakeAmount > 0) {
            let dx = (Math.random() - 0.5) * this.shakeAmount;
            let dy = (Math.random() - 0.5) * this.shakeAmount;
            ctx.translate(dx, dy);
            this.shakeAmount *= 0.8; // Giảm dần độ rung
            if (this.shakeAmount < 0.5) this.shakeAmount = 0;
        }
    },
    
    // Tạo hiệu ứng máu văng
    bloodSplatter: function(x, y) {
        for(let i = 0; i < 8; i++) {
            Game.particles.push(new Particle(x, y, '#c0392b')); // Hạt máu đỏ tươi
        }
        // Lưu lại một vết máu vĩnh viễn trên nền đất
        Game.bloodStains.push({ x: x + (Math.random()-0.5)*20, y: y + (Math.random()-0.5)*20, radius: Math.random()*5+2 });
    }
};
