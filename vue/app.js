window.onload = function(){

};

let app = new Vue({
    el: "#game",
    data: {
        player1: [],
        player2: [],
        judge: []
    },
    mounted:function(){
         this.loadGifs();
    },
    methods:{
        loadGifs:function(){
            // TODO: Load required gifs from APIs
            console.log("hey");
        }
    }
});


// Socket.io

