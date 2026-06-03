using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RecruitmentAPI.Models;

public class Candidate
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("bio")]
    public string? Bio { get; set; }

    [BsonElement("location")]
    public string? Location { get; set; }

    [BsonElement("experienceYears")]
    public int ExperienceYears { get; set; } = 0;

    [BsonElement("degree")]
    public string? Degree { get; set; }

    [BsonElement("skills")]
    public string? Skills { get; set; }

    [BsonElement("resumePath")]
    public string? ResumePath { get; set; }
}
