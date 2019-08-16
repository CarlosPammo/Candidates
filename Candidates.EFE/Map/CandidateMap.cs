using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using Candidates.Model;

namespace Candidates.EFE.Map
{
	internal class CandidateMap : EntityTypeConfiguration<Candidate>
	{
		public CandidateMap(string schema)
		{
			ToTable("Candidate", schema);
			HasKey(p => p.Id);
			Property(p => p.Id).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
			Property(p => p.Id).HasColumnName("Id").IsRequired();
			Property(p => p.Firstname).HasColumnName("Firstname").IsRequired();
			Property(p => p.Lastname).HasColumnName("Lastname").IsRequired();
			Property(p => p.Email).HasColumnName("Email");
			Property(p => p.PhoneNumber).HasColumnName("Phone");
			Property(p => p.ZipCode).HasColumnName("Zip");
		}
	}
}
