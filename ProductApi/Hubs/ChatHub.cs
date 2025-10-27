using Azure.Identity;
using Microsoft.Identity.Client;
using ProductApi.Data;
using ProductApi.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ProductApi.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ProductDbContext _context;
        private readonly IChatRepository _chatRepository;

        private static Dictionary<string, string> userConnections = new Dictionary<string, string>();

        public ChatHub(ProductDbContext context, IChatRepository chatRepository)
        {
            _context = context;
            _chatRepository = chatRepository;
        }

        public async Task SendMessage(string senderId, string recieverID, string message)
        {
            Console.WriteLine($"[SendMessage] Sender: {senderId}, Receiver: {recieverID}, Message: {message}");

            var chatMessage = new ChatMessage
            {
                SenderId = senderId,
                ReceiverId = recieverID,
                Message = message,
                SentAt = DateTime.UtcNow,
                IsRead = false,
            };

            await _chatRepository.SaveMessageAsync(chatMessage);

            
            if (userConnections.TryGetValue(recieverID, out var receiverConnectionId))
            {
                await Clients.Client(receiverConnectionId).SendAsync("ReceiveMessage", senderId, message, chatMessage.SentAt);
            }

            
            if (userConnections.TryGetValue(senderId, out var senderConnectionId))
            {
                await Clients.Client(senderConnectionId).SendAsync("ReceiveMessage", senderId, message, chatMessage.SentAt);
            }
        }

        public async Task Join(string userId)
        {
            Console.WriteLine($"User joined: {userId}, ConnectionId: {Context.ConnectionId}");

           
            userConnections[userId] = Context.ConnectionId;

            await Task.CompletedTask;
        }

        public async Task<List<ChatMessage>>
          
        GetChatHistory(string UserID, string adminId)
        {

            string userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var adminUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Roles == "admin");
            

            if (adminUser == null || userId == null)
                return new List<ChatMessage>();

            return await _chatRepository.GetAllMessagesAsync(userId.ToString(), adminUser.UID.ToString());
            
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }


    }
}
