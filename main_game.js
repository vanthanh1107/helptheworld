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

    Game.canvas.addEventListener('mousedown', () => Game.mouse.isDown = true);
    Game.canvas.addEventListener('mouseup', () => Game.mouse.isDown = false);

    NetworkManager.initLocalPlayer();
    
    // Khởi đầu cho sẵn 1 thùng đồ trên bản đồ
    ItemSystem.spawnCrate();

    gameLoop();
};

function gameLoop() {
    if (Game.isGameOver) {
        Game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        Game.ctx.fillRect(0, 0, Game.width, Game.height);
        Game.ctx.fillStyle = 'red';
        Game.ctx.font = '40px Arial';
        Game.ctx.fillText("BẠN ĐÃ CHẾT!", Game.width/2 - 120, Game.height/2);
        return; 
    }

    Game.ctx.clearRect(0, 0, Game.width, Game.height);

    if (Game.mouse.isDown && Game.localPlayer) {
        WeaponSystem.shootPistol(Game.localPlayer);
    }

    Game.frameCount++;
    if (Game.frameCount % 60 === 0) { 
        ZombieSystem.spawnZombie();
    }
    
    // Cứ 15 giây (900 frame) rơi 1 thùng đồ
    if (Game.frameCount % 900 === 0) { 
        ItemSystem.spawnCrate();
    }

    // 1. Cập nhật Thùng đồ & Kiểm tra nhặt
    for (let i = Game.crates.length - 1; i >= 0; i--) {
        let c = Game.crates[i];
        c.draw(Game.ctx);
        
        // Nếu người chơi chạm vào thùng
        if (Physics.checkCircleCollision(c, Game.localPlayer)) {
            Game.localPlayer.equipArmor(); // Mặc giáp
            Game.crates.splice(i, 1); // Xóa thùng đồ
        }
    }

    // 2. Cập nhật Đạn
    for (let i = Game.bullets.length - 1; i >= 0; i--) {
        let b = Game.bullets[i];
        b.update();
        b.draw(Game.ctx);
        if (b.isDestroyed) {
            Game.bullets.splice(i, 1);
        }
    }

    // 3. Cập nhật Player
    Game.players.forEach(p => {
        p.update();
        p.draw(Game.ctx);
    });

    // 4. Cập nhật Zombie
    for (let i = Game.zombies.length - 1; i >= 0; i--) {
        let z = Game.zombies[i];
        z.update();
        z.draw(Game.ctx);

        if (Physics.checkCircleCollision(z, Game.localPlayer)) {
            Game.localPlayer.hp -= 1;
            document.getElementById('hp-display').innerText = "❤️ HP: " + Game.localPlayer.hp;
            
            // Xóa icon giáp nếu mất hết máu cộng thêm
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
