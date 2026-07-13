window.Assets = { player: new Image(), armor: new Image(), crate: new Image() };
Assets.player.src = "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/PNG/Hitman%201/hitman1_gun.png";
Assets.armor.src = "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/PNG/SWAT/swat_outline.png"; 
Game.items = []; 

class GroundItem {
    constructor(x, y, type) { this.x = x; this.y = y; this.radius = 15; this.type = type; }
    draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y);
        if (this.type === 'armor') { ctx.fillStyle = '#3498db'; ctx.fillRect(-12, -12, 24, 24); ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText("GIÁP", -12, 4); }
        else if (this.type === 'machine_gun') { ctx.fillStyle = '#e67e22'; ctx.fillRect(-12, -12, 24, 24); ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText("SÚNG", -12, 4); }
        else if (this.type === 'shotgun') { ctx.fillStyle = '#c0392b'; ctx.fillRect(-12, -12, 24, 24); ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText("SHOT", -12, 4); }
        else if (this.type === 'medkit') { ctx.fillStyle = '#fff'; ctx.fillRect(-12, -12, 24, 24); ctx.fillStyle = '#2ecc71'; ctx.fillRect(-8, -2, 16, 4); ctx.fillRect(-2, -8, 4, 16); }
        else if (this.type === 'grenade') { ctx.fillStyle = '#2c3e50'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#e74c3c'; ctx.fillRect(-2,-12,4,6); } // Vẽ lựu đạn
        else if (this.type === 'key') { ctx.fillStyle = '#f1c40f'; ctx.beginPath(); ctx.arc(0, -5, 8, 0, Math.PI*2); ctx.fill(); ctx.fillRect(-2, 0, 4, 12); ctx.fillRect(2, 6, 6, 4); }
        ctx.restore();
    }
}

window.ItemSystem = {
    dropFromZombie: function(x, y) {
        let rand = Math.random();
        if (rand < 0.2) Game.items.push(new GroundItem(x, y, 'medkit')); // 20% ra máu
        else if (rand < 0.3) Game.items.push(new GroundItem(x, y, 'grenade')); // 10% ra lựu đạn
    }
};
