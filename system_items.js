window.Assets = {
    player: new Image(), armor: new Image(), crate: new Image()
};
Assets.player.src = "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/PNG/Hitman%201/hitman1_gun.png";
Assets.armor.src = "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/PNG/SWAT/swat_outline.png"; 
Assets.crate.src = "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/PNG/Tiles/tile_130.png";

Game.crates = [];

class LootCrate {
    constructor(x, y) {
        this.x = x; this.y = y; this.radius = 20;
        // 50% ra Giáp, 50% ra Súng Liên Thanh
        this.type = Math.random() > 0.5 ? 'armor' : 'machine_gun';
    }
    draw(ctx) {
        if (Assets.crate.complete) ctx.drawImage(Assets.crate, this.x - 20, this.y - 20, 40, 40);
        else { ctx.fillStyle = '#f1c40f'; ctx.fillRect(this.x - 15, this.y - 15, 30, 30); }
        
        // Vẽ chữ nhấp nháy trên thùng đồ để biết thùng chứa gì
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.fillText(this.type === 'armor' ? "GIÁP" : "SÚNG", this.x - 12, this.y - 25);
    }
}
