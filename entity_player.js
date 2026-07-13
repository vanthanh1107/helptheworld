class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.color = '#00a8ff'; // Màu xanh
        this.speed = 3;
        this.hp = 100;
    }

    update() {
        // Cập nhật vị trí dựa trên phím bấm (giới hạn không ra khỏi viền canvas)
        if (Game.keys.w && this.y > this.radius) this.y -= this.speed;
        if (Game.keys.s && this.y < Game.height - this.radius) this.y += this.speed;
        if (Game.keys.a && this.x > this.radius) this.x -= this.speed;
        if (Game.keys.d && this.x < Game.width - this.radius) this.x += this.speed;
    }

    draw(ctx) {
        // Vẽ nhân vật
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        
        // Vẽ tia ngắm hướng về phía chuột
        let angle = Physics.getAngle(this.x, this.y, Game.mouse.x, Game.mouse.y);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(angle) * 30, this.y + Math.sin(angle) * 30);
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineWidth = 1; // reset
    }
}
