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

        if (!IsValidEmail(dto.Email))
            return BadRequest(new { message = "Please use a valid email address (e.g. Gmail, Yahoo, Outlook)" });

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

    private static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@')) return false;
        var parts = email.ToLower().Trim().Split('@');
        if (parts.Length != 2) return false;
        var domain = parts[1];

        // Allow known real email domains only
        var allowedDomains = new[]
        {
            "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "live.com",
            "icloud.com", "protonmail.com", "ymail.com", "aol.com", "msn.com",
            "students.au.edu.pk", "au.edu.pk", "edu.pk", "gov.pk", "gmail.com.pk"
        };

        // Also allow any .edu.pk or .com.pk or proper domains with valid TLD
        if (allowedDomains.Contains(domain)) return true;
        if (domain.EndsWith(".edu.pk") || domain.EndsWith(".ac.pk") || domain.EndsWith(".org.pk")) return true;

        // Must have a dot in the domain and domain part must be at least 4 chars
        var domainParts = domain.Split('.');
        if (domainParts.Length < 2) return false;
        var tld = domainParts[^1];
        var sld = domainParts[^2];
        return tld.Length >= 2 && sld.Length >= 2 && !domain.Contains("test") && !domain.Contains("fake") && !domain.Contains("abc");
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
