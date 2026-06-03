using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/companies")]
public class CompaniesController : ControllerBase
{
    private readonly MongoDbService _db;

    public CompaniesController(MongoDbService db) => _db = db;

    private string? GetUserId() =>
        User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
        ?? User.FindFirst("sub")?.Value;

    // GET /api/companies - public
    [HttpGet]
    public async Task<IActionResult> GetCompanies()
    {
        var companies = await _db.Companies.Find(_ => true).ToListAsync();
        var result = new List<CompanyOutDto>();
        foreach (var c in companies)
            result.Add(MapCompany(c));
        return Ok(result);
    }

    // GET /api/companies/{id} - public
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCompany(string id)
    {
        var company = await _db.Companies.Find(c => c.Id == id).FirstOrDefaultAsync();
        if (company == null) return NotFound(new { message = "Company not found" });

        var jobs = await _db.Jobs.Find(j => j.CompanyId == id && j.Status == "open").ToListAsync();
        var reviews = await _db.Reviews.Find(r => r.CompanyId == id).ToListAsync();

        return Ok(new
        {
            company = MapCompany(company),
            openJobCount = jobs.Count,
            reviews = reviews.Select(r => new { r.Id, r.Rating, r.Comment, r.CreatedAt })
        });
    }

    // GET /api/companies/me - employer's own company
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMyCompany()
    {
        var userId = GetUserId();
        var company = await _db.Companies.Find(c => c.UserId == userId).FirstOrDefaultAsync();
        if (company == null) return NotFound(new { message = "Company not found" });
        return Ok(MapCompany(company));
    }

    // PUT /api/companies/me - employer updates own company
    [HttpPut("me")]
    [Authorize]
    public async Task<IActionResult> UpdateMyCompany([FromBody] CompanyUpdateDto dto)
    {
        var userId = GetUserId();
        var company = await _db.Companies.Find(c => c.UserId == userId).FirstOrDefaultAsync();
        if (company == null) return NotFound(new { message = "Company not found" });

        var update = Builders<Company>.Update
            .Set(c => c.CompanyName, dto.CompanyName ?? company.CompanyName)
            .Set(c => c.Industry, dto.Industry ?? company.Industry)
            .Set(c => c.Description, dto.Description ?? company.Description)
            .Set(c => c.Website, dto.Website ?? company.Website)
            .Set(c => c.Location, dto.Location ?? company.Location);

        await _db.Companies.UpdateOneAsync(c => c.Id == company.Id, update);
        var updated = await _db.Companies.Find(c => c.Id == company.Id).FirstOrDefaultAsync();
        return Ok(MapCompany(updated!));
    }

    // GET /api/companies/me/dashboard
    [HttpGet("me/dashboard")]
    [Authorize]
    public async Task<IActionResult> GetDashboard()
    {
        var userId = GetUserId();
        var company = await _db.Companies.Find(c => c.UserId == userId).FirstOrDefaultAsync();
        if (company == null) return NotFound();

        var jobs = await _db.Jobs.Find(j => j.CompanyId == company.Id).ToListAsync();
        var jobIds = jobs.Select(j => j.Id!).ToList();

        var applications = jobIds.Count > 0
            ? await _db.Applications.Find(a => jobIds.Contains(a.JobId)).ToListAsync()
            : new List<Application>();

        var statusCounts = applications.GroupBy(a => a.Status)
            .ToDictionary(g => g.Key, g => g.Count());

        return Ok(new
        {
            company = MapCompany(company),
            totalJobs = jobs.Count,
            openJobs = jobs.Count(j => j.Status == "open"),
            closedJobs = jobs.Count(j => j.Status == "closed"),
            totalApplications = applications.Count,
            applicationStatuses = statusCounts,
            recentJobs = jobs.OrderByDescending(j => j.CreatedAt).Take(5).Select(j => new { j.Id, j.Title, j.Status, j.CreatedAt })
        });
    }

    // GET /api/candidates/me - candidate's own profile
    [HttpGet("/api/candidates/me")]
    [Authorize]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = GetUserId();
        var candidate = await _db.Candidates.Find(c => c.UserId == userId).FirstOrDefaultAsync();
        if (candidate == null) return NotFound();
        var user = await _db.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        return Ok(MapCandidate(candidate, user));
    }

    // PUT /api/candidates/me
    [HttpPut("/api/candidates/me")]
    [Authorize]
    public async Task<IActionResult> UpdateMyProfile([FromBody] CandidateProfileUpdateDto dto)
    {
        var userId = GetUserId();
        var candidate = await _db.Candidates.Find(c => c.UserId == userId).FirstOrDefaultAsync();
        if (candidate == null) return NotFound();

        var update = Builders<Candidate>.Update
            .Set(c => c.Bio, dto.Bio ?? candidate.Bio)
            .Set(c => c.Location, dto.Location ?? candidate.Location)
            .Set(c => c.ExperienceYears, dto.ExperienceYears ?? candidate.ExperienceYears)
            .Set(c => c.Degree, dto.Degree ?? candidate.Degree)
            .Set(c => c.Skills, dto.Skills ?? candidate.Skills)
            .Set(c => c.ResumePath, dto.ResumePath ?? candidate.ResumePath);

        await _db.Candidates.UpdateOneAsync(c => c.Id == candidate.Id, update);
        var updated = await _db.Candidates.Find(c => c.Id == candidate.Id).FirstOrDefaultAsync();
        var user = await _db.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        return Ok(MapCandidate(updated!, user));
    }

    // POST /api/reviews
    [HttpPost("/api/reviews")]
    [Authorize]
    public async Task<IActionResult> CreateReview([FromBody] ReviewCreateDto dto)
    {
        var userId = GetUserId();
        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest(new { message = "Rating must be between 1 and 5" });

        var review = new Review
        {
            UserId = userId!,
            CompanyId = dto.CompanyId,
            Rating = dto.Rating,
            Comment = dto.Comment
        };
        await _db.Reviews.InsertOneAsync(review);
        return CreatedAtAction(nameof(GetCompany), new { }, new { review.Id, review.Rating, review.Comment, review.CreatedAt });
    }

    // GET /api/reviews
    [HttpGet("/api/reviews")]
    public async Task<IActionResult> GetReviews([FromQuery] string? companyId)
    {
        var filter = companyId != null
            ? Builders<Review>.Filter.Eq(r => r.CompanyId, companyId)
            : FilterDefinition<Review>.Empty;

        var reviews = await _db.Reviews.Find(filter).SortByDescending(r => r.CreatedAt).ToListAsync();
        var result = new List<ReviewOutDto>();
        foreach (var r in reviews)
        {
            var user = await _db.Users.Find(u => u.Id == r.UserId).FirstOrDefaultAsync();
            result.Add(new ReviewOutDto { Id = r.Id!, UserId = r.UserId, UserName = user?.Name, UserRole = user?.Role, Rating = r.Rating, Comment = r.Comment, CreatedAt = r.CreatedAt });
        }
        return Ok(result);
    }

    private static CompanyOutDto MapCompany(Company c) => new()
    {
        Id = c.Id!, UserId = c.UserId, CompanyName = c.CompanyName, Industry = c.Industry,
        Description = c.Description, Website = c.Website, Location = c.Location, CreatedAt = c.CreatedAt
    };

    private static CandidateOutDto MapCandidate(Candidate c, User? u) => new()
    {
        Id = c.Id!, UserId = c.UserId, Bio = c.Bio, Location = c.Location, ExperienceYears = c.ExperienceYears,
        Degree = c.Degree, Skills = c.Skills, ResumePath = c.ResumePath, Name = u?.Name, Email = u?.Email
    };
}
