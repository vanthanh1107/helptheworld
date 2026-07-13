window.NetworkManager = {
    initLocalPlayer: function() {
        let localPlayer = new Player(Game.width / 2, Game.height / 2);
        Game.players.push(localPlayer);
        Game.localPlayer = localPlayer;
    }
};
