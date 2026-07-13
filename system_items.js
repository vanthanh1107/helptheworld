window.Assets = { player: new Image(), armor: new Image(), crate: new Image() };
Assets.player.src = "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/PNG/Hitman%201/hitman1_gun.png";
Assets.armor.src = "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/PNG/SWAT/swat_outline.png"; 

Game.items = []; // Mảng chứa đồ rơi trên đất

class GroundItem {
    constructor(x, y, type) {
        this.x = x; this.y = y; this.radius = 15;
        this.type = type; // 'armor', 'machine_gun', 'medkit', 'key'
    }
    draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y);
        
        if (this.type === 'armor') {
            ctx.fillStyle = '#3498db'; ctx.fillRect(-12, -12, 24, 24);
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText("GIÁP", -12, 4);
        } else if (this.type === 'machine_gun') {
            ctx.fillStyle = '#e67e22'; ctx.fillRect(-12, -12, 24, 24);
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText("SÚNG", -12, 4);
        } else if (this.type === 'medkit') {
            ctx.fillStyle = '#fff'; ctx.fillRect(-12, -12, 24, 24);
            ctx.fillStyle = '#2ecc71'; ctx.fillRect(-8, -2, 16, 4); ctx.fillRect(-2, -8, 4, 16); // Chữ thập xanh
        } else if (this.type === 'key') {
            ctx.fillStyle = '#f1c40f'; ctx.beginPath(); ctx.arc(0, -5, 8, 0, Math.PI*2); ctx.fill();
            ctx.fillRect(-2, 0, 4, 12); ctx.fillRect(2, 6, 6, 4); // Hình chìa khóa vàng
        }
        ctx.restore();
    }
}

window.ItemSystem = {
    // Zombie chết có 30% tỷ lệ rớt hộp cứu thương
    dropFromZombie: function(x, y) {
        if (Math.random() < 0.3) {
            Game.items.push(new GroundItem(x, y, 'medkit'));
        }
    }
};
