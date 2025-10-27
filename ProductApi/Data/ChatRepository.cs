using ProductApi.Models;
using Microsoft.EntityFrameworkCore;


namespace ProductApi.Data
{
    public class ChatRepository : IChatRepository
    {
        private readonly ProductDbContext _context;

        public ChatRepository(ProductDbContext context)
        {
            _context = context;
        }
        public async Task SaveMessageAsync(ChatMessage message)
        {
            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();
        }
        public async Task <List<ChatMessage>> GetAllMessagesAsync(string UID1, string UID2)
        {
            return await _context.ChatMessages
                .Where(m =>
                (m.SenderId == UID1 && m.ReceiverId == UID2) ||
                (m.SenderId == UID2 && m.ReceiverId == UID1))
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }

        public async Task<List<User>> GetUsersWhoMessagedAdmin(string adminId)
        {
            var senderIds = await _context.ChatMessages
                .Where(m => m.ReceiverId == adminId)
                .Select(m => m.SenderId)
                .Distinct()
                .ToListAsync();

            var users = await _context.Users
                .Where(u => senderIds.Contains(u.UID.ToString()))
                .ToListAsync();

            return users;
        }

        public async Task<Dictionary<string, int>> GetUnreadMessageCountsAsync(string receiverId)
        {
            return await _context.ChatMessages
                .Where(m => m.ReceiverId == receiverId && !m.IsRead)
                .GroupBy(m => m.SenderId)
                .Select(g => new { SenderId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.SenderId, g => g.Count);
        }

        public async Task MarkMessagesAsReadAsync(string senderId, string receiverId)
        {
            var messages = await _context.ChatMessages
                .Where(m => m.SenderId == senderId && m.ReceiverId == receiverId && !m.IsRead)
                .ToListAsync();

            foreach (var message in messages)
            {
                message.IsRead = true;
            }

            await _context.SaveChangesAsync();
        }



    }
}
