window.AudioSys = {
    sounds: {
        shoot_pistol: "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/Audio/shoot.ogg",
        shoot_machine: "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/Audio/shoot_machine.ogg",
        shoot_shotgun: "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/Audio/shoot_shotgun.ogg",
        reload: "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/Audio/reload.ogg",
        empty: "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/Audio/empty.ogg", 
        explosion: "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/Audio/explosion.ogg",
        hit: "https://raw.githubusercontent.com/kenneynl/Shooter-Down/master/Audio/hit.ogg"
    },
    play: function(name, volume = 0.5) {
        if (!this.sounds[name]) return;
        let audio = new Audio(this.sounds[name]); audio.volume = volume; audio.play().catch(e => {}); 
    }
};
