using System;
using Candidates.Error.Properties;

namespace Candidates.Error.Exceptions
{
	public class Critical : AbstractException
	{
		public Critical(Exception exception)
			: base(exception, Severity.Error, Resources.GENERIC_MESSAGE)
		{ }

		public Critical(Exception exception, Severity severity)
			: base(exception, severity, Resources.GENERIC_MESSAGE)
		{ }

		public override void LogException()
		{
			var current = InnerException;
			do
			{
				LogMessage($"Message: {current.Message}. Trace: {current.StackTrace}");
				current = current.InnerException;
			} while (current != null);
		}
	}
}
