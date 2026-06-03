namespace RecruitmentAPI.DTOs;

public class ApplicationCreateDto
{
    public string? CoverLetter { get; set; }
    public string? ResumePath { get; set; }
    public string? Projects { get; set; }
    public bool PriorExperience { get; set; } = false;
    public string? PriorCompany { get; set; }
}

public class ApplicationStatusUpdateDto
{
    public string Status { get; set; } = string.Empty;
}

public class ApplicationOutDto
{
    public string Id { get; set; } = string.Empty;
    public string JobId { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string CandidateId { get; set; } = string.Empty;
    public string? CandidateName { get; set; }
    public string? CoverLetter { get; set; }
    public string? ResumePath { get; set; }
    public string? Projects { get; set; }
    public bool PriorExperience { get; set; }
    public string? PriorCompany { get; set; }
    public string Status { get; set; } = "submitted";
    public DateTime AppliedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
