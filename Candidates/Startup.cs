using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Candidates.Startup))]
namespace Candidates
{
	public partial class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			ConfigureAuth(app);
		}
	}
}