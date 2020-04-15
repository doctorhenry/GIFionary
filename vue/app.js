window.onload = function(){

};

let game = new Vue({
    el: "#game",
    data: {
        player1: [],
        player2: [],
        judge: []
    },
    created:function(){
        game.loadGifs();
    },
    methods:{
        loadGifs:function(){
            // TODO: Load required gifs from APIs
            console.log("hey");
        }
    }
});


// Socket.io

