class Player {
    constructor(x, y) {
        this.x = x; this.y = y; this.radius = 15;
        this.speed = 3.5; this.maxHp = 100; this.hp = 100;
        this.hasArmor = false; this.currentWeapon = 'pistol'; this.hasKey = false;
        
        // THÊM MỚI: Các biến dùng cho kỹ năng Lướt (Dash)
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashCooldown = 0;
    }
    
    update() {
        let currentSpeed = this.speed;

        // KIỂM TRA LƯỚT
        if (this.dashCooldown > 0) this.dashCooldown--;
        
        if (Game.keys.space && this.dashCooldown <= 0) {
            this.isDashing = true;
            this.dashTimer = 10; // Thời gian lướt kéo dài 10 khung hình
            this.dashCooldown = 60; // Hồi chiêu 1 giây (60 khung hình)
            // Thêm hiệu ứng khói/bụi khi lướt
            for(let i=0; i<5; i++) Game.particles.push(new Particle(this.x, this.y, '#95a5a6'));
        }

        if (this.isDashing) {
            currentSpeed = this.speed * 4; // Tốc độ lướt x4 lần
            this.dashTimer--;
            if (this.dashTimer <= 0) this.isDashing = false;
        }

        // DI CHUYỂN
        if (Game.keys.w && this.y > this.radius) this.y -= currentSpeed;
        if (Game.keys.s && this.y < Game.mapHeight - this.radius) this.y += currentSpeed;
        if (Game.keys.a && this.x > this.radius) this.x -= currentSpeed;
        if (Game.keys.d && this.x < Game.mapWidth - this.radius) this.x += currentSpeed;
    }
    
    equipLoot(type) {
        if (type === 'armor' && !this.hasArmor) {
            this.hasArmor = true; this.maxHp += 50; this.hp = this.maxHp; document.getElementById('armor-display').style.display = 'block';
        } else if (type === 'machine_gun') { this.currentWeapon = 'machine_gun'; document.getElementById('weapon-display').innerText = "🔫 Súng: Liên Thanh";
        } else if (type === 'shotgun') { this.currentWeapon = 'shotgun'; document.getElementById('weapon-display').innerText = "🔫 Súng: Shotgun (Mạnh)";
        } else if (type === 'medkit') { this.hp = Math.min(this.hp + 40, this.maxHp); 
        } else if (type === 'key') { this.hasKey = true; document.getElementById('key-display').style.display = 'block'; }
        document.getElementById('hp-display').innerText = "❤️ HP: " + this.hp;
    }
    
    draw(ctx) {
        let angle = Physics.getAngle(this.x, this.y, Game.worldMouse.x, Game.worldMouse.y);
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(angle);
        
        // Tạo hiệu ứng mờ nhòe khi đang lướt
        if (this.isDashing) ctx.globalAlpha = 0.5;

        if (Assets.player.complete) {
            ctx.drawImage(Assets.player, -22.5, -22.5, 45, 45);
            if (this.hasArmor && Assets.armor.complete) ctx.drawImage(Assets.armor, -22.5, -22.5, 45, 45);
        } else {
            ctx.fillStyle = this.hasArmor ? '#3498db' : '#00a8ff';
            ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI*2); ctx.fill();
        }
        ctx.restore();
    }
}
