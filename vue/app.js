window.onload = function(){

};

let app = new Vue({
    el: "#game",
    data: {
        player1: [
            {"name": "laugh", "url":"https://media1.tenor.com/images/a50e887ed9c13b6eb5fca8bf3b8c95d4/tenor.gif?itemid=9271317"},
            {"name": "cry", "url":"https://media.tenor.com/images/b958d257f5b1cca2838bb6011e7018c3/tenor.gif"},
            {"name": "thank-you", "url":"https://media1.tenor.com/images/1114067881329bb4218880eeb7ec34fd/tenor.gif?itemid=12985913"},
            {"name": "really", "url":"https://media.tenor.com/images/e3544b8117d3ecbb0cb8751f1ce0ff71/tenor.gif"},
            {"name": "wow", "url":"https://media.tenor.com/images/86eb7c00905ba5fa58b0e0bc7c7c7486/tenor.gif"}
        ],
        player2: [
            {"name": "laugh", "url":"https://media1.tenor.com/images/a50e887ed9c13b6eb5fca8bf3b8c95d4/tenor.gif?itemid=9271317"},
            {"name": "cry", "url":"https://media.tenor.com/images/b958d257f5b1cca2838bb6011e7018c3/tenor.gif"},
            {"name": "thank-you", "url":"https://media1.tenor.com/images/1114067881329bb4218880eeb7ec34fd/tenor.gif?itemid=12985913"},
            {"name": "really", "url":"https://media.tenor.com/images/e3544b8117d3ecbb0cb8751f1ce0ff71/tenor.gif"},
            {"name": "wow", "url":"https://media.tenor.com/images/86eb7c00905ba5fa58b0e0bc7c7c7486/tenor.gif"}
        ],
        judge: [],
        story:[]
    },
    mounted:function(){
         this.loadGifs();
    },
    updated:function(){
        if(app.story.length >= 4)
        {
            alert("Game Over!");
            // Reset the gif arrays
            app.player1 = '';
            app.player2 = '';
        }

    },
    methods:{
        loadGifs:function(){
            // TODO: Load required gifs from APIs
            console.log("hey");
        },
        playCard:function(cardName,cardURL,index,thisPlayer){
            var playedCard = {"name": cardName, "url":cardURL};
            app.story.push(playedCard);
            
            if(thisPlayer == "player1")
            {
                // Remove played card from their list
                app.player1.splice(index,1);

                // TODO: Disable player input until the next player has played their turn
            }
            else
            {
                // Remove played card from their list
                app.player2.splice(index,1);

                // TODO: Disable player input until the next player has played their turn
            }
            
        }
    }
});


// Socket.io

