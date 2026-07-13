// Khởi tạo nơi lưu trữ hình ảnh
window.Assets = {
    player: new Image(),
    armor: new Image(),
    crate: new Image()
};

// !!! QUAN TRỌNG: Bạn hãy vẽ hoặc tải các hình ảnh PNG (xóa phông nền) 
// rồi up lên Github của bạn, sau đó thay link raw vào đây nhé!
// Tạm thời mình để link ảnh mẫu có sẵn trên mạng để bạn test:
Assets.player.src = "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/PNG/Hitman%201/hitman1_gun.png";
Assets.armor.src = "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/PNG/SWAT/swat_outline.png"; 
Assets.crate.src = "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/PNG/Tiles/tile_130.png";

// Khai báo mảng chứa thùng đồ
Game.crates = [];

// Class Thùng Đồ (Loot Box)
class LootCrate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20; // Bán kính va chạm
        this.isLooted = false;
    }

    draw(ctx) {
        if (Assets.crate.complete) {
            // Vẽ ảnh thùng đồ
            ctx.drawImage(Assets.crate, this.x - 20, this.y - 20, 40, 40);
        } else {
            // Backup nếu ảnh chưa tải kịp
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(this.x - 15, this.y - 15, 30, 30);
        }
    }
}

window.ItemSystem = {
    spawnCrate: function() {
        // Sinh ra hòm đồ ngẫu nhiên trong bản đồ (cách viền 50px)
        let x = 50 + Math.random() * (Game.width - 100);
        let y = 50 + Math.random() * (Game.height - 100);
        Game.crates.push(new LootCrate(x, y));
    }
};
