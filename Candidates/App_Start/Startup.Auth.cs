using Candidates.Core;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;

namespace Candidates
{
	public partial class Startup
	{
		public static string ClientId { get; }
		public static OAuthAuthorizationServerOptions Authorization { get; }

		static Startup()
		{
			ClientId = "CandidatesApp";
			Authorization = new OAuthAuthorizationServerOptions
			{
				TokenEndpointPath = new PathString("/Token"),
				AuthorizeEndpointPath = new PathString("/api/Login"),
				Provider = new Provider(ClientId),
				AllowInsecureHttp = true
			};
		}

		public void ConfigureAuth(IAppBuilder app)
		{
			app.UseOAuthBearerTokens(Authorization);
		}
	}
}