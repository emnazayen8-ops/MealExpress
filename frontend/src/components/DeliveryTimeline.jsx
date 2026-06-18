import { useState, useEffect } from 'react';

const statusIcons = {
  confirmed: '✓',
  preparing: '📦',
  shipped: '🚚',
  in_transit: '🛣️',
  delivered: '🎉',
  cancelled: '✕'
};

const statusColors = {
  confirmed: 'bg-[#61A6AB]',
  preparing: 'bg-[#61A6AB]',
  shipped: 'bg-[#ED5B2D]',
  in_transit: 'bg-[#ED5B2D]',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500'
};

const DeliveryTimeline = ({ timeline, currentStatus }) => {
  const [animatedIndex, setAnimatedIndex] = useState(-1);

  useEffect(() => {
    const currentIdx = timeline.findIndex(t => t.status === currentStatus);
    setAnimatedIndex(currentIdx);
  }, [timeline, currentStatus]);

  return (
    <div className="relative">
      {/* Ligne verticale */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
      
      <div className="space-y-8">
        {timeline.map((step, index) => {
          const isCompleted = step.completed;
          const isCurrent = step.status === currentStatus;
          const isFuture = !isCompleted && !isCurrent;

          return (
            <div 
              key={step.status}
              className={`relative flex items-start gap-4 transition-all duration-500 ${
                isCurrent ? 'scale-105' : ''
              }`}
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Cercle avec icône */}
              <div className={`
                relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold
                transition-all duration-500
                ${isCompleted ? statusColors[step.status] : 'bg-gray-300'}
                ${isCurrent ? 'ring-4 ring-[#F7B9A1] ring-opacity-50 animate-pulse' : ''}
              `}>
                {isCompleted ? statusIcons[step.status] : (
                  isCurrent ? (
                    <span className="animate-spin">⟳</span>
                  ) : (
                    <span className="text-gray-500">○</span>
                  )
                )}
              </div>

              {/* Contenu */}
              <div className={`
                flex-1 pb-8 border-b border-gray-100
                ${isFuture ? 'opacity-50' : 'opacity-100'}
              `}>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-bold text-lg ${
                    isCurrent ? 'text-[#ED5B2D]' : isCompleted ? 'text-[#291B25]' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="bg-[#F7B9A1] text-[#291B25] text-xs px-2 py-1 rounded-full font-semibold">
                      En cours
                    </span>
                  )}
                </div>
                
                <p className={`text-sm ${
                  isCurrent ? 'text-gray-700' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>

                {step.timestamp && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(step.timestamp).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryTimeline;