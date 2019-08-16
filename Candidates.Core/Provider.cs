using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Owin.Security.OAuth;

namespace Candidates.Core
{
	public class Provider : OAuthAuthorizationServerProvider
	{
		private string ClientId { get; }

		public Provider(string clientId)
		{
			ClientId = clientId;
		}
	}
}
