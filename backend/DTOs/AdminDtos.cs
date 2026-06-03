namespace RecruitmentAPI.DTOs;

public class AdminStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalCandidates { get; set; }
    public int TotalEmployers { get; set; }
    public int TotalJobs { get; set; }
    public int OpenJobs { get; set; }
    public int TotalApplications { get; set; }
    public int TotalCompanies { get; set; }
    public int TotalReviews { get; set; }
    public double AverageReviewRating { get; set; }
}

public class AdminUserOutDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UserStatusUpdateDto
{
    public bool IsActive { get; set; }
}
