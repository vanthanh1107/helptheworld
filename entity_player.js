class Player {
    constructor(x, y) {
        this.x = x; this.y = y; this.radius = 15;
        this.speed = 3.5; this.maxHp = 100; this.hp = 100;
        this.hasArmor = false; this.hasKey = false;
        
        // Vũ khí & Đạn
        this.currentWeapon = 'pistol';
        this.ammo = WeaponSystem.stats['pistol'].clip;
        this.isReloading = false;
        this.reloadTimer = 0;
        this.grenadeCount = 3; // Khởi đầu có 3 quả bom
        this.lastGrenadeTime = 0;
        
        // Kỹ năng lướt
        this.isDashing = false; this.dashTimer = 0; this.dashCooldown = 0;
    }
    
    update() {
        let currentSpeed = this.speed;

        // XỬ LÝ LƯỚT
        if (this.dashCooldown > 0) this.dashCooldown--;
        if (Game.keys.space && this.dashCooldown <= 0) {
            this.isDashing = true; this.dashTimer = 10; this.dashCooldown = 60;
            for(let i=0; i<5; i++) Game.particles.push(new Particle(this.x, this.y, '#95a5a6'));
        }
        if (this.isDashing) {
            currentSpeed = this.speed * 4; this.dashTimer--;
            if (this.dashTimer <= 0) this.isDashing = false;
        }

        // XỬ LÝ NẠP ĐẠN (Bấm R)
        if (Game.keys.r && !this.isReloading && this.ammo < WeaponSystem.stats[this.currentWeapon].clip) {
            this.isReloading = true;
            this.reloadTimer = 90; // 1.5 giây
            AudioSys.play('reload');
        }
        if (this.isReloading) {
            this.reloadTimer--;
            if (this.reloadTimer <= 0) {
                this.isReloading = false;
                this.ammo = WeaponSystem.stats[this.currentWeapon].clip;
                document.getElementById('ammo-display').innerText = `🔋 Đạn: ${this.ammo}/${this.ammo}`;
            }
        }

        // XỬ LÝ NÉM BOM (Bấm G)
        let now = Date.now();
        if (Game.keys.g && this.grenadeCount > 0 && now - this.lastGrenadeTime > 1000) {
            Game.grenades.push(new Grenade(this.x, this.y, Game.worldMouse.x, Game.worldMouse.y));
            this.grenadeCount--;
            document.getElementById('grenade-display').innerText = `💣 Bom: ${this.grenadeCount}`;
            this.lastGrenadeTime = now;
        }

        // DI CHUYỂN
        if (Game.keys.w && this.y > this.radius) this.y -= currentSpeed;
        if (Game.keys.s && this.y < Game.mapHeight - this.radius) this.y += currentSpeed;
        if (Game.keys.a && this.x > this.radius) this.x -= currentSpeed;
        if (Game.keys.d && this.x < Game.mapWidth - this.radius) this.x += currentSpeed;
    }
    
    equipLoot(type) {
        if (type === 'armor' && !this.hasArmor) { this.hasArmor = true; this.maxHp += 50; this.hp = this.maxHp; document.getElementById('armor-display').style.display = 'block'; } 
        else if (type === 'machine_gun' || type === 'shotgun') { 
            this.currentWeapon = type; this.ammo = WeaponSystem.stats[type].clip; 
            document.getElementById('weapon-display').innerText = `🔫 ${WeaponSystem.stats[type].name}`; 
            document.getElementById('ammo-display').innerText = `🔋 Đạn: ${this.ammo}/${this.ammo}`;
        } 
        else if (type === 'medkit') { this.hp = Math.min(this.hp + 40, this.maxHp); } 
        else if (type === 'grenade') { this.grenadeCount++; document.getElementById('grenade-display').innerText = `💣 Bom: ${this.grenadeCount}`; }
        else if (type === 'key') { this.hasKey = true; document.getElementById('key-display').style.display = 'block'; }
        document.getElementById('hp-display').innerText = "❤️ HP: " + this.hp;
        AudioSys.play('reload', 0.2); // Tiếng nhặt đồ
    }
    
    draw(ctx) {
        let angle = Physics.getAngle(this.x, this.y, Game.worldMouse.x, Game.worldMouse.y);
        ctx.save(); ctx.translate(this.x, this.y); 
        
        // Vẽ thanh thời gian nạp đạn trên đầu nhân vật
        if (this.isReloading) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(-15, -35, 30, 6);
            ctx.fillStyle = '#f1c40f'; ctx.fillRect(-15, -35, 30 * (1 - this.reloadTimer/90), 6);
        }

        ctx.rotate(angle);
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
