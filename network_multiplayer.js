window.NetworkManager = {
    initLocalPlayer: function() {
        // Tạo một người chơi đặt ở giữa bản đồ
        let localPlayer = new Player(Game.width / 2, Game.height / 2);
        Game.players.push(localPlayer);
        // Gán là nhân vật chính để camera hoặc phím điều khiển nhận diện
        Game.localPlayer = localPlayer;
    }
    
    // TODO sau này: sendPositionToServer(), receiveZombiesFromServer()...
};
