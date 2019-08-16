using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Candidates.EFE;
using Candidates.Model;
using Newtonsoft.Json.Linq;

namespace Candidates.Controller
{
	[AllowAnonymous]
	public class SearchController : BaseController
	{
		private Repository<Candidate> Repository => Repository<Candidate>();

		private IEnumerable<Candidate> FilterCandidates(Candidate candidate)
		{
			Expression matching = null;
			var pivot = Expression.Parameter(typeof(Candidate), "candidate");

			if (candidate != null)
			{
				foreach (var property in candidate.GetType().GetProperties())
				{
					var value = property.GetValue(candidate);
					if (property.Name.Equals("Id") || value == null)
					{
						continue;
					}

					var member = Expression.MakeMemberAccess(pivot, property);
					var criteria = Expression.Constant(value, property.PropertyType);

					matching = matching == null
						? Expression.Equal(member, criteria)
						: Expression.AndAlso(matching, Expression.Equal(member, criteria));
				}
			}

			return matching == null
				? Repository.Select(p => true)
				: Repository.Context.Set<Candidate>()
					.Where(Expression.Lambda<Func<Candidate, bool>>(matching, pivot));
		}

		[HttpPost]
		public HttpResponseMessage Search([FromBody]JObject json)
		{
			var candidate = json.GetValue("candidate")?.ToObject<Candidate>();
			var qualification = json.GetValue("qualification")?.ToObject<Qualification>();
			var type = json.GetValue("type")?.ToObject<QualificationType>();
			var date = json.GetValue("date")?.ToObject<DateTime>();

			var candidates = FilterCandidates(candidate);
			if (qualification != null && !qualification.Type.Equals(QualificationType.None))
			{
				candidates = candidates
					.GroupJoin(Repository.Context.Set<CandidateHasQualification>()
					.Where(cq => cq.QualificationId.Equals(qualification.Id)),
						c => c.Id,
						cq => cq.CandidateId,
						(c, cq) => new {Candidate = c, Qualifications = cq})
					.Where(c => c.Qualifications.Any())
					.Select(c => c.Candidate);
			}

			if (type != null)
			{
				candidates = candidates
					.Join(Repository.Context.Set<CandidateHasQualification>(),
						c => c.Id,
						cq => cq.CandidateId,
						(c, cq) => new { Candidate = c, cq.QualificationId})
					.Join(Repository.Context.Set<Qualification>(),
						cq => cq.QualificationId,
						q => q.Id,
						(cq, q) => new { cq.Candidate, Qualification = q})
					.Where(cq => cq.Qualification.Type.Equals(type))
					.Select(cq => cq.Candidate).Distinct();
			}

			if (date != null)
			{
				candidates = candidates
					.GroupJoin(Repository.Context.Set<CandidateHasQualification>()
							.Where(c => date > c.Started && date < c.Completed),
						c => c.Id,
						cq => cq.CandidateId,
						(c, cq) => new
						{
							Candidate = c,
							Qualifications = cq
						})
					.Where(cq => cq.Qualifications.Any())
					.Select(c => c.Candidate);
			}

			return Request.CreateResponse(HttpStatusCode.OK,
				new
				{
					candidates
				});
		}
	}
}