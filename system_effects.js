// ... (Giữ nguyên code class Particle và window.FX cũ của bạn) ...
class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y; this.radius = Math.random() * 3 + 1;
        let angle = Math.random() * Math.PI * 2; let speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed; this.vy = Math.sin(angle) * speed;
        this.life = 1.0; this.color = color;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vx *= 0.85; this.vy *= 0.85; this.life -= 0.05; }
    draw(ctx) { ctx.globalAlpha = Math.max(0, this.life); ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1.0; }
}

window.FX = {
    shakeAmount: 0,
    triggerShake: function(intensity) { this.shakeAmount = intensity; },
    applyShake: function(ctx) {
        if (this.shakeAmount > 0) {
            ctx.translate((Math.random() - 0.5) * this.shakeAmount, (Math.random() - 0.5) * this.shakeAmount);
            this.shakeAmount *= 0.8; if (this.shakeAmount < 0.5) this.shakeAmount = 0;
        }
    },
    bloodSplatter: function(x, y) {
        for(let i = 0; i < 8; i++) Game.particles.push(new Particle(x, y, '#c0392b'));
        Game.bloodStains.push({ x: x + (Math.random()-0.5)*20, y: y + (Math.random()-0.5)*20, radius: Math.random()*5+2 });
    },
    
    // THÊM MỚI: Hàm gọi chữ sát thương bay lên
    showDamage: function(x, y, amount, isCrit = false) {
        Game.floatingTexts.push(new FloatingText(x, y, "-" + amount, isCrit ? '#f1c40f' : '#fff'));
    }
};

// THÊM MỚI: Lớp quản lý số sát thương bay lên
class FloatingText {
    constructor(x, y, text, color) {
        this.x = x + (Math.random() - 0.5) * 20; // Lệch ngẫu nhiên một chút
        this.y = y - 20;
        this.text = text;
        this.color = color;
        this.life = 1.0;
    }
    update() {
        this.y -= 1.5; // Bay từ từ lên trên
        this.life -= 0.02; // Mờ dần
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.font = "bold 20px 'Courier New', Courier, monospace";
        ctx.shadowColor = 'black'; ctx.shadowBlur = 4; // Viền đen cho chữ dễ đọc
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}
