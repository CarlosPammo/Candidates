using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using Candidates.Model;

namespace Candidates.EFE.Map
{
	internal class QualificationMap : EntityTypeConfiguration<Qualification>
	{
		internal QualificationMap(string schema)
		{
			ToTable("Qualification", schema);
			HasKey(p => p.Id);
			Property(p => p.Id).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
			Property(p => p.Id).HasColumnName("Id").IsRequired();
			Property(p => p.Type).HasColumnName("Type").IsRequired();
			Property(p => p.Name).HasColumnName("Name").IsRequired();
		}
	}
}