class Player {
    constructor(x, y) {
        this.x = x; this.y = y; this.radius = 15;
        this.speed = 3.5; this.maxHp = 100; this.hp = 100;
        this.hasArmor = false; this.hasKey = false;
        this.currentWeapon = 'pistol'; this.ammo = WeaponSystem.stats['pistol'].clip;
        this.isReloading = false; this.reloadTimer = 0;
        this.grenadeCount = 3; this.lastGrenadeTime = 0;
        this.isDashing = false; this.dashTimer = 0; this.dashCooldown = 0;
    }
    update() {
        let currentSpeed = this.speed;
        if (this.dashCooldown > 0) this.dashCooldown--;
        if (Game.keys.space && this.dashCooldown <= 0) {
            this.isDashing = true; this.dashTimer = 10; this.dashCooldown = 60;
            for(let i=0; i<5; i++) Game.particles.push(new Particle(this.x, this.y, '#95a5a6'));
        }
        if (this.isDashing) {
            currentSpeed = this.speed * 4; this.dashTimer--;
            if (this.dashTimer <= 0) this.isDashing = false;
        }

        if (Game.keys.r && !this.isReloading && this.ammo < WeaponSystem.stats[this.currentWeapon].clip) {
            this.isReloading = true; this.reloadTimer = 90; AudioSys.play('reload');
        }
        if (this.isReloading) {
            this.reloadTimer--;
            if (this.reloadTimer <= 0) {
                this.isReloading = false; this.ammo = WeaponSystem.stats[this.currentWeapon].clip;
                if(window.UpdateHUD) window.UpdateHUD(this);
            }
        }

        let now = Date.now();
        if (Game.keys.g && this.grenadeCount > 0 && now - this.lastGrenadeTime > 1000) {
            Game.grenades.push(new Grenade(this.x, this.y, Game.worldMouse.x, Game.worldMouse.y));
            this.grenadeCount--;
            if(window.UpdateHUD) window.UpdateHUD(this);
            this.lastGrenadeTime = now;
        }

        if (Game.keys.w && this.y > this.radius) this.y -= currentSpeed;
        if (Game.keys.s && this.y < Game.mapHeight - this.radius) this.y += currentSpeed;
        if (Game.keys.a && this.x > this.radius) this.x -= currentSpeed;
        if (Game.keys.d && this.x < Game.mapWidth - this.radius) this.x += currentSpeed;
    }
    equipLoot(type) {
        if (type === 'armor' && !this.hasArmor) { this.hasArmor = true; this.maxHp += 50; this.hp = this.maxHp; } 
        else if (type === 'machine_gun' || type === 'shotgun') { this.currentWeapon = type; this.ammo = WeaponSystem.stats[type].clip; } 
        else if (type === 'medkit') { this.hp = Math.min(this.hp + 40, this.maxHp); } 
        else if (type === 'grenade') { this.grenadeCount++; }
        else if (type === 'key') { this.hasKey = true; }
        
        AudioSys.play('reload', 0.2); 
        if(window.UpdateHUD) window.UpdateHUD(this); // Cập nhật giao diện an toàn
    }
    draw(ctx) {
        let angle = Physics.getAngle(this.x, this.y, Game.worldMouse.x, Game.worldMouse.y);
        ctx.save(); ctx.translate(this.x, this.y); 
        if (this.isReloading) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(-15, -35, 30, 6);
            ctx.fillStyle = '#f1c40f'; ctx.fillRect(-15, -35, 30 * (1 - this.reloadTimer/90), 6);
        }
        ctx.rotate(angle);
        if (this.isDashing) ctx.globalAlpha = 0.5;
        
        // Vẽ nhân vật an toàn
        if (Assets.player.complete && Assets.player.naturalWidth > 0) {
            ctx.drawImage(Assets.player, -22.5, -22.5, 45, 45);
            if (this.hasArmor && Assets.armor.complete) ctx.drawImage(Assets.armor, -22.5, -22.5, 45, 45);
        } else {
            ctx.fillStyle = this.hasArmor ? '#3498db' : '#00a8ff';
            ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI*2); ctx.fill();
        }
        ctx.restore();
    }
}
