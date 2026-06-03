using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly MongoDbService _db;

    public AdminController(MongoDbService db) => _db = db;

    private bool IsAdmin() => User.FindFirst("role")?.Value == "admin";

    // GET /api/admin/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        if (!IsAdmin()) return Forbid();

        var users = await _db.Users.Find(_ => true).ToListAsync();
        var jobs = await _db.Jobs.Find(_ => true).ToListAsync();
        var apps = await _db.Applications.CountDocumentsAsync(_ => true);
        var reviews = await _db.Reviews.Find(_ => true).ToListAsync();

        var avgRating = reviews.Count > 0 ? reviews.Average(r => r.Rating) : 0;
        var companyCount = await _db.Companies.CountDocumentsAsync(_ => true);

        return Ok(new AdminStatsDto
        {
            TotalUsers = users.Count,
            TotalCandidates = users.Count(u => u.Role == "candidate"),
            TotalEmployers = users.Count(u => u.Role == "employer"),
            TotalJobs = jobs.Count,
            OpenJobs = jobs.Count(j => j.Status == "open"),
            TotalApplications = (int)apps,
            TotalCompanies = (int)companyCount,
            TotalReviews = reviews.Count,
            AverageReviewRating = Math.Round(avgRating, 1)
        });
    }

    // GET /api/admin/users
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        if (!IsAdmin()) return Forbid();
        var users = await _db.Users.Find(_ => true).SortByDescending(u => u.CreatedAt).ToListAsync();
        return Ok(users.Select(u => new AdminUserOutDto
        {
            Id = u.Id!, Name = u.Name, Email = u.Email, Role = u.Role, IsActive = u.IsActive, CreatedAt = u.CreatedAt
        }));
    }

    // PUT /api/admin/users/{id}/status
    [HttpPut("users/{id}/status")]
    public async Task<IActionResult> UpdateUserStatus(string id, [FromBody] UserStatusUpdateDto dto)
    {
        if (!IsAdmin()) return Forbid();
        var user = await _db.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
        if (user == null) return NotFound();
        await _db.Users.UpdateOneAsync(u => u.Id == id, Builders<User>.Update.Set(u => u.IsActive, dto.IsActive));
        return Ok(new { message = "User status updated" });
    }

    // DELETE /api/admin/users/{id}
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        if (!IsAdmin()) return Forbid();
        var result = await _db.Users.DeleteOneAsync(u => u.Id == id);
        if (result.DeletedCount == 0) return NotFound();
        return Ok(new { message = "User deleted" });
    }

    // GET /api/admin/jobs
    [HttpGet("jobs")]
    public async Task<IActionResult> GetAllJobs()
    {
        if (!IsAdmin()) return Forbid();
        var jobs = await _db.Jobs.Find(_ => true).SortByDescending(j => j.CreatedAt).ToListAsync();
        var result = new List<object>();
        foreach (var job in jobs)
        {
            var company = await _db.Companies.Find(c => c.Id == job.CompanyId).FirstOrDefaultAsync();
            result.Add(new { job.Id, job.Title, CompanyName = company?.CompanyName ?? "Unknown", job.Status, job.Location, job.CreatedAt });
        }
        return Ok(result);
    }

    // DELETE /api/admin/jobs/{id}
    [HttpDelete("jobs/{id}")]
    public async Task<IActionResult> DeleteJob(string id)
    {
        if (!IsAdmin()) return Forbid();
        var result = await _db.Jobs.DeleteOneAsync(j => j.Id == id);
        if (result.DeletedCount == 0) return NotFound();
        return Ok(new { message = "Job deleted" });
    }

    // GET /api/admin/applications
    [HttpGet("applications")]
    public async Task<IActionResult> GetAllApplications()
    {
        if (!IsAdmin()) return Forbid();
        var apps = await _db.Applications.Find(_ => true).SortByDescending(a => a.AppliedAt).ToListAsync();
        return Ok(apps.Select(a => new { a.Id, a.JobId, a.CandidateId, a.Status, a.AppliedAt }));
    }
}
