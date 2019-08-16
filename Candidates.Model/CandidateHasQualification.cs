using System;

namespace Candidates.Model
{
	public class CandidateHasQualification
	{
		public int Id { get; set; }
		public DateTime Started { get; set; }
		public DateTime Completed { get; set; }

		public int CandidateId { get; set; }
		public virtual Candidate Candidate { get; set; }

		public int QualificationId { get; set; }
		public Qualification Qualification { get; set; }
	}
}
