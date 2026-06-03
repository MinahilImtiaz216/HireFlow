using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;
using RecruitmentAPI.Services;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/applications")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly MongoDbService _db;

    public ApplicationsController(MongoDbService db) => _db = db;

    private string? GetUserId() =>
        User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
        ?? User.FindFirst("sub")?.Value;

    private string? GetRole() => User.FindFirst("role")?.Value;

    // POST /api/applications/jobs/{jobId}/apply
    [HttpPost("jobs/{jobId}/apply")]
    public async Task<IActionResult> Apply(string jobId, [FromBody] ApplicationCreateDto dto)
    {
        if (GetRole() != "candidate") return Forbid();
        var userId = GetUserId();

        var candidate = await _db.Candidates.Find(c => c.UserId == userId).FirstOrDefaultAsync();
        if (candidate == null) return BadRequest(new { message = "Candidate profile not found" });

        var job = await _db.Jobs.Find(j => j.Id == jobId).FirstOrDefaultAsync();
        if (job == null) return NotFound(new { message = "Job not found" });
        if (job.Status != "open") return BadRequest(new { message = "Job is not accepting applications" });

        var existing = await _db.Applications.Find(a => a.JobId == jobId && a.CandidateId == candidate.Id).FirstOrDefaultAsync();
        if (existing != null) return BadRequest(new { message = "Already applied to this job" });

        var application = new Application
        {
            JobId = jobId,
            CandidateId = candidate.Id!,
            CoverLetter = dto.CoverLetter,
            ResumePath = dto.ResumePath ?? candidate.ResumePath,
            Projects = dto.Projects,
            PriorExperience = dto.PriorExperience,
            PriorCompany = dto.PriorCompany
        };
        await _db.Applications.InsertOneAsync(application);
        return CreatedAtAction(nameof(GetMyApplications), await MapApplication(application));
    }

    // GET /api/applications/my - candidate's own applications
    [HttpGet("my")]
    public async Task<IActionResult> GetMyApplications()
    {
        var userId = GetUserId();
        var role = GetRole();

        if (role == "candidate")
        {
            var candidate = await _db.Candidates.Find(c => c.UserId == userId).FirstOrDefaultAsync();
            if (candidate == null) return Ok(new List<ApplicationOutDto>());
            var apps = await _db.Applications.Find(a => a.CandidateId == candidate.Id).SortByDescending(a => a.AppliedAt).ToListAsync();
            var result = new List<ApplicationOutDto>();
            foreach (var app in apps) result.Add(await MapApplication(app));
            return Ok(result);
        }
        return Forbid();
    }

    // GET /api/applications/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetApplication(string id)
    {
        var app = await _db.Applications.Find(a => a.Id == id).FirstOrDefaultAsync();
        if (app == null) return NotFound();
        return Ok(await MapApplication(app));
    }

    // GET /api/applications/jobs/{jobId} - employer sees applicants for a job
    [HttpGet("jobs/{jobId}")]
    public async Task<IActionResult> GetJobApplications(string jobId)
    {
        var role = GetRole();
        if (role != "employer" && role != "admin") return Forbid();

        var apps = await _db.Applications.Find(a => a.JobId == jobId).SortByDescending(a => a.AppliedAt).ToListAsync();
        var result = new List<ApplicationOutDto>();
        foreach (var app in apps) result.Add(await MapApplication(app));
        return Ok(result);
    }

    // PUT /api/applications/{id}/status - employer updates status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] ApplicationStatusUpdateDto dto)
    {
        var role = GetRole();
        if (role != "employer" && role != "admin") return Forbid();

        var validStatuses = new[] { "submitted", "under_review", "approved", "rejected", "closed" };
        if (!validStatuses.Contains(dto.Status))
            return BadRequest(new { message = "Invalid status" });

        var app = await _db.Applications.Find(a => a.Id == id).FirstOrDefaultAsync();
        if (app == null) return NotFound();

        await _db.Applications.UpdateOneAsync(
            a => a.Id == id,
            Builders<Application>.Update
                .Set(a => a.Status, dto.Status)
                .Set(a => a.UpdatedAt, DateTime.UtcNow)
        );
        var updated = await _db.Applications.Find(a => a.Id == id).FirstOrDefaultAsync();
        return Ok(await MapApplication(updated!));
    }

    // DELETE /api/applications/{id} - candidate withdraws
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteApplication(string id)
    {
        var userId = GetUserId();
        var role = GetRole();
        var app = await _db.Applications.Find(a => a.Id == id).FirstOrDefaultAsync();
        if (app == null) return NotFound();

        if (role == "candidate")
        {
            var candidate = await _db.Candidates.Find(c => c.UserId == userId).FirstOrDefaultAsync();
            if (candidate == null || candidate.Id != app.CandidateId) return Forbid();
        }
        else if (role != "admin") return Forbid();

        await _db.Applications.DeleteOneAsync(a => a.Id == id);
        return Ok(new { message = "Application withdrawn" });
    }

    private async Task<ApplicationOutDto> MapApplication(Application app)
    {
        var job = await _db.Jobs.Find(j => j.Id == app.JobId).FirstOrDefaultAsync();
        var company = job != null ? await _db.Companies.Find(c => c.Id == job.CompanyId).FirstOrDefaultAsync() : null;
        var candidate = await _db.Candidates.Find(c => c.Id == app.CandidateId).FirstOrDefaultAsync();
        var user = candidate != null ? await _db.Users.Find(u => u.Id == candidate.UserId).FirstOrDefaultAsync() : null;

        return new ApplicationOutDto
        {
            Id = app.Id!,
            JobId = app.JobId,
            JobTitle = job?.Title ?? "Unknown",
            CompanyName = company?.CompanyName ?? "Unknown",
            CandidateId = app.CandidateId,
            CandidateName = user?.Name,
            CoverLetter = app.CoverLetter,
            ResumePath = app.ResumePath,
            Projects = app.Projects,
            PriorExperience = app.PriorExperience,
            PriorCompany = app.PriorCompany,
            Status = app.Status,
            AppliedAt = app.AppliedAt,
            UpdatedAt = app.UpdatedAt
        };
    }
}
