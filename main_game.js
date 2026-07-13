Game.trees = []; 

window.initZombieGame = function() {
    Game.canvas = document.getElementById('battleCanvas'); Game.ctx = Game.canvas.getContext('2d');
    
    window.addEventListener('keydown', e => { 
        if(e.key==='w'||e.key==='W') Game.keys.w=true; if(e.key==='a'||e.key==='A') Game.keys.a=true; 
        if(e.key==='s'||e.key==='S') Game.keys.s=true; if(e.key==='d'||e.key==='D') Game.keys.d=true; 
        if(e.code==='Space') Game.keys.space=true; // THÊM NÚT SPACE
    });
    window.addEventListener('keyup', e => { 
        if(e.key==='w'||e.key==='W') Game.keys.w=false; if(e.key==='a'||e.key==='A') Game.keys.a=false; 
        if(e.key==='s'||e.key==='S') Game.keys.s=false; if(e.key==='d'||e.key==='D') Game.keys.d=false; 
        if(e.code==='Space') Game.keys.space=false; 
    });
    Game.canvas.addEventListener('mousemove', e => { let r = Game.canvas.getBoundingClientRect(); Game.mouse.x = e.clientX-r.left; Game.mouse.y = e.clientY-r.top; });
    Game.canvas.addEventListener('mousedown', () => { Game.mouse.isDown = true; Game.mouse.justClicked = true; }); Game.canvas.addEventListener('mouseup', () => Game.mouse.isDown = false);

    NetworkManager.initLocalPlayer(); Game.localPlayer.x = 100; Game.localPlayer.y = 300;

    for(let i=0; i<30; i++) Game.trees.push({x: 300 + Math.random()*500, y: Math.random()*Game.mapHeight, radius: 25});

    Game.walls = [
        {x: 1000, y: 100, w: 250, h: 400}, {x: 1800, y: 0, w: 400, h: 200}, {x: 1800, y: 400, w: 400, h: 200},
        {x: 2600, y: 0, w: 30, h: 600, isGate: true} 
    ];

    Game.items.push(new GroundItem(1125, 300, 'armor')); 
    Game.items.push(new GroundItem(700, 100, 'machine_gun')); 
    Game.items.push(new GroundItem(1500, 300, 'shotgun')); 
    Game.items.push(new GroundItem(2000, 300, 'key')); 

    for(let i = 0; i < 40; i++) {
        let zx = 600 + Math.random() * 1900; let zy = Math.random() * Game.mapHeight;
        let type = 'normal'; let rand = Math.random();
        if (rand < 0.2) type = 'runner'; else if (rand > 0.9) type = 'tanker';
        Game.zombies.push(new Zombie(zx, zy, type));
    }

    gameLoop();
};

function gameLoop() {
    if (Game.isGameOver) { Game.ctx.fillStyle = 'rgba(0,0,0,0.7)'; Game.ctx.fillRect(0,0,Game.width,Game.height); Game.ctx.fillStyle = 'red'; Game.ctx.font = '40px Arial'; Game.ctx.fillText("BẠN ĐÃ CHẾT!", Game.width/2-120, Game.height/2); return; }
    if (Game.isGameWon) { Game.ctx.fillStyle = 'rgba(255,255,255,0.8)'; Game.ctx.fillRect(0,0,Game.width,Game.height); Game.ctx.fillStyle = '#27ae60'; Game.ctx.font = '40px Arial'; Game.ctx.fillText("VỀ ĐÍCH THÀNH CÔNG!", Game.width/2-200, Game.height/2); return; }

    Game.camera.x = Math.max(0, Math.min(Game.localPlayer.x - Game.width/2, Game.mapWidth - Game.width));
    Game.camera.y = Math.max(0, Math.min(Game.localPlayer.y - Game.height/2, Game.mapHeight - Game.height));
    Game.worldMouse.x = Game.mouse.x + Game.camera.x; Game.worldMouse.y = Game.mouse.y + Game.camera.y;

    // --- BƯỚC 1: VẼ THẾ GIỚI BÌNH THƯỜNG ---
    Game.ctx.fillStyle = '#1e272e'; Game.ctx.fillRect(0, 0, Game.width, Game.height);
    Game.ctx.save(); 
    FX.applyShake(Game.ctx); 
    Game.ctx.translate(-Game.camera.x, -Game.camera.y);

    Game.ctx.fillStyle = 'rgba(46, 204, 113, 0.3)'; Game.ctx.fillRect(2800, 0, 200, Game.mapHeight);

    Game.ctx.fillStyle = 'rgba(192, 57, 43, 0.5)';
    Game.bloodStains.forEach(s => { Game.ctx.beginPath(); Game.ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2); Game.ctx.fill(); });
    
    Game.trees.forEach(t => {
        Game.ctx.fillStyle = '#27ae60'; Game.ctx.beginPath(); Game.ctx.arc(t.x, t.y, t.radius, 0, Math.PI*2); Game.ctx.fill();
        Game.ctx.fillStyle = '#2ecc71'; Game.ctx.beginPath(); Game.ctx.arc(t.x-5, t.y-5, t.radius-5, 0, Math.PI*2); Game.ctx.fill();
    });

    for (let i = Game.walls.length - 1; i >= 0; i--) {
        let w = Game.walls[i];
        if (w.isGate && Game.localPlayer.hasKey && Physics.getDistance(Game.localPlayer.x, Game.localPlayer.y, w.x, Game.localPlayer.y) < 100) { Game.walls.splice(i, 1); FX.triggerShake(10); continue; }
        Game.ctx.fillStyle = w.isGate ? '#f39c12' : '#2c3e50'; Game.ctx.fillRect(w.x, w.y, w.w, w.h);
        Game.ctx.strokeStyle = '#000'; Game.ctx.lineWidth = w.isGate ? 8 : 2; Game.ctx.strokeRect(w.x, w.y, w.w, w.h);
    }

    if (Game.mouse.isDown && Game.localPlayer) { WeaponSystem.shoot(Game.localPlayer); }

    for (let i = Game.items.length - 1; i >= 0; i--) {
        let item = Game.items[i]; item.draw(Game.ctx);
        if (Physics.checkCircleCollision({x: item.x, y: item.y, radius: item.radius}, Game.localPlayer)) {
            if(item.type === 'shotgun' || item.type === 'machine_gun') {
                Game.localPlayer.currentWeapon = item.type; document.getElementById('weapon-display').innerText = "🔫 Súng: " + WeaponSystem.stats[item.type].name;
            } else { Game.localPlayer.equipLoot(item.type); }
            Game.items.splice(i, 1); 
        }
    }

    for (let i = Game.particles.length - 1; i >= 0; i--) { let p = Game.particles[i]; p.update(); p.draw(Game.ctx); if (p.life <= 0) Game.particles.splice(i, 1); }

    for (let i = Game.bullets.length - 1; i >= 0; i--) {
        let b = Game.bullets[i]; b.update(); b.draw(Game.ctx);
        if (b.x < 0 || b.x > Game.mapWidth || b.y < 0 || b.y > Game.mapHeight) b.isDestroyed = true;
        Game.walls.forEach(w => { if (Physics.checkCircleRectCollision(b, w)) b.isDestroyed = true; });
        if (b.isDestroyed) Game.bullets.splice(i, 1);
    }
    
    Game.players.forEach(p => {
        p.update(); Game.walls.forEach(w => Physics.resolveCircleRectCollision(p, w)); 
        Game.trees.forEach(t => Physics.resolveCircleRectCollision(p, {x: t.x-t.radius, y: t.y-t.radius, w: t.radius*2, h: t.radius*2})); 
        p.draw(Game.ctx); if (p.x > 2800) Game.isGameWon = true; 
    });

    for (let i = Game.zombies.length - 1; i >= 0; i--) {
        let z = Game.zombies[i]; z.update(); Game.walls.forEach(w => Physics.resolveCircleRectCollision(z, w)); z.draw(Game.ctx);
        if (Physics.checkCircleCollision(z, Game.localPlayer)) {
            Game.localPlayer.hp -= 1; document.getElementById('hp-display').innerText = "❤️ HP: " + Game.localPlayer.hp;
            FX.triggerShake(5); FX.bloodSplatter(Game.localPlayer.x, Game.localPlayer.y); 
            if (Game.localPlayer.hp <= 100 && Game.localPlayer.hasArmor) { Game.localPlayer.hasArmor = false; document.getElementById('armor-display').style.display = 'none'; }
            if (Game.localPlayer.hp <= 0) Game.isGameOver = true;
        }

        for (let j = Game.bullets.length - 1; j >= 0; j--) {
            let b = Game.bullets[j];
            if (Physics.checkCircleCollision(z, b)) {
                let damage = (Game.localPlayer.currentWeapon === 'shotgun') ? 2 : 1; // Shotgun bắn ra nhiều viên, mỗi viên 2 sát thương
                z.hp -= damage; b.isDestroyed = true; z.isAwake = true; 
                FX.bloodSplatter(b.x, b.y); 
                FX.showDamage(z.x, z.y, damage, damage > 1); // Hiện số sát thương
                
                if (z.hp <= 0) {
                    Game.score += z.score; document.getElementById('score-display').innerText = "ĐIỂM: " + Game.score;
                    ItemSystem.dropFromZombie(z.x, z.y); Game.zombies.splice(i, 1); break; 
                }
            }
        }
    }

    // --- BƯỚC 2: HỆ THỐNG ÁNH SÁNG ĐỘNG (FLASHLIGHT ENGINE) ---
    // Phủ đen toàn màn hình
    Game.ctx.fillStyle = 'rgba(5, 5, 10, 0.92)'; // Màu đen xanh sẫm 92%
    Game.ctx.fillRect(Game.camera.x, Game.camera.y, Game.width, Game.height);

    // Cắt thủng lớp đen để tạo vùng sáng
    Game.ctx.globalCompositeOperation = 'destination-out';

    // 1. Ánh sáng dịu tỏa ra quanh nhân vật (bán kính 120px)
    let ambientLight = Game.ctx.createRadialGradient(Game.localPlayer.x, Game.localPlayer.y, 0, Game.localPlayer.x, Game.localPlayer.y, 120);
    ambientLight.addColorStop(0, 'rgba(255, 255, 255, 1)');
    ambientLight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    Game.ctx.fillStyle = ambientLight;
    Game.ctx.beginPath(); Game.ctx.arc(Game.localPlayer.x, Game.localPlayer.y, 120, 0, Math.PI*2); Game.ctx.fill();

    // 2. Tia đèn pin chiếu theo hướng chuột (Dài 450px)
    let aimAngle = Physics.getAngle(Game.localPlayer.x, Game.localPlayer.y, Game.worldMouse.x, Game.worldMouse.y);
    let beamLength = 450;
    let beamWidth = Math.PI / 3.5; // Độ mở của đèn pin

    Game.ctx.beginPath();
    Game.ctx.moveTo(Game.localPlayer.x, Game.localPlayer.y);
    Game.ctx.arc(Game.localPlayer.x, Game.localPlayer.y, beamLength, aimAngle - beamWidth/2, aimAngle + beamWidth/2);
    Game.ctx.lineTo(Game.localPlayer.x, Game.localPlayer.y);
    
    let beamLight = Game.ctx.createRadialGradient(Game.localPlayer.x, Game.localPlayer.y, 0, Game.localPlayer.x, Game.localPlayer.y, beamLength);
    beamLight.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    beamLight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    Game.ctx.fillStyle = beamLight;
    Game.ctx.fill();

    // Reset lại chế độ vẽ bình thường
    Game.ctx.globalCompositeOperation = 'source-over';

    // --- BƯỚC 3: VẼ CHỮ SÁT THƯƠNG (Nổi lên trên bóng tối) ---
    for (let i = Game.floatingTexts.length - 1; i >= 0; i--) {
        let ft = Game.floatingTexts[i];
        ft.update(); ft.draw(Game.ctx);
        if (ft.life <= 0) Game.floatingTexts.splice(i, 1);
    }

    Game.ctx.restore(); requestAnimationFrame(gameLoop);
}
