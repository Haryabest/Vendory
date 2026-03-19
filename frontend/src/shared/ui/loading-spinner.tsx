export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="relative">
        {/* Внешнее кольцо */}
        <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        
        {/* Внутреннее кольцо */}
        <div className="absolute top-2 left-2 w-16 h-16 border-4 border-purple-300 border-b-purple-500 rounded-full animate-spin" 
             style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        {/* Центр */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
