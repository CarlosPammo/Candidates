using System;

namespace Candidates.Error
{
	public abstract class AbstractException : Exception
	{
		public string FriendlyMessage { get; protected set; }
		public new Exception InnerException { get; protected set; }
		protected Severity Severity { get; set; }

		protected AbstractException(Severity severity, string friendlyMessage)
		{
			Severity = severity;
			FriendlyMessage = friendlyMessage;
		}

		protected AbstractException(Exception exception, Severity severity, string friendlyMessage) :
			this (severity, friendlyMessage)
		{
			InnerException = exception;
		}

		protected void LogMessage(string message)
		{
			Logger.Instance.Write(Severity, message);
		}

		public abstract void LogException();
	}
}
