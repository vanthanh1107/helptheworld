class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.speed = 3;
        this.maxHp = 100;
        this.hp = 100;
        this.hasArmor = false; // Trạng thái mặc giáp
    }

    update() {
        if (Game.keys.w && this.y > this.radius) this.y -= this.speed;
        if (Game.keys.s && this.y < Game.height - this.radius) this.y += this.speed;
        if (Game.keys.a && this.x > this.radius) this.x -= this.speed;
        if (Game.keys.d && this.x < Game.width - this.radius) this.x += this.speed;
    }

    equipArmor() {
        if (!this.hasArmor) {
            this.hasArmor = true;
            this.maxHp += 50; // Giáp cộng 50 máu
            this.hp = this.maxHp; // Hồi đầy máu luôn
            
            // Hiện icon giáp trên UI
            document.getElementById('armor-display').style.display = 'block';
            document.getElementById('hp-display').innerText = "❤️ HP: " + this.hp;
        }
    }

    draw(ctx) {
        let angle = Physics.getAngle(this.x, this.y, Game.mouse.x, Game.mouse.y);
        
        ctx.save(); // Lưu trạng thái canvas
        ctx.translate(this.x, this.y); // Di chuyển tâm vẽ đến nhân vật
        ctx.rotate(angle); // Xoay canvas theo hướng chuột
        
        if (Assets.player.complete) {
            // Vẽ ảnh nhân vật gốc (Kích thước 45x45)
            ctx.drawImage(Assets.player, -22.5, -22.5, 45, 45);
            
            // Nếu có giáp, vẽ ảnh giáp đè lên
            if (this.hasArmor && Assets.armor.complete) {
                ctx.drawImage(Assets.armor, -22.5, -22.5, 45, 45);
            }
        } else {
            // Backup nếu ảnh chưa tải
            ctx.fillStyle = this.hasArmor ? '#3498db' : '#00a8ff';
            ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI*2); ctx.fill();
        }
        
        ctx.restore(); // Khôi phục trạng thái canvas (để không làm xoay cả bản đồ)
    }
}
