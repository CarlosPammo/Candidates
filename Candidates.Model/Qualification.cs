namespace Candidates.Model
{
	public enum QualificationType
	{
		None = 0,
		ProfessionalCertification = 1,
		WorkExperience = 2,
		CollegeDegree = 3
	}

	public class Qualification
	{
		public int Id { get; set; }
		public QualificationType Type { get; set; }
		public string Name { get; set; }
	}
}