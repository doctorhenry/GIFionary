export default class SocketEvents {
    public static readonly Connection = "connection";
    public static readonly CreateGame = "createGame";
    public static readonly GetRooms = "getRooms";
    public static readonly ShowRooms = "showRooms";
    public static readonly JoinGame = "joinGame";
    public static readonly JoinResult = "joinResult";
    public static readonly CreateResult = "createResult";
    public static readonly UserReady = "userReady";
    public static readonly CanPlay = "canPlay";
    public static readonly NewBatchOfGifs = "newBatchOfGifs";
    public static readonly NewGif = "newGif";
    public static readonly NextHand = "nextHand";
    public static readonly LeaveRoom = "leaveRoom";
    public static readonly ObliterateRoom = "obliterateRoom"; 
    public static readonly PlayersHandSubmit = "playersHandSubmit";
    public static readonly DeciderHandSubmit = "deciderHandSubmit";
    public static readonly NavigateHome = "navigateHome";
    public static readonly RoundUpdate = "roundUpdate";
    public static readonly UsersUpdate = "usersUpdate";
    public static readonly GameWon = "gameWon";
    public static readonly AwardPoint = "awardPoint";
    public static readonly TotalPoints = "totalPoints";
}