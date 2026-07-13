class Player {
    constructor(x, y) {
        this.x = x; this.y = y; this.radius = 15;
        this.speed = 3.5; this.maxHp = 100; this.hp = 100;
        this.hasArmor = false; this.currentWeapon = 'pistol';
        this.hasKey = false; // Túi đồ chứa chìa khóa
    }
    update() {
        if (Game.keys.w && this.y > this.radius) this.y -= this.speed;
        if (Game.keys.s && this.y < Game.mapHeight - this.radius) this.y += this.speed;
        if (Game.keys.a && this.x > this.radius) this.x -= this.speed;
        if (Game.keys.d && this.x < Game.mapWidth - this.radius) this.x += this.speed;
    }
    equipLoot(type) {
        if (type === 'armor' && !this.hasArmor) {
            this.hasArmor = true; this.maxHp += 50; this.hp = this.maxHp;
            document.getElementById('armor-display').style.display = 'block';
        } else if (type === 'machine_gun') {
            this.currentWeapon = 'machine_gun';
            document.getElementById('weapon-display').innerText = "🔫 Súng: Liên Thanh";
        } else if (type === 'medkit') {
            this.hp = Math.min(this.hp + 40, this.maxHp); // Hồi 40 máu, không vượt quá máu tối đa
        } else if (type === 'key') {
            this.hasKey = true;
            document.getElementById('key-display').style.display = 'block';
        }
        document.getElementById('hp-display').innerText = "❤️ HP: " + this.hp;
    }
    draw(ctx) {
        let angle = Physics.getAngle(this.x, this.y, Game.worldMouse.x, Game.worldMouse.y);
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(angle);
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
