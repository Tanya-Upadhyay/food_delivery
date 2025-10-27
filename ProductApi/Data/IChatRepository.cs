using ProductApi.Models;

namespace ProductApi.Data
{
    public interface IChatRepository
    {
        Task SaveMessageAsync(ChatMessage message);
        Task<List<ChatMessage>> GetAllMessagesAsync(string UID1, string UID2);

        Task<List<User>> GetUsersWhoMessagedAdmin( string adminId);

        Task<Dictionary<string, int>> GetUnreadMessageCountsAsync(string adminId);

        Task MarkMessagesAsReadAsync(string senderId, string receiverId);


    }
}
