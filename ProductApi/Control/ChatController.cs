using Microsoft.AspNetCore.Mvc;
using ProductApi.Data;

namespace ProductApi.Control
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatRepository _chatRepository;

        public ChatController(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetChatHistory([FromQuery] string UID1, [FromQuery] string UID2)
        {
            
            if (string.IsNullOrEmpty(UID1) || string.IsNullOrEmpty(UID2))
                return BadRequest("Both UID1 and UID2 are required.");

            if (UID1 == UID2)
                return BadRequest("Sender and receiver cannot be the same.");

            var messages = await _chatRepository.GetAllMessagesAsync(UID1, UID2);
            return Ok(messages);
        }

        [HttpGet("users-who-messaged-admin")]
        public async Task<IActionResult> GetUsersWhoMessagedAdmin()
        {
            
            string adminId = "31";

            var users = await _chatRepository.GetUsersWhoMessagedAdmin(adminId);
            return Ok(users);
        }

        [HttpGet("unread-counts")]
        public async Task<IActionResult> GetUnreadCounts([FromQuery] string receiverId)
        {
            var counts = await _chatRepository.GetUnreadMessageCountsAsync(receiverId);
            return Ok(counts);
        }

        [HttpPost("mark-as-read")]
        public async Task<IActionResult> MarkAsRead([FromQuery] string senderId, [FromQuery] string receiverId)
        {
            if (string.IsNullOrEmpty(senderId) || string.IsNullOrEmpty(receiverId))
                return BadRequest("Sender and receiver IDs are required.");

            await _chatRepository.MarkMessagesAsReadAsync(senderId, receiverId);
            return Ok();
        }




    }
}
