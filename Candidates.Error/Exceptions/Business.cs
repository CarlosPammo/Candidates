namespace Candidates.Error.Exceptions
{
	public class Business : AbstractException
	{
		public Business(string message, Severity severity = Severity.Warning)
			: base(severity, message)
		{ }

		public override void LogException()
		{
			LogMessage(FriendlyMessage);
		}
	}
}