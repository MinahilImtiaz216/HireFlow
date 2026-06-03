using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly MongoDbService _db;
    private readonly AuthService _auth;

    public AuthController(MongoDbService db, AuthService auth)
    {
        _db = db;
        _auth = auth;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "Name, email, and password are required" });

        if (dto.Password.Length < 8)
            return BadRequest(new { message = "Password must be at least 8 characters" });

        var existing = await _db.Users.Find(u => u.Email == dto.Email.ToLower().Trim()).FirstOrDefaultAsync();
        if (existing != null)
            return BadRequest(new { message = "Email already registered" });

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email.ToLower().Trim(),
            Password = _auth.HashPassword(dto.Password),
            Role = dto.Role is "candidate" or "employer" ? dto.Role : "candidate"
        };
        await _db.Users.InsertOneAsync(user);

        if (user.Role == "candidate")
        {
            var candidate = new Candidate { UserId = user.Id! };
            await _db.Candidates.InsertOneAsync(candidate);
        }
        else if (user.Role == "employer")
        {
            var company = new Company { UserId = user.Id!, CompanyName = "My Company" };
            await _db.Companies.InsertOneAsync(company);
        }

        return CreatedAtAction(nameof(Register), new MessageResponseDto { Message = "Account created successfully" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _db.Users.Find(u => u.Email == dto.Email.ToLower().Trim()).FirstOrDefaultAsync();
        if (user == null || !_auth.VerifyPassword(dto.Password, user.Password))
            return BadRequest(new { message = "Invalid email or password" });

        if (!user.IsActive)
            return Unauthorized(new { message = "Account is deactivated" });

        var token = _auth.CreateToken(user);
        return Ok(new TokenResponseDto
        {
            AccessToken = token,
            User = new UserOutDto { Id = user.Id!, Name = user.Name, Email = user.Email, Role = user.Role, CreatedAt = user.CreatedAt }
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? User.FindFirst("sub")?.Value;
        if (userId == null) return Unauthorized();

        var user = await _db.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null) return NotFound();

        return Ok(new UserOutDto { Id = user.Id!, Name = user.Name, Email = user.Email, Role = user.Role, CreatedAt = user.CreatedAt });
    }
}
