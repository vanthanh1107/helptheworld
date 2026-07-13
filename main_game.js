// Khai báo bản đồ: Tường/Nhà
Game.walls = [
    {x: 100, y: 100, w: 200, h: 150}, // Ngôi nhà 1
    {x: 500, y: 300, w: 200, h: 200}, // Ngôi nhà 2
    {x: 200, y: 450, w: 150, h: 100}  // Lô cốt nhỏ
];

window.initZombieGame = function() {
    Game.canvas = document.getElementById('battleCanvas');
    Game.ctx = Game.canvas.getContext('2d');
    
    window.addEventListener('keydown', e => {
        if (e.key === 'w' || e.key === 'W') Game.keys.w = true;
        if (e.key === 'a' || e.key === 'A') Game.keys.a = true;
        if (e.key === 's' || e.key === 'S') Game.keys.s = true;
        if (e.key === 'd' || e.key === 'D') Game.keys.d = true;
    });
    window.addEventListener('keyup', e => {
        if (e.key === 'w' || e.key === 'W') Game.keys.w = false;
        if (e.key === 'a' || e.key === 'A') Game.keys.a = false;
        if (e.key === 's' || e.key === 'S') Game.keys.s = false;
        if (e.key === 'd' || e.key === 'D') Game.keys.d = false;
    });

    Game.canvas.addEventListener('mousemove', e => {
        let rect = Game.canvas.getBoundingClientRect();
        Game.mouse.x = e.clientX - rect.left;
        Game.mouse.y = e.clientY - rect.top;
    });
    Game.canvas.addEventListener('mousedown', () => { Game.mouse.isDown = true; Game.mouse.justClicked = true; });
    Game.canvas.addEventListener('mouseup', () => Game.mouse.isDown = false);

    NetworkManager.initLocalPlayer();
    
    // Đặt Thùng đồ cố định VÀO BÊN TRONG CÁC NGÔI NHÀ
    Game.crates.push(new LootCrate(200, 175)); // Trong nhà 1
    Game.crates.push(new LootCrate(600, 400)); // Trong nhà 2
    Game.crates.push(new LootCrate(275, 500)); // Trong lô cốt
    
    // Rải 15 con Zombie ngủ đông rải rác ngoài bản đồ
    for(let i = 0; i < 15; i++) {
        Game.zombies.push(new ZombieWalker(Math.random() * Game.width, Math.random() * Game.height));
    }

    gameLoop();
};

function gameLoop() {
    if (Game.isGameOver) {
        Game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; Game.ctx.fillRect(0, 0, Game.width, Game.height);
        Game.ctx.fillStyle = 'red'; Game.ctx.font = '40px Arial'; Game.ctx.fillText("BẠN ĐÃ CHẾT!", Game.width/2 - 120, Game.height/2);
        return; 
    }

    Game.ctx.clearRect(0, 0, Game.width, Game.height);
    
    // VẼ CÁC NGÔI NHÀ (Tường màu xám đậm)
    Game.ctx.fillStyle = '#444';
    Game.walls.forEach(w => {
        Game.ctx.fillRect(w.x, w.y, w.w, w.h);
        Game.ctx.strokeStyle = '#222'; Game.ctx.lineWidth = 4;
        Game.ctx.strokeRect(w.x, w.y, w.w, w.h);
    });

    if (Game.mouse.isDown && Game.localPlayer) { WeaponSystem.shoot(Game.localPlayer); }

    // 1. Cập nhật Thùng đồ
    for (let i = Game.crates.length - 1; i >= 0; i--) {
        let c = Game.crates[i];
        c.draw(Game.ctx);
        if (Physics.checkCircleCollision(c, Game.localPlayer)) {
            Game.localPlayer.equipLoot(c.type);
            Game.crates.splice(i, 1); 
        }
    }

    // 2. Cập nhật Đạn & Kiểm tra đạn đập vào tường
    for (let i = Game.bullets.length - 1; i >= 0; i--) {
        let b = Game.bullets[i];
        b.update();
        b.draw(Game.ctx);
        
        // Xóa đạn nếu bay ra khỏi màn hình
        if (b.x < 0 || b.x > Game.width || b.y < 0 || b.y > Game.height) b.isDestroyed = true;
        
        // Xóa đạn nếu bắn trúng Tường
        Game.walls.forEach(w => { if (Physics.checkCircleRectCollision(b, w)) b.isDestroyed = true; });
        if (b.isDestroyed) Game.bullets.splice(i, 1);
    }

    // 3. Cập nhật Player & Không cho đi xuyên tường
    Game.players.forEach(p => {
        p.update();
        Game.walls.forEach(w => Physics.resolveCircleRectCollision(p, w)); // Trượt theo tường
        p.draw(Game.ctx);
    });

    // 4. Cập nhật Zombie
    for (let i = Game.zombies.length - 1; i >= 0; i--) {
        let z = Game.zombies[i];
        z.update();
        Game.walls.forEach(w => Physics.resolveCircleRectCollision(z, w)); // Zombie cũng không đi xuyên tường
        z.draw(Game.ctx);

        if (Physics.checkCircleCollision(z, Game.localPlayer)) {
            Game.localPlayer.hp -= 1;
            document.getElementById('hp-display').innerText = "❤️ HP: " + Game.localPlayer.hp;
            if (Game.localPlayer.hp <= 100 && Game.localPlayer.hasArmor) {
                Game.localPlayer.hasArmor = false;
                document.getElementById('armor-display').style.display = 'none';
            }
            if (Game.localPlayer.hp <= 0) Game.isGameOver = true;
        }

        for (let j = Game.bullets.length - 1; j >= 0; j--) {
            let b = Game.bullets[j];
            if (Physics.checkCircleCollision(z, b)) {
                z.hp -= 1;
                b.isDestroyed = true; 
                z.isAwake = true; // Bị bắn là tỉnh dậy ngay
                if (z.hp <= 0) {
                    Game.score += 10;
                    document.getElementById('score-display').innerText = "ĐIỂM: " + Game.score;
                    Game.zombies.splice(i, 1); 
                    break; 
                }
            }
        }
    }
    requestAnimationFrame(gameLoop);
}
