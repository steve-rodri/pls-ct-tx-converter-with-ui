interface NotificationProps {
  type: 'success' | 'error';
  title: string;
  message: string;
}

export default function Notification({ type, title, message }: NotificationProps) {
  const isSuccess = type === 'success';
  
  return (
    <div className={`mt-6 p-4 rounded-md ${isSuccess ? 'bg-blue-50 border border-blue-200' : 'bg-red-50 border border-red-200'}`}>
      <div className="flex">
        <i className={`fas ${isSuccess ? 'fa-check-circle text-blue-600' : 'fa-exclamation-circle text-red-500'} mt-0.5`}></i>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${isSuccess ? 'text-blue-800' : 'text-red-800'}`}>
            {title}
          </h3>
          <div className={`mt-1 text-sm ${isSuccess ? 'text-blue-700' : 'text-red-700'}`}>
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
