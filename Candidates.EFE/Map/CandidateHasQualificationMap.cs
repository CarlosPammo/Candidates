using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using Candidates.Model;

namespace Candidates.EFE.Map
{
	public class CandidateHasQualificationMap : EntityTypeConfiguration<CandidateHasQualification>
	{
		public CandidateHasQualificationMap(string schema)
		{
			ToTable("CandidateHasQualification", schema);
			HasKey(p => p.Id);
			Property(p => p.Id).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
			Property(p => p.Id).HasColumnName("Id").IsRequired();
			Property(p => p.Started).HasColumnName("Started").IsRequired();
			Property(p => p.Completed).HasColumnName("Completed").IsRequired();

			Property(p => p.CandidateId).HasColumnName("CandidateId").IsRequired();
			HasRequired(p => p.Candidate).WithMany().HasForeignKey(p => p.CandidateId);

			Property(p => p.QualificationId).HasColumnName("QualificationId").IsRequired();
			HasRequired(p => p.Qualification).WithMany().HasForeignKey(p => p.QualificationId);
		}
	}
}
