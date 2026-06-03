using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RecruitmentAPI.Models;

public class Company
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("companyName")]
    public string CompanyName { get; set; } = "My Company";

    [BsonElement("industry")]
    public string? Industry { get; set; }

    [BsonElement("description")]
    public string? Description { get; set; }

    [BsonElement("website")]
    public string? Website { get; set; }

    [BsonElement("location")]
    public string? Location { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
