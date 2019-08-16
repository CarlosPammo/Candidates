using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using Candidates.EFE.Context;

namespace Candidates.EFE
{
	public class Repository<T> : IDisposable where T : class, new()
	{
		public AbstractContext Context { get; set; }

		public Repository(AbstractContext context)
		{
			Context = context;
		}

		public IQueryable<T> Select(Expression<Func<T, bool>> lambda)
		{
			lambda.Compile();
			return Context.Set<T>().Where(lambda).AsQueryable();
		}

		public int Remove(Expression<Func<T, bool>> lambda)
		{
			var matches = Select(lambda);
			var quantity = matches.Count();
			if (matches == null)
			{
				return 0;
			}

			foreach (var match in matches)
			{
				Context.Set<T>().Remove(match);
			}
			Context.SaveChanges();

			return quantity;
		}

		public T Insert(T model)
		{
			var entry = Context.Set<T>().Add(model);
			Context.SaveChanges();
			return entry;
		}

		public int Update(T model)
		{
			var entry = Context.Entry(model);
			Context.Set<T>().Attach(model);
			entry.State = EntityState.Modified;
			return Context.SaveChanges();
		}

		public void Dispose()
		{
			Context?.Dispose();
		}
	}
}